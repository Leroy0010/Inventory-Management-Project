package com.leroy.inventorymanagementspringboot.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TwoFactorResponse {

    private boolean success;
    private String message;
    private boolean requiresTwoFactor;
    private String token; // JWT token if 2FA is successful

    public static TwoFactorResponse success(String token) {
        return new TwoFactorResponse(true, "2FA verification successful", false, token);
    }

    public static TwoFactorResponse requiresTwoFactor(String message) {
        return new TwoFactorResponse(false, message, true, null);
    }

    public static TwoFactorResponse failure(String message) {
        return new TwoFactorResponse(false, message, false, null);
    }
}

