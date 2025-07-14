package com.leroy.inventorymanagementfx.controller.storekeeper;


import com.dlsc.formsfx.model.structure.*;
import com.dlsc.formsfx.model.validators.*;
import com.dlsc.formsfx.view.renderer.FormRenderer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.service.admin.UserService;
import com.leroy.inventorymanagementfx.service.storekeeper.OfficeService;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Window;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class CreateStaffController {
    private Form form;
    private PasswordField password;
    private StringField email;
    private StringField firstName;
    private StringField lastName;
    private SingleSelectionField<String> office;

    private final ObservableList<String> officeOptions = FXCollections.observableArrayList();

    private final Logger logger = LogManager.getLogger(CreateStaffController.class);
    private final UserService userService = new UserService();
    private final OfficeService officeService = new OfficeService();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @FXML private VBox formContainer;
    @FXML private Label errorLabel;
    @FXML private Button submitButton;

    @FXML
    public void initialize() {
        fetchOffices();
        setupForm();
        setupSubmitButton();
    }

    private void setupSubmitButton() {
        submitButton.setOnAction(event -> handleSubmit());
        submitButton.defaultButtonProperty().bind(form.validProperty());
    }

    private void handleSubmit() {
        if (form.isValid()) {
            errorLabel.setVisible(false);
            submitButton.setText("Adding Staff...");
            
            String officeValue =  office.getSelection();

            userService.createStaff(
                    email.getValue(),
                    firstName.getValue(),
                    lastName.getValue(),
                    password.getValue(),
                    officeValue
            ).thenAccept(response -> Platform.runLater(() -> {
                if (response.statusCode() == 201) {
                    showSuccessAlert();
                    form.reset();
                } else {
                    showErrorAlert("Failed to create user: " + response.body());
                    submitButton.setText("Add Staff");
                }
            })).exceptionally(ex -> {
                Platform.runLater(() -> {
                    showErrorAlert("Error creating user: " + ex.getMessage());
                    logger.error("Error creating user", ex);
                    submitButton.setText("Add Staff");
                    
                });
                return null;
            });
        } else {
            errorLabel.setText("Please fix the errors in the form");
            errorLabel.setVisible(true);
            submitButton.setText("Add Staff");
        }
    }

    private void showSuccessAlert() {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Success");
        alert.setHeaderText(null);
        alert.setContentText("Staff created successfully!");
        alert.initModality(Modality.WINDOW_MODAL);
        alert.initOwner(getWindow());
        alert.showAndWait();
    }

    private void showErrorAlert(String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Error");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.initModality(Modality.WINDOW_MODAL);
        alert.initOwner(getWindow());
        alert.showAndWait();
    }
    
    private Window getWindow(){
        return submitButton.getScene().getWindow();
    }
    

    private void setupForm() {
        firstName = Field.ofStringType("")
                .label("First Name")
                .placeholder("Enter first name")
                .validate(StringLengthValidator.atLeast(3, "Name is too short"))
                .required("First Name is required");

        lastName = Field.ofStringType("")
                .label("Last Name")
                .placeholder("Enter last name")
                .validate(StringLengthValidator.atLeast(3, "Name is too short"))
                .required("Last Name is required");

        email = Field.ofStringType("")
                .label("Email")
                .placeholder("Enter email")
                .validate(CustomValidator.forPredicate(
                        email -> email != null && email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$"),
                        "Invalid email format"
                ))
                .required("Email is required");

        password = Field.ofPasswordType("")
                .label("Password")
                .placeholder("Enter password")
                .validate(StringLengthValidator.atLeast(8, "Password must be at least 8 characters"))
                .required("Password is required");
        

        office = Field.ofSingleSelectionType(officeOptions, -1)
                .label("Office")
                .required("Office is required");

        form = Form.of(
                Group.of(
                        firstName,
                        lastName,
                        email,
                        password,
                        office
                )
        );
        
        FormRenderer formRenderer = new FormRenderer(form);
        formContainer.getChildren().add(formRenderer);
        formRenderer.setStyle("-fx-border-color: transparent; -fx-border-width: 0;");
    }

    private void fetchOffices() {
        officeService.getAllOfficesNames().thenAccept(response -> Platform.runLater(() -> {
            if (response == null) {
                logger.error("Response from office service is null.");
                showErrorAlert("Failed to fetch offices: Empty response.");
                return;
            }

            if (response.statusCode() == 200) {
                try {
                    JsonNode responseNode = objectMapper.readTree(response.body());
                    logger.info("Raw offices response: {}", responseNode);

                    ObservableList<String> fetchedOfficeNames = FXCollections.observableArrayList();

                    // Handle different possible response formats
                    if (responseNode.isArray()) {
                        // Case 1: Response is a simple array of strings
                        if (responseNode.elements().next().isTextual()) {
                            for (JsonNode deptNode : responseNode) {
                                fetchedOfficeNames.add(deptNode.asText());
                            }
                        }
                        // Case 2: Response is an array of objects with name property
                        else {
                            for (JsonNode deptObj : responseNode) {
                                JsonNode nameNode = deptObj.path("name");
                                if (!nameNode.isMissingNode()) {
                                    fetchedOfficeNames.add(nameNode.asText());
                                }
                            }
                        }
                    }
                    // Case 3: Response is an object with offices array
                    else if (responseNode.has("offices") && responseNode.get("offices").isArray()) {
                        for (JsonNode deptNode : responseNode.get("offices")) {
                            JsonNode nameNode = deptNode.path("name");
                            if (!nameNode.isMissingNode()) {
                                fetchedOfficeNames.add(nameNode.asText());
                            }
                        }
                    }

                    logger.info("Fetched offices: {}", fetchedOfficeNames);

                    // Clear and update the office options
                    officeOptions.clear();
                    officeOptions.addAll(fetchedOfficeNames);

                    office.items(officeOptions);
                    submitButton.setText("Add Staff");

                } catch (JsonProcessingException e) {
                    logger.error("Error parsing office response", e);
                    showErrorAlert("Failed to parse office data: " + e.getMessage());
                }
            } else {
                try {
                    JsonNode errorNode = objectMapper.readTree(response.body());
                    String errorMsg = errorNode.path("message").asText("Failed to fetch offices");
                    showErrorAlert(errorMsg);
                    logger.error("Office service error: {}", errorMsg);
                } catch (JsonProcessingException e) {
                    showErrorAlert("Failed to fetch offices. Error: " + response.body());
                    logger.error("Error parsing error response", e);
                }
            }
        })).exceptionally(e -> {
            Platform.runLater(() -> {
                logger.error("Office fetch error", e);
                showErrorAlert("Network error fetching offices: " + e.getMessage());
            });
            return null;
        });
    }
}
