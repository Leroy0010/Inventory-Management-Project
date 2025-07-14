package com.leroy.inventorymanagementfx.controller;

import com.dlsc.formsfx.model.structure.Field;
import com.dlsc.formsfx.model.structure.Form;
import com.dlsc.formsfx.model.structure.Group;
import com.dlsc.formsfx.model.structure.PasswordField;
import com.dlsc.formsfx.model.structure.StringField; 
import com.dlsc.formsfx.model.validators.CustomValidator;
import com.dlsc.formsfx.view.renderer.FormRenderer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.dto.response.AuthenticationResponse;
import com.leroy.inventorymanagementfx.enums.AdminPages;
import com.leroy.inventorymanagementfx.enums.CommonPages;
import com.leroy.inventorymanagementfx.enums.StaffPages;
import com.leroy.inventorymanagementfx.enums.StorekeeperPages;
import com.leroy.inventorymanagementfx.interfaces.FxmlPage;
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import com.leroy.inventorymanagementfx.security.UserSession;
import com.leroy.inventorymanagementfx.service.AuthService;
import com.leroy.inventorymanagementfx.service.PasswordResetService;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Stage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.util.Arrays;
import java.util.Objects;

import static javafx.scene.input.KeyCode.ENTER;

public class LoginController implements NeedsMainController {

    @FXML
    private VBox formContainer;

    @FXML
    private Label errorLabel, resetPasswordLabel;

    @FXML
    private Button loginButton;
    
    private final AuthService authService;
    private final ObjectMapper objectMapper;
    private final UserSession userSession = UserSession.getInstance();
    private final PasswordResetService passwordResetService;
    
    private MainController mainController;
    
    private static final Logger logger = LogManager.getLogger(LoginController.class);

    // Declare with the specific field types
    private StringField emailField;
    private PasswordField passwordField;
    private Form form;
    
    public LoginController() {
        this.authService = new AuthService(); // Replace with actual way of initializing
        this.objectMapper = new ObjectMapper();
        this.passwordResetService = new PasswordResetService();
    }

    public void setMainController(MainController mainController) {
        this.mainController = mainController;
    }
    

    @FXML
    public void initialize() {
        setupForm();
        errorLabel.setText("");

        emailField.getRenderer().setOnKeyPressed(event -> {
            if (Objects.requireNonNull(event.getCode()) == ENTER) {
                loginButton.fire();
            }
        });
        passwordField.getRenderer().setOnKeyPressed(event -> {
            if (Objects.requireNonNull(event.getCode()) == ENTER) {
                loginButton.fire();
            }
        });

        resetPasswordLabel.setOnMouseClicked(this::onForgotPasswordClick);
    }

    private void setupForm() {
        // Use the specific field types returned by the factory methods
        emailField = Field.ofStringType("")
                .label("Email")
                .placeholder("Enter email")
                .validate(CustomValidator.forPredicate(
                                email -> email != null && email.contains("@"),
                                "Invalid email. Email must contain @"
                        ))
                .required("Email is required");

        passwordField = Field.ofPasswordType("")
                .label("Password")
                .placeholder("Enter password")
                .required("Password is required");

        form = Form.of(
                Group.of(emailField, passwordField)
        ).title("Login");

        FormRenderer formRenderer = new FormRenderer(form);
        formContainer.getChildren().add(formRenderer);

        formRenderer.setStyle("-fx-border-color: transparent; -fx-border-width: 0;");
        formRenderer.getStyleClass().add("form-renderer");
    }

