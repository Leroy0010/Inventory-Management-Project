package com.leroy.inventorymanagementfx.controller;

import com.leroy.inventorymanagementfx.dto.response.User;
import com.leroy.inventorymanagementfx.security.UserSession;
import com.leroy.inventorymanagementfx.service.admin.UserService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URL;
import java.util.ResourceBundle;

public class ProfileController implements Initializable {
    private final Logger logger = LogManager.getLogger(ProfileController.class);
    private final UserService userService = new UserService();
    private final UserSession userSession = UserSession.getInstance();
    private final String role = userSession.getRole();

    @FXML private Label fullNameLabel;
    @FXML private Label emailLabel;
    @FXML private Label roleLabel;
    @FXML private VBox officeNameContainer; // VBox to hide/show for office name
    @FXML private Label officeNameLabel;
    @FXML private Label errorMessageLabel; // For displaying errors to the user

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Hide error message initially
        errorMessageLabel.setVisible(false);
        errorMessageLabel.setManaged(false);

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
                        errorMessageLabel.setVisible(false);
                        errorMessageLabel.setManaged(false);
                    } else {
                        errorMessageLabel.setText("Failed to load user profile. Please try again.");
                        errorMessageLabel.setVisible(true);
                        errorMessageLabel.setManaged(true);
                        logger.error("User profile received as null.");
                    }
                }))
                .exceptionally(ex -> {
                    Platform.runLater(() -> {
                        errorMessageLabel.setText("Network error: Could not connect to server. Please check your connection.");
                        errorMessageLabel.setVisible(true);
                        errorMessageLabel.setManaged(true);
                        logger.error("Exception loading user profile: {}", ex.getMessage(), ex);
                    });
                    return null;
                });
    }

    private void displayUserProfile(User user) {
        fullNameLabel.setText(user.getFullName());
        emailLabel.setText(user.getEmail());
        roleLabel.setText(role); // Use the role from UserSession for display
        System.out.println(user);

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

    // You can keep these for future implementation if needed, but they are not used in this non-editable version.
    // @FXML private void handleChangePassword() { /* ... */ }
    // @FXML private void handleChangeEmail() { /* ... */ }
    // @FXML private void handleSaveChanges() { /* ... */ }
    // @FXML private void handleCancel() { /* ... */ }
}