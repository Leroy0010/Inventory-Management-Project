package com.leroy.inventorymanagementfx.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.service.PasswordResetService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class ResetPasswordDialogController {

    @FXML
    private TextField otpField;
    @FXML
    private PasswordField newPasswordField;
    @FXML
    private PasswordField confirmPasswordField;
    @FXML
    private Label errorMessageLabel;
    @FXML
    private Label successMessageLabel;
    @FXML
    private Button resetPasswordButton;

    private Stage dialogStage;
    private PasswordResetService passwordResetService;
    private ObjectMapper objectMapper;

    private static final Logger logger = LogManager.getLogger(ResetPasswordDialogController.class);

    @FXML
    public void initialize() {
        errorMessageLabel.setText("");
        successMessageLabel.setText("");
    }

    public void setDialogStage(Stage dialogStage) {
        this.dialogStage = dialogStage;
    }
    

    public void setPasswordResetService(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    public void setObjectMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @FXML
    private void handleResetPassword() {
        String otp = otpField.getText();
        String newPassword = newPasswordField.getText();
        String confirmPassword = confirmPasswordField.getText();

        if (otp.isEmpty() || newPassword.isEmpty() || confirmPassword.isEmpty()) {
            errorMessageLabel.setText("All fields are required.");
            return;
        }
        if (!newPassword.equals(confirmPassword)) {
            errorMessageLabel.setText("Passwords do not match.");
            return;
        }

        errorMessageLabel.setText("");
        successMessageLabel.setText("");
        resetPasswordButton.setText("Resetting...");
        resetPasswordButton.setDisable(true);

        passwordResetService.resetPassword(otp, newPassword)
                .thenAccept(response -> Platform.runLater(() -> {
                    if (response == null) {
                        errorMessageLabel.setText("Network error. Please try again.");
                        return;
                    }

                    if (response.statusCode() == 200) {
                        successMessageLabel.setText("Password has been reset successfully. You can now log in.");
                        // Optionally, close the dialog after a delay or on button click
                        resetPasswordButton.setText("Close");
                        resetPasswordButton.setOnAction(event -> dialogStage.close()); // Change action to close
                    } else {
                        String errorMessage;
                        try {
                            errorMessage = objectMapper.readTree(response.body()).findValue("message").asText();
                        } catch (JsonProcessingException e) {
                            throw new RuntimeException(e);
                        }
                        errorMessageLabel.setText(errorMessage);
                        resetPasswordButton.setText("Reset Password");
                        resetPasswordButton.setDisable(false);
                    }
                }))
                .exceptionally(e -> {
                    Platform.runLater(() -> {
                        errorMessageLabel.setText("An unexpected error occurred: " + e.getMessage());
                        resetPasswordButton.setText("Reset Password");
                        resetPasswordButton.setDisable(false);
                    });
                    logger.error("Error resetting password: {}", e.getMessage(), e);
                    return null;
                });
    }
}