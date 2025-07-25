// ProfileController.java (Frontend Controller - Updated for Password Change)
package com.leroy.inventorymanagementfx.controller;

import com.leroy.inventorymanagementfx.dto.request.UpdatePasswordRequest; // New import
import com.leroy.inventorymanagementfx.dto.response.User;
import com.leroy.inventorymanagementfx.security.UserSession;
import com.leroy.inventorymanagementfx.service.admin.UserService; // This is the frontend UserService
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField; // New import
import javafx.scene.layout.VBox;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URL;
import java.util.ResourceBundle;

public class ProfileController implements Initializable {
    private final Logger logger = LogManager.getLogger(ProfileController.class);
    private final UserService userService = new UserService(); // Frontend UserService
    private final UserSession userSession = UserSession.getInstance();
    private final String role = userSession.getRole();

    @FXML private Label fullNameLabel;
    @FXML private Label emailLabel;
    @FXML private Label roleLabel;
    @FXML private VBox officeNameContainer;
    @FXML private Label officeNameLabel;
    @FXML private Label errorMessageLabel;
    @FXML private Label successMessageLabel; // New success message label

    // New FXML fields for password change
    @FXML private PasswordField oldPasswordField;
    @FXML private PasswordField newPasswordField;
    @FXML private PasswordField confirmNewPasswordField;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Hide messages initially
        errorMessageLabel.setVisible(false);
        errorMessageLabel.setManaged(false);
        successMessageLabel.setVisible(false);
        successMessageLabel.setManaged(false);

        // Hide office name container by default, show only if role is STAFF
        officeNameContainer.setVisible(false);
        officeNameContainer.setManaged(false);

        loadUserProfile();
    }

    private void loadUserProfile() {
        userService.getUserProfile()
                .thenAccept(user -> Platform.runLater(() -> {
                    if (user != null) {
                        displayUserProfile(user);
                        hideMessages(); // Hide any previous messages
                    } else {
                        showErrorMessage("Failed to load user profile. Please try again.");
                        logger.error("User profile received as null.");
                    }
                }))
                .exceptionally(ex -> {
                    Platform.runLater(() -> {
                        showErrorMessage("Network error: Could not connect to server. Please check your connection.");
                        logger.error("Exception loading user profile: {}", ex.getMessage(), ex);
                    });
                    return null;
                });
    }

    private void displayUserProfile(User user) {
        fullNameLabel.setText(user.getFullName());
        emailLabel.setText(user.getEmail());
        roleLabel.setText(role); // Use the role from UserSession for display

        // Display office name only for STAFF role
        if ("STAFF".equalsIgnoreCase(role)) {
            officeNameLabel.setText(user.getOfficeName());
            officeNameContainer.setVisible(true);
            officeNameContainer.setManaged(true);
        } else {
            officeNameContainer.setVisible(false);
            officeNameContainer.setManaged(false);
        }
    }

    /**
     * Handles the action for changing the user's password.
     */
    @FXML
    private void handleChangePassword() {
        hideMessages(); // Clear previous messages

        String oldPassword = oldPasswordField.getText();
        String newPassword = newPasswordField.getText();
        String confirmNewPassword = confirmNewPasswordField.getText();

        // Basic client-side validation
        if (oldPassword.isEmpty() || newPassword.isEmpty() || confirmNewPassword.isEmpty()) {
            showErrorMessage("All password fields are required.");
            return;
        }

        if (newPassword.length() < 8) {
            showErrorMessage("New password must be at least 8 characters long.");
            return;
        }

        if (!newPassword.equals(confirmNewPassword)) {
            showErrorMessage("New password and confirm new password do not match.");
            return;
        }

        // Create the request DTO
        UpdatePasswordRequest request = new UpdatePasswordRequest(oldPassword, newPassword);

        // Call the service to change password
        userService.changePassword(request)
                .thenAccept(response -> Platform.runLater(() -> {
                    if (response.statusCode() == 200) {
                        showSuccessMessage("Password changed successfully!");
                        // Clear password fields after successful change
                        oldPasswordField.clear();
                        newPasswordField.clear();
                        confirmNewPasswordField.clear();
                    } else if (response.statusCode() == 400) {
                        // Assuming 400 for bad request, e.g., old password mismatch
                        showErrorMessage("Failed to change password. Please check your old password.");
                        logger.warn("Password change failed: Status {}, Body: {}", response.statusCode(), response.body());
                    } else {
                        showErrorMessage("Failed to change password. An unexpected error occurred.");
                        logger.error("Password change failed with status {}: {}", response.statusCode(), response.body());
                    }
                }))
                .exceptionally(ex -> {
                    Platform.runLater(() -> {
                        showErrorMessage("Network error: Could not connect to server to change password.");
                        logger.error("Exception during password change: {}", ex.getMessage(), ex);
                    });
                    return null;
                });
    }

    /**
     * Displays an error message to the user.
     * @param message The error message to display.
     */
    private void showErrorMessage(String message) {
        errorMessageLabel.setText(message);
        errorMessageLabel.setVisible(true);
        errorMessageLabel.setManaged(true);
        successMessageLabel.setVisible(false);
        successMessageLabel.setManaged(false);
    }

    /**
     * Displays a success message to the user.
     * @param message The success message to display.
     */
    private void showSuccessMessage(String message) {
        successMessageLabel.setText(message);
        successMessageLabel.setVisible(true);
        successMessageLabel.setManaged(true);
        errorMessageLabel.setVisible(false);
        errorMessageLabel.setManaged(false);
    }

    /**
     * Hides both error and success messages.
     */
    private void hideMessages() {
        errorMessageLabel.setVisible(false);
        errorMessageLabel.setManaged(false);
        successMessageLabel.setVisible(false);
        successMessageLabel.setManaged(false);
    }
}
