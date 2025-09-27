package com.leroy.inventorymanagementspringboot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 3;

    // In-memory storage for OTPs (in production, use Redis or database)
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    @Autowired
    private EmailService emailService;

    /**
     * Generate and send OTP to user's email
     */
    public boolean generateAndSendOtp(String email, String userFullName) {
        try {
            // Generate 6-digit OTP
            String otp = generateOtp();

            // Store OTP with expiry
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
            OtpData otpData = new OtpData(otp, expiryTime, 0);
            otpStorage.put(email, otpData);

            // Send OTP via email using dedicated 2FA template
            emailService.sendTwoFactorOtpEmail(email, userFullName, otp);

            return true;
        } catch (Exception e) {
            // Log error but don't expose details
            System.err.println("Failed to generate/send OTP for " + email + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Verify OTP for user
     */
    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);

        if (otpData == null) {
            return false; // No OTP found
        }

        // Check if OTP has expired
        if (LocalDateTime.now().isAfter(otpData.getExpiryTime())) {
            otpStorage.remove(email);
            return false;
        }

        // Check if max attempts exceeded
        if (otpData.getAttempts() >= MAX_ATTEMPTS) {
            otpStorage.remove(email);
            return false;
        }

        // Increment attempts
        otpData.incrementAttempts();

        // Verify OTP
        if (otpData.getOtp().equals(otp)) {
            otpStorage.remove(email); // Remove OTP after successful verification
            return true;
        }

        return false;
    }

    /**
     * Check if user has a valid OTP (not expired, not exceeded attempts)
     */
    public boolean hasValidOtp(String email) {
        OtpData otpData = otpStorage.get(email);

        if (otpData == null) {
            return false;
        }

        // Check if OTP has expired
        if (LocalDateTime.now().isAfter(otpData.getExpiryTime())) {
            otpStorage.remove(email);
            return false;
        }

        // Check if max attempts exceeded
        if (otpData.getAttempts() >= MAX_ATTEMPTS) {
            otpStorage.remove(email);
            return false;
        }

        return true;
    }

    /**
     * Remove OTP (cleanup)
     */
    public void removeOtp(String email) {
        otpStorage.remove(email);
    }

    /**
     * Generate 6-digit OTP
     */
    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = random.nextInt(900000) + 100000; // 100000 to 999999
        return String.valueOf(otp);
    }

    /**
     * OTP data holder
     */
    private static class OtpData {
        private final String otp;
        private final LocalDateTime expiryTime;
        private int attempts;

        public OtpData(String otp, LocalDateTime expiryTime, int attempts) {
            this.otp = otp;
            this.expiryTime = expiryTime;
            this.attempts = attempts;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }

        public int getAttempts() {
            return attempts;
        }

        public void incrementAttempts() {
            this.attempts++;
        }
    }
}
