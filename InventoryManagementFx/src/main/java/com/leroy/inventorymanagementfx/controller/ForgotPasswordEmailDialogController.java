package com.leroy.inventorymanagementfx.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.service.PasswordResetService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.function.Consumer;

public class ForgotPasswordEmailDialogController {

    @FXML
    private TextField emailField;
    @FXML
    private Label errorMessageLabel;
    @FXML
    private Button sendResetCodeButton;

    private Stage dialogStage;
    private PasswordResetService passwordResetService;
    private ObjectMapper objectMapper;
    private Consumer<Boolean> onEmailSubmitted; // Callback for success/failure

    private static final Logger logger = LogManager.getLogger(ForgotPasswordEmailDialogController.class);

    @FXML
    public void initialize() {
        errorMessageLabel.setText("");
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
    

    public void setOnEmailSubmitted(Consumer<Boolean> onEmailSubmitted) {
        this.onEmailSubmitted = onEmailSubmitted;
    }

    @FXML
    private void handleSendResetCode() {
        String email = emailField.getText();
        if (!email.contains("@")) {
            errorMessageLabel.setText("Please enter a valid email address.");
            return;
        }

        errorMessageLabel.setText("");
        sendResetCodeButton.setText("Sending...");
        sendResetCodeButton.setDisable(true);

        passwordResetService.forgotPassword(email)
                .thenAccept(response -> Platform.runLater(() -> {
                    if (response == null) {
                        errorMessageLabel.setText("Network error. Please try again.");
                        if (onEmailSubmitted != null) onEmailSubmitted.accept(false);
                        return;
                    }

                    if (response.statusCode() == 200) {
                        errorMessageLabel.setText("Reset code sent to your email. Check your inbox.");
                        errorMessageLabel.setStyle("-fx-text-fill: green;"); // Indicate success
                        if (onEmailSubmitted != null) onEmailSubmitted.accept(true);
                        // The dialog will be closed by the LoginController
                    } else {
                        String errorMessage;
                        try {
                            errorMessage = objectMapper.readTree(response.body()).findValue("message").asText();
                        } catch (JsonProcessingException e) {
                            throw new RuntimeException(e);
                        }
                        errorMessageLabel.setText(errorMessage);
                        if (onEmailSubmitted != null) onEmailSubmitted.accept(false);
                    }
                    sendResetCodeButton.setText("Send Reset Code");
                    sendResetCodeButton.setDisable(false);
                }))
                .exceptionally(e -> {
                    Platform.runLater(() -> {
                        errorMessageLabel.setText("An unexpected error occurred: " + e.getMessage());
                        if (onEmailSubmitted != null) onEmailSubmitted.accept(false);
                        sendResetCodeButton.setText("Send Reset Code");
                        sendResetCodeButton.setDisable(false);
                    });
                    logger.error("Error requesting password reset: {}", e.getMessage(), e);
                    return null;
                });
    }
}