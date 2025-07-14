package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.dto.request.GeneralNotificationRequest;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.NotificationType;
import com.leroy.inventorymanagementspringboot.exception.ResourceNotFoundException;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GeneralNotificationService {

    private static final Logger logger = LogManager.getLogger(GeneralNotificationService.class); // Changed

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    public GeneralNotificationService(UserRepository userRepository,
                                      EmailService emailService, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    @Transactional
    public void sendGeneralNotification(GeneralNotificationRequest request, User senderUser) {
        List<User> recipients;

        switch (request.getRecipientType()) {
            case ALL_USERS:
                // Admin specific: Send to all users except the sending admin
                if (!senderUser.getRole().getName().equals("ADMIN")) {
                    throw new SecurityException("Only ADMIN can send notifications to all users.");
                }
                recipients = userRepository.findAll().stream()
                        .filter(user -> user.getId() != senderUser.getId()) // Exclude the sending admin
                        .collect(Collectors.toList());
                break;

            case DEPARTMENT_USERS:
                if (senderUser.getRole().getName().equals("ADMIN")) {
                    // Admin sending to "department users" means all storekeepers
                    recipients = userRepository.findAllByRoleName("STOREKEEPER").orElse(Collections.emptyList());
                } else if (senderUser.getRole().getName().equals("STOREKEEPER")) {
                    if (senderUser.getDepartment() == null) {
                        throw new IllegalStateException("Storekeeper is not associated with a department. Cannot send department-wide notifications.");
                    }
                    // Storekeeper sends to all users in their department (including staff, possibly themselves)
                    recipients = userRepository.findAllByOffice_Department(senderUser.getDepartment())
                            .orElse(Collections.emptyList());
                    // Optionally exclude self if you don't want storekeeper to receive their own broadcast
                    // .filter(user -> user.getId() != senderUser.getId())
                } else {
                    throw new SecurityException("Only ADMIN or STOREKEEPER can send department-wide notifications.");
                }
                break;

            case SPECIFIC_USERS:
                if (request.getUserEmails() == null || request.getUserEmails().isEmpty()) {
                    throw new IllegalArgumentException("User IDs are required for SPECIFIC_USERS recipient type.");
                }

                // Admins can select any specific user. Storekeepers can only select users in their department.
                if (senderUser.getRole().getName().equals("ADMIN")) {
                    recipients = userRepository.findAllByEmailIn(request.getUserEmails());
                    // Check if all requested user IDs actually exist
                    if (recipients.size() != request.getUserEmails().size()) {
                        throw new ResourceNotFoundException("One or more specified user IDs were not found.");
                    }
                } else if (senderUser.getRole().getName().equals("STOREKEEPER")) {
                    Department senderDepartment = senderUser.getDepartment();
                    if (senderDepartment == null) {
                        throw new IllegalStateException("Storekeeper is not associated with a department. Cannot send notifications to specific users.");
                    }
                    // Fetch users by emails AND filter to ensure they belong to the sender's department
                    recipients = userRepository.findAllByEmailIn(request.getUserEmails()).stream()
                            .filter(user -> (user.getDepartment() != null && user.getDepartment().getId() == senderDepartment.getId()) ||
                                    (user.getOffice() != null && user.getOffice().getDepartment().getId() == senderDepartment.getId()))
                            .collect(Collectors.toList());

                    // If filtered list is smaller than requested, it means some users were outside the department
                    if (recipients.size() != request.getUserEmails().size()) {
                        throw new SecurityException("Storekeeper can only send notifications to users within their own department.");
                    }
                } else {
                    throw new SecurityException("Unauthorized to send notifications to specific users.");
                }
                break;

            default:
                throw new IllegalArgumentException("Invalid recipient type: " + request.getRecipientType());
        }

        if (recipients.isEmpty()) {
            logger.warn("No recipients found for general notification. Subject: {}", request.getSubject());
            return;
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());
        for (User recipient : recipients) {
            notificationService.notify(
                    recipient,
                    request.getSubject(),
                    request.getMessage(),
                    NotificationType.GENERAL,
                    now
            );

            emailService.sendGeneralNotificationEmail(
                    recipient.getEmail(),
                    request.getSubject(),
                    request.getMessage(),
                    recipient.getFirstName()
            );
            logger.debug("Sent general notification (in-app + email) to user: {}", recipient.getEmail());
        }
        logger.info("General notification '{}' sent to {} users (in-app and email).", request.getSubject(), recipients.size());
    }
}