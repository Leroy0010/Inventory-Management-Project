// UpdatePasswordRequest.java (Frontend DTO)
package com.leroy.inventorymanagementfx.dto.request;

/**
 * DTO for the password update request on the frontend.
 * Mirrors the backend DTO.
 */
public class UpdatePasswordRequest {
    private String oldPassword;
    private String newPassword;

    public UpdatePasswordRequest() {
    }

    public UpdatePasswordRequest(String oldPassword, String newPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    // Getters
    public String getOldPassword() {
        return oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    // Setters
    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
