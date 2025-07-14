package com.leroy.inventorymanagementfx.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.dto.response.AuthenticationResponse;
import com.leroy.inventorymanagementfx.service.AuthService;
import com.leroy.inventorymanagementfx.config.Config; // Still relying on your Config for Client ID
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import com.leroy.inventorymanagementfx.security.UserSession;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.stage.Stage; // Needed if this controller is for a modal Stage

import java.awt.Desktop; // Still needed to open the system browser
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.net.URISyntaxException; // For URI
import java.util.function.Consumer; // For callback to parent

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class GoogleAuthCodeDialogController { // No longer implements NeedsMainController

    @FXML
    private TextField authorizationCodeField;

    @FXML
    private Label authorizationErrorLabel;

    @FXML
    private Button openBrowserButton; // Button to open system browser

    @FXML
    private Button submitAuthorizationCodeButton; // Button to submit the code

    @FXML
    private Button cancelButton; // To close the dialog/component


    // Dependencies: These are still needed. If not injected, they are instantiated directly.
    private final AuthService authService;
    private final ObjectMapper objectMapper;
    private final UserSession userSession = UserSession.getInstance(); // Often a singleton

    // Configuration for Google OAuth
    private final String googleClientId, redirectUri;
    // Out-of-Band URI for manual copy-paste

    // Reference to the stage if this controller manages a dialog
    private Stage dialogStage;

    // Callback to notify the parent controller/component about success/failure
    private Consumer<Boolean> onAuthCompletion; // True for success, false for failure/cancel

    private static final Logger logger = LogManager.getLogger(GoogleAuthCodeDialogController.class);
    
    
    public GoogleAuthCodeDialogController() {
        this.authService = new AuthService(); // Direct instantiation
        this.objectMapper = new ObjectMapper(); // Direct instantiation
        this.googleClientId = Config.getGoogleClientId(); // Get client ID from Config
        redirectUri = Config.getGoogleRedirectUri();
        logger.warn("GoogleAuthCodeDialogueController instantiated with default no-arg constructor. Consider using a ControllerFactory for dependency injection.");
    }

    // --- Setters for external dependencies/callbacks if this is a dialog ---
    public void setDialogStage(Stage dialogStage) {
        this.dialogStage = dialogStage;
    }

    public void setOnAuthCompletion(Consumer<Boolean> onAuthCompletion) {
        this.onAuthCompletion = onAuthCompletion;
    }
    // ----------------------------------------------------------------------


    @FXML
    public void initialize() {
        authorizationErrorLabel.setManaged(false); // Hide the label initially
        authorizationErrorLabel.setVisible(false);
        authorizationErrorLabel.getStyleClass().add("dialog-status-label"); // Add base class
        authorizationErrorLabel.setWrapText(true);
        authorizationErrorLabel.setStyle("-fx-max-height: auto;");
        // Ensure buttons are enabled initially
        submitAuthorizationCodeButton.setDisable(false);
        openBrowserButton.setDisable(false);
    }

    private void showErrorMessage(String message) {
        authorizationErrorLabel.setText(message);
        authorizationErrorLabel.getStyleClass().setAll("dialog-status-label", "error"); // Set error class
        authorizationErrorLabel.setManaged(true);
        authorizationErrorLabel.setVisible(true);
    }

    private void showInfoMessage(String message) {
        authorizationErrorLabel.setText(message);
        authorizationErrorLabel.getStyleClass().setAll("dialog-status-label", "info"); // Set info class
        authorizationErrorLabel.setManaged(true);
        authorizationErrorLabel.setVisible(true);
    }

    private void showSuccessMessage(String message) {
        authorizationErrorLabel.setText(message);
        authorizationErrorLabel.getStyleClass().setAll("dialog-status-label", "success"); // Set success class
        authorizationErrorLabel.setManaged(true);
        authorizationErrorLabel.setVisible(true);
        
    }

    @FXML
    public void openGoogleLoginInSystemBrowser(ActionEvent event) {
        // Construct the Google OAuth URL for the system browser
        String scope = URLEncoder.encode("openid profile email", StandardCharsets.UTF_8);
        String googleAuthUrl = "https://accounts.google.com/o/oauth2/auth?" +
                "client_id=" + googleClientId + "&" +
                "redirect_uri=" + redirectUri + "&" + // "urn:ietf:wg:oauth:2.0:oob"
                "response_type=code&" +
                "scope=" + scope + "&" +
                "prompt=select_account"; // prompt=select_account forces re-selection

        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(googleAuthUrl));
                authorizationErrorLabel.setText("Google login page opened in your system browser. Please authenticate and copy the code provided, then paste it below.");
                authorizationErrorLabel.setStyle("-fx-text-fill: blue;");
                authorizationErrorLabel.setWrapText(true);
                authorizationErrorLabel.setManaged(true);
                authorizationErrorLabel.setVisible(true);
            } else {
                authorizationErrorLabel.setText("Cannot open system browser automatically. Please open this URL manually:\n" + googleAuthUrl);
                authorizationErrorLabel.setStyle("-fx-text-fill: red;");
                authorizationErrorLabel.setManaged(true);
                authorizationErrorLabel.setVisible(true);
            }
        } catch (IOException | URISyntaxException e) {
            authorizationErrorLabel.setText("Error opening browser: " + e.getMessage());
            authorizationErrorLabel.setStyle("-fx-text-fill: red;");
            authorizationErrorLabel.setManaged(true);
            authorizationErrorLabel.setVisible(true);
            logger.error("Error opening system browser for Google Sign-In: {}", e.getMessage(), e);
        }
    }

    @FXML
    public void submitAuthorizationCode(ActionEvent event){
        String code = authorizationCodeField.getText().trim();
        if (code.isEmpty()) {
            authorizationErrorLabel.setText("Please enter the Google authorization code.");
            authorizationErrorLabel.setStyle("-fx-text-fill: red;");
            authorizationErrorLabel.setManaged(true);
            authorizationErrorLabel.setVisible(true);
            return;
        }

        // Disable UI during submission
        authorizationCodeField.setDisable(true);
        submitAuthorizationCodeButton.setDisable(true);
        openBrowserButton.setDisable(true);

        authorizationErrorLabel.setText("Submitting code...");
        authorizationErrorLabel.setStyle("-fx-text-fill: blue;");
        authorizationErrorLabel.setManaged(true);
        authorizationErrorLabel.setVisible(true);

        sendCodeToBackend(code);
        authorizationCodeField.clear(); // Clear after submission attempt
    }

    private void sendCodeToBackend(String code) {
        // You'll need to implement a method in your AsyncAuthService to send this code
        // to a backend endpoint (e.g., /oauth2/google).
        authService.exchangeCodeForToken(code) // This method must be implemented in AsyncAuthService
                .thenAccept(response -> Platform.runLater(() -> {
                    // Re-enable UI elements regardless of success or failure
                    authorizationCodeField.setDisable(false);
                    submitAuthorizationCodeButton.setDisable(false);
                    openBrowserButton.setDisable(false);

                    if (response != null && response.statusCode() == 200) {
                        try {
                            // Using the injected/instantiated objectMapper
                            JsonNode root = objectMapper.readTree(response.body());

                            // Adapt to your UserSession.initializeSession signature
                            // Example using username and roles (based on previous examples)
                            AuthenticationResponse authenticationResponse = objectMapper.readValue(response.body(), AuthenticationResponse.class);
                            AuthTokenHolder.setJwtToken(authenticationResponse.getJwt());
                            userSession.initializeSession(authenticationResponse.getUserId(), authenticationResponse.getFirstName(), authenticationResponse.getRole());

                            authorizationErrorLabel.setText("Google Sign-In successful!");
                            authorizationErrorLabel.setStyle("-fx-text-fill: green;");
                            authorizationErrorLabel.setManaged(true);
                            authorizationErrorLabel.setVisible(true);
                            logger.info("Google Sign-In successful for user: {}", authenticationResponse.getEmail());

                            // Notify parent component of success and close dialog
                            if (onAuthCompletion != null) {
                                onAuthCompletion.accept(true);
                            }
                            if (dialogStage != null) {
                                dialogStage.close();
                            }

                        } catch (IOException e) {
                            authorizationErrorLabel.setText("Google Sign-In successful, but error processing response.");
                            authorizationErrorLabel.setStyle("-fx-text-fill: red;");
                            authorizationErrorLabel.setManaged(true);
                            authorizationErrorLabel.setVisible(true);
                            logger.error("Error processing Google Sign-In response: {}", e.getMessage(), e);
                        }
                    } else {
                        // Backend returned non-200 status
                        String errorMessage = "Google Sign-In failed: An unknown error occurred."; // Default fallback message
                        if (response != null && response.body() != null) {
                            try {
                                JsonNode errorRoot = objectMapper.readTree(response.body());

                                // **CORRECTED LINE(S) HERE**
                                String error; // Get "error" field
                                error = errorRoot.path("error").asText("");
                                String errorDescription = errorRoot.path("error_description").asText(""); // Get "error_description" field

                                if (!errorDescription.isEmpty()) {
                                    errorMessage = errorDescription; // Prefer error_description if available
                                } else if (!error.isEmpty()) {
                                    errorMessage = error; // Fallback to error if description is empty
                                } else {
                                    errorMessage = "Error: " + response.statusCode() + " - " + response.body(); // Fallback if no specific fields
                                }; // Extract message from error JSON
                            } catch (JsonProcessingException e) {
                                // Fallback if error body is not JSON
                                errorMessage = "Error: " + response.statusCode() + " ," + response.body();
                            }
                        }
                        authorizationErrorLabel.setText("Google Sign-In failed: " + errorMessage);
                        authorizationErrorLabel.setStyle("-fx-text-fill: red;");
                        authorizationErrorLabel.setManaged(true);
                        authorizationErrorLabel.setVisible(true);
                        logger.error("Google Sign-In failed. Status: {}, Body: {}", (response != null ? response.statusCode() : "N/A"), (response != null ? response.body() : "N/A"));

                        // Notify parent component of failure
                        if (onAuthCompletion != null) {
                            onAuthCompletion.accept(false);
                        }
                    }
                }))
                .exceptionally(e -> {
                    Platform.runLater(() -> {
                        // Re-enable UI elements
                        authorizationCodeField.setDisable(false);
                        submitAuthorizationCodeButton.setDisable(false);
                        openBrowserButton.setDisable(false);

                        authorizationErrorLabel.setText("Network error communicating with backend for Google Sign-In. Please try again.");
                        authorizationErrorLabel.setStyle("-fx-text-fill: red;");
                        authorizationErrorLabel.setManaged(true);
                        authorizationErrorLabel.setVisible(true);
                        logger.error("Error during Google Sign-In backend communication: {}", e.getMessage(), e);

                        // Notify parent component of failure
                        if (onAuthCompletion != null) {
                            onAuthCompletion.accept(false);
                        }
                    });
                    return null;
                });
    }

    @FXML
    private void cancel(ActionEvent event) {
        if (dialogStage != null) {
            dialogStage.close(); // Close the dialog
            if (onAuthCompletion != null) {
                onAuthCompletion.accept(false); // Notify parent that auth was cancelled
            }
        }
    }
}