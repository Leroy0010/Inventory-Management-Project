package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.annotation.Auditable;
import com.leroy.inventorymanagementspringboot.dto.request.RegisterStaffDto;
import com.leroy.inventorymanagementspringboot.dto.request.RegisterStoreKeeperDto;
import com.leroy.inventorymanagementspringboot.dto.request.UpdatePasswordRequest;
import com.leroy.inventorymanagementspringboot.dto.request.UpdateProfileRequest;
import com.leroy.inventorymanagementspringboot.dto.response.UserEmailAndIdDto;
import com.leroy.inventorymanagementspringboot.dto.response.UserResponseDto;
import com.leroy.inventorymanagementspringboot.dto.response.StaffResponseDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.Office;
import com.leroy.inventorymanagementspringboot.entity.Role;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.AuditAction;
import com.leroy.inventorymanagementspringboot.exception.ResourceNotFoundException;
import com.leroy.inventorymanagementspringboot.mapper.UserMapper;
import com.leroy.inventorymanagementspringboot.repository.*;
import com.leroy.inventorymanagementspringboot.servicei.UserServiceInterface;
import jakarta.persistence.EntityNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // Added import
import java.util.stream.IntStream;

@Service
public class UserService implements UserServiceInterface {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final OfficeRepository officeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    private static final int PASSWORD_LENGTH = 12;
    private static final SecureRandom random = new SecureRandom();
    private static final Logger logger = LogManager.getLogger(UserService.class);

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       OfficeRepository officeRepository, DepartmentRepository departmentRepository,
                       UserMapper userMapper, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.officeRepository = officeRepository;
        this.departmentRepository = departmentRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    /**
     * Generates a random, secure password.
     * @return A randomly generated password string.
     */
    private String generateRandomPassword() {
        return IntStream.range(0, PASSWORD_LENGTH)
                .mapToObj(i -> String.valueOf(CHARACTERS.charAt(random.nextInt(CHARACTERS.length()))))
                .collect(Collectors.joining());
    }