    @FXML
    public void login() {
        errorLabel.setText("");
        loginButton.setText("Logging in...");
        AuthTokenHolder.clearAuth();

        // When form.isValid() is called, it automatically triggers validation
        // for all fields in the form.
        if (!form.isValid()) {
            errorLabel.setText("Please correct the errors above.");
            return;
        }

        // Access values directly from the specific field types
        String email = emailField.getValue();
        String password = passwordField.getValue();
        
        authService.login(email, password)
                .thenAccept(response -> Platform.runLater(() -> {
                    if (response == null) {
                        errorLabel.setText("Login Failed due to Network error. try again!");
                        return;
                    }
                    
                    if (response.statusCode() == 200){
                        try {
                            AuthenticationResponse authenticationResponse = objectMapper.readValue(response.body(), AuthenticationResponse.class);
                            AuthTokenHolder.setJwtToken(authenticationResponse.getJwt());
                            userSession.initializeSession(authenticationResponse.getUserId(), authenticationResponse.getFirstName(), authenticationResponse.getRole());
                            
                            String role = authenticationResponse.getRole();
                            FxmlPage defaultPage = getDefaultPage(role); // Use MainController's logic
                            if (mainController != null) {
                                mainController.loadView(defaultPage);
                                mainController.loadTopBar(getDefaultTopBar(role));
                                mainController.loadSideBar(getDefaultSidebar(role));
                                // Potentially update sidebar/topbar if MainController doesn't do it automatically on loadPage
                            } else {
                                logger.warn("MainController not set. Cannot navigate after successful Google login.");
                                // Handle if MainController is not available
                            }
                            
                        } catch (JsonProcessingException e){
                            errorLabel.setText("Login successful, but error processing response.");
                            logger.error("Login successful, but error processing response. Error: {}", Arrays.toString(e.getStackTrace()));
                            
                        }
                    } else {
                        try {
                            JsonNode root = objectMapper.readTree(response.body());
                            String errorMessage = root.path("message").asText("Login failed.");
                            errorLabel.setText(errorMessage);
                            loginButton.setText("Login");
                        } catch (JsonProcessingException e) {
                            errorLabel.setText("Login failed. ");
                            loginButton.setText("Login");
                            logger.error("Error parsing error response: {}", e.getMessage());
                        }
                        
                    }
                })).exceptionally(e -> {
                    Platform.runLater(() -> {
                        errorLabel.setText("Network error. Please try again.");
                        loginButton.setText("Login");
                    });
                    logger.error("Error: {}", Arrays.toString(e.getStackTrace()));
                    return null;
                });
        
    }

    @FXML
    public void googleSignIn(ActionEvent actionEvent) {
        errorLabel.setText(""); // Clear any previous errors

        try {
            // 1. Load the FXML for the Google Auth Code Dialog
            // Ensure the path is correct based on where you put google_auth_code_dialog.fxml
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/common/google-auth-code-dialog.fxml"));

            // 2. Set a custom Controller Factory for the dialog
            // This is crucial for injecting AuthService and ObjectMapper into the dialog's controller
            loader.setControllerFactory(type -> {
                if (type == GoogleAuthCodeDialogController.class) { // Corrected name to GoogleSignInPageController
                    // Pass the same instances of authService and objectMapper used by LoginController
                    return new GoogleAuthCodeDialogController();
                }
                // Fallback for other controllers if needed in the dialog's FXML (unlikely)
                try {
                    return type.getDeclaredConstructor().newInstance();
                } catch (Exception e) {
                    logger.error("Failed to create controller of type {}: {}", type.getName(), e.getMessage(), e);
                    throw new RuntimeException("Failed to create controller: " + type.getName(), e);
                }
            });

            VBox dialogContent = loader.load(); // Assuming the root of dialog FXML is VBox
            GoogleAuthCodeDialogController dialogController = loader.getController(); // Get the controller instance

            // 3. Create a new Stage for the pop-up dialog
            Stage dialogStage = new Stage();
            dialogStage.setTitle("Sign in with Google");
            dialogStage.initModality(Modality.WINDOW_MODAL); // Make it modal (blocks interaction with parent)
            // Get the current window (LoginController's window) as the owner
            dialogStage.initOwner(loginButton.getScene().getWindow());
            dialogStage.setScene(new Scene(dialogContent));
            dialogStage.setResizable(false); // Make it non-resizable

            // 4. Pass the dialog stage and a success callback to the dialog controller
            dialogController.setDialogStage(dialogStage);
            dialogController.setOnAuthCompletion(success -> {
                if (success) {
                    
                    // Google Sign-In was successful, now navigate to the dashboard
                    String role = userSession.getRole();
                    FxmlPage defaultPage = getDefaultPage(role); // Use MainController's logic
                    // Handle if MainController is not available
                    if (mainController != null) {
                        mainController.loadView(defaultPage);
                        mainController.loadTopBar(getDefaultTopBar(role));
                        mainController.loadSideBar(getDefaultSidebar(role));
//                        dialogStage.close();
                        // Potentially update sidebar/topbar if MainController doesn't do it automatically on loadPage
                    } else logger.warn("MainController not set. Cannot navigate after successful Google login.");
                    
                } else {
                    Platform.runLater(() -> {
                        // Google Sign-In was canceled or failed
                        errorLabel.setText("Google Sign-In was cancelled or failed.");
                        errorLabel.setVisible(true);
                        // Optionally re-enable login button if it was disabled
                        loginButton.setText("Login");
                    });
                }
            });

            // 5. Show the dialog and wait for it to be closed
            dialogStage.showAndWait();

        } catch (IOException e) {
            errorLabel.setText("Error opening Google Sign-In dialog.");
            errorLabel.setVisible(true);
            logger.error("Failed to load Google Sign-In dialog: {}", e.getMessage(), e);
        }
    }

