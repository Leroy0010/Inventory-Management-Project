package com.leroy.inventorymanagementspringboot.service;

import jakarta.mail.internet.MimeMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async; // Import this
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine; // Import this for Thymeleaf

import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private static final Logger logger = LogManager.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine; // Inject Thymeleaf template engine

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl; // For building links in emails

    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendAccountCreatedNotification(String toEmail, String userName) { // Renamed method
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            Context context = new Context();
            context.setVariable("userName", userName);
            // Use a simpler template, or repurpose registration-welcome to be just "account created"
            String htmlContent = templateEngine.process("email/account-created", context); // New template name

            helper.setTo(toEmail);
            helper.setFrom(senderEmail);
            helper.setSubject("Your Inventory Management Account Has Been Created!");
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            logger.info("Async: Account created notification sent successfully to {}", toEmail);
        } catch (MailException e) {
            logger.error("Async: Failed to send account created notification to {}: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            logger.error("Async: Error preparing or sending account created notification to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String userName, String token) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            // The frontend will need to correctly construct this URL based on its routing
            String resetLink = frontendBaseUrl + "/reset-password?token=" + token;
            Context context = new Context();
            context.setVariable("userName", userName);
            context.setVariable("resetLink", resetLink);
            String htmlContent = templateEngine.process("email/password-reset", context);

            helper.setTo(toEmail);
            helper.setFrom(senderEmail);
            helper.setSubject("Password Reset Request for Inventory Management");
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            logger.info("Async: Password reset email sent successfully to {}", toEmail);
        } catch (MailException e) {
            logger.error("Async: Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            logger.error("Async: Error preparing or sending password reset email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    @Async
    public void sendGeneralNotificationEmail(String toEmail, String subject, String messageContent, String recipientName) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            Context context = new Context();
            context.setVariable("recipientName", recipientName);
            context.setVariable("subject", subject);
            context.setVariable("messageContent", messageContent);
            String htmlContent = templateEngine.process("email/general-notification", context);

            helper.setTo(toEmail);
            helper.setFrom(senderEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            logger.info("Async: General notification email sent successfully to {}", toEmail);
        } catch (MailException e) {
            logger.error("Async: Failed to send general notification email to {}: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            logger.error("Async: Error preparing or sending general notification email to {}: {}", toEmail, e.getMessage(), e);
        }
    }
}