    @Override
    @Transactional
    @Auditable(
            action = AuditAction.CREATE,
            entityClass = User.class
    )
    public User registerAdminOrStoreKeeperByAdmin(RegisterStoreKeeperDto registrationDto) {

        // 1. Fetch target Role for the new user
        Role targetRole = roleRepository.findByName(registrationDto.getRoleName())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + registrationDto.getRoleName()));

        // 2. Validate DTO fields based on target role
        Department department = null;

        switch (targetRole.getName()) {
            case "ADMIN" -> {
                if (registrationDto.getDepartmentName() != null) {
                    throw new IllegalArgumentException("Admin users do not belong to a specific department.");
                }
            }
            case "STOREKEEPER" -> {
                if (registrationDto.getDepartmentName() == null || registrationDto.getDepartmentName().isBlank()) {
                    throw new IllegalArgumentException("Storekeeper must be assigned to a department.");
                }
                department = departmentRepository.findByName(registrationDto.getDepartmentName())
                        .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + registrationDto.getDepartmentName()));

                boolean hasStorekeeper = userRepository.findByDepartmentAndRole(department, targetRole).isPresent();
                if (hasStorekeeper) {
                    throw new IllegalStateException("Store keeper already exists for this department/section!");
                }
            }
            case "STAFF" -> throw new IllegalArgumentException("Staff registration is meant for only Store Keepers.");
            case null, default ->
                    throw new IllegalArgumentException("Invalid role specified: " + registrationDto.getRoleName());
        }

        String generatedPassword = generateRandomPassword(); // Generate random password
        User user = userMapper.toUser(registrationDto); // Use mapper for basic field mapping
        user.setRole(targetRole); // Set fetched Role
        user.setDepartment(department); // Set fetched Department (will be null for ADMIN)
        user.setOffice(null);
        user.setActive(true);
        user.setPassword(passwordEncoder.encode(generatedPassword)); // Encode and set the generated password

        User savedUser = userRepository.save(user);

        // Send a notification that the account is created and they need to use change password
        emailService.sendAccountCreatedNotification(savedUser.getEmail(), savedUser.getFirstName());

        return savedUser;
    }

    @Override
    @Transactional
    @Auditable(
            action = AuditAction.CREATE,
            entityClass = User.class
    )
    public User registerStaffByStoreKeeper(RegisterStaffDto registrationDto, UserDetails userDetails) {
        // Authorization: Ensure the calling user (storekeeper) is indeed a STOREKEEPER
        User storekeeper = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!"STOREKEEPER".equals(storekeeper.getRole().getName())) {
            throw new IllegalStateException("Only a STOREKEEPER can register staff.");
        }
        if (storekeeper.getDepartment() == null) {
            throw new IllegalStateException("Storekeeper is not associated with a department. Cannot register staff.");
        }

        // The role for the new user is implicitly STAFF
        Role staffRole = roleRepository.findByName("STAFF")
                .orElseThrow(() -> new ResourceNotFoundException("Role 'STAFF' not found."));

        // Fetch the target office, ensuring it belongs to the storekeeper's department
        Office targetOffice = officeRepository.findByNameAndDepartment(
                        registrationDto.getOfficeName(), storekeeper.getDepartment())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Office '" + registrationDto.getOfficeName() + "' not found within your department '" + storekeeper.getDepartment().getName() + "'"
                ));

        String generatedPassword = generateRandomPassword(); // Generate random password
        User user = userMapper.toStaffUser(registrationDto); // Use mapper for basic field mapping
        user.setRole(staffRole); // Set fetched Role (STAFF)
        user.setOffice(targetOffice); // Set fetched Office
        user.setDepartment(null); // Explicitly null for Staff
        user.setActive(true);
        user.setPassword(passwordEncoder.encode(generatedPassword)); // Encode and set the generated password

        User savedUser = userRepository.save(user);

        // Send a notification that the account is created and they need to use change password
        emailService.sendAccountCreatedNotification(savedUser.getEmail(), savedUser.getFirstName());
        logger.info("password: {}", generatedPassword);

        return savedUser;
    }

    @Override
    public Optional<List<UserResponseDto>> getUsers(Department department) {
        if (department == null) {
            throw new IllegalArgumentException("Department cannot be null.");
        }
        Optional<List<User>> users = userRepository.findAllByOffice_Department(department);
        return users.map(userMapper::toUserResponseDtoList);
    }

    @Override
    @Auditable(
            action = AuditAction.UPDATE,
            entityClass = User.class
    )
    public void setStaffStatus(UserResponseDto staff) {
        if (staff == null) {
            throw new IllegalArgumentException("Staff cannot be null.");
        }

        Optional<User> user = userRepository.findById(staff.getId());

        user.ifPresent(value -> {
            value.setActive(staff.isActive());
            userRepository.save(value);
        });
    }

    public Optional<List<String>> fetchGeneralNotificationServiceUsersEmails(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (user.getRole().getName().equals("ADMIN")) {
            return userRepository.findAllByIdNot(user.getId())
                    .map(users -> users.stream().map(User::getEmail).collect(Collectors.toList())); // Use toList()
        } else if (user.getRole().getName().equals("STOREKEEPER")){
            return userRepository.findAllByOffice_DepartmentAndIdNot(user.getDepartment(), user.getId())
                    .map(users -> users.stream().map(User::getEmail).collect(Collectors.toList())); // Use toList()
        } else throw new SecurityException("Only ADMIN or STOREKEEPER roles can be found.");
    }

    @Override
    public UserResponseDto fetchUserDetails(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return userMapper.toUserResponseDto(user);
    }

    @Override
    public void changePassword(UpdatePasswordRequest updatePasswordRequest, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        // Validate old password
        if (!passwordEncoder.matches(updatePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Validate new password and confirmation match
        if (!updatePasswordRequest.getNewPassword().equals(updatePasswordRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }
        
        // Validate new password is different from old password
        if (passwordEncoder.matches(updatePasswordRequest.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }
        
        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getNewPassword()));
        userRepository.save(user);
    }
    
    @Override
    public UserResponseDto updateProfile(UpdateProfileRequest updateProfileRequest, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        // Check if email is being changed and if it's already taken by another user
        if (!user.getEmail().equals(updateProfileRequest.getEmail())) {
            Optional<User> existingUser = userRepository.findByEmail(updateProfileRequest.getEmail());
            if (existingUser.isPresent() && !(existingUser.get().getId() == user.getId())) {
                throw new IllegalArgumentException("Email is already taken by another user");
            }
        }
        
        // Update user fields
        user.setFirstName(updateProfileRequest.getFirstName());
        user.setLastName(updateProfileRequest.getLastName());
        user.setEmail(updateProfileRequest.getEmail());
        user.setPhone(updateProfileRequest.getPhone());
        user.setBio(updateProfileRequest.getBio());
        
        User savedUser = userRepository.save(user);
        return userMapper.toUserResponseDto(savedUser);
    }

    public Optional<List<UserEmailAndIdDto>> getEmailsAndIds(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (!user.getRole().getName().equals("STOREKEEPER"))
            throw new IllegalStateException("Only storekeepers are allowed.");

        Department department = user.getDepartment();

        if (department == null)
            throw new SecurityException("Department cannot be null.");

        var users = userRepository.findAllByOffice_Department(department);

        return users
                .map(userDto -> userDto.stream().map(userMapper::toUserEmailAndIdDto).collect(Collectors.toList())); // Use toList()
    }

    public List<StaffResponseDto> getDepartmentStaff(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!user.getRole().getName().equals("STOREKEEPER"))
            throw new IllegalStateException("Only storekeepers are allowed.");

        

        Department department = user.getDepartment();

        List<User> users = userRepository.findAllByOffice_Department(department).orElse(null);
        assert users != null;

        return users.stream().map(userMapper::toStaffResponseDto).toList();
    }
}