    @FXML
    private void onForgotPasswordClick(MouseEvent event) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource(CommonPages.REQUEST_RESET_PASSWORD.getPath()));
            VBox dialogContent = loader.load();
            ForgotPasswordEmailDialogController controller = loader.getController();

            Stage dialogStage = new Stage();
            dialogStage.setTitle("Forgot Password");
            dialogStage.initModality(Modality.WINDOW_MODAL);
            dialogStage.initOwner(resetPasswordLabel.getScene().getWindow());
            dialogStage.setScene(new Scene(dialogContent));
            dialogStage.setResizable(false);

            controller.setDialogStage(dialogStage);
            controller.setPasswordResetService(passwordResetService); // Inject the service
            controller.setObjectMapper(objectMapper); // Inject ObjectMapper for error parsing

            // Set a callback for when the email submission is successful
            controller.setOnEmailSubmitted(success -> {
                if (success) {
                    Platform.runLater(() -> {
                        dialogStage.close(); // Close the email input dialog
                        openResetPasswordDialog(); // Open the reset password dialog
                    });
                }
            });

            dialogStage.showAndWait();

        } catch (IOException e) {
            errorLabel.setText("Error opening forgot password dialog.");
            logger.error("Failed to load forgot password dialog: {}", e.getMessage(), e);
        }
    }


    private void openResetPasswordDialog() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource(CommonPages.RESET_PASSWORD.getPath()));
            VBox dialogContent = loader.load();
            ResetPasswordDialogController controller = loader.getController();

            Stage dialogStage = new Stage();
            dialogStage.setTitle("Reset Password");
            dialogStage.initModality(Modality.WINDOW_MODAL);
            dialogStage.initOwner(resetPasswordLabel.getScene().getWindow());
            dialogStage.setScene(new Scene(dialogContent));
            dialogStage.setResizable(false);

            controller.setDialogStage(dialogStage);
            controller.setPasswordResetService(passwordResetService); // Inject the service
            controller.setObjectMapper(objectMapper); // Inject ObjectMapper

            dialogStage.showAndWait();

        } catch (IOException e) {
            errorLabel.setText("Error opening reset password dialog.");
            logger.error("Failed to load reset password dialog: {}", e.getMessage(), e);
        }
    }


    // Helper method copied from MainController (or provided by a shared utility)
    private FxmlPage getDefaultPage(String role) {
        return switch (role) {
            case "ADMIN" -> AdminPages.DASHBOARD;
            case "STOREKEEPER" -> StorekeeperPages.DASHBOARD;
            default  -> StaffPages.DASHBOARD;
            // Assuming CommonPages.LOGIN is where you are now, need a default dashboard or error
        };
        
    }
    
    private FxmlPage getDefaultTopBar(String role) {
        return switch (role) {
            case "ADMIN" -> AdminPages.TOPBAR;
            case "STOREKEEPER" -> StorekeeperPages.TOPBAR;
            default -> StaffPages.TOPBAR;
        };
    }
    
    private FxmlPage getDefaultSidebar(String role){
        return switch (role) {
            case "ADMIN" -> AdminPages.SIDEBAR;
            case "STOREKEEPER" -> StorekeeperPages.SIDEBAR;
            default -> StaffPages.SIDEBAR;
        };
    }
    
    
}