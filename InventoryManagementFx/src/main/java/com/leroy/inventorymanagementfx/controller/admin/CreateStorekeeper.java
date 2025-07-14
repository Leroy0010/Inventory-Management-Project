package com.leroy.inventorymanagementfx.controller.admin;

import com.dlsc.formsfx.model.structure.*;
import com.dlsc.formsfx.model.validators.*;
import com.dlsc.formsfx.view.renderer.FormRenderer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.service.admin.DepartmentService;
import com.leroy.inventorymanagementfx.service.admin.UserService;
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

public class CreateStorekeeper {
    private Form form;
    private PasswordField password;
    private StringField email;
    private StringField firstName;
    private StringField lastName;
    private SingleSelectionField<String> role;
    private SingleSelectionField<String> department;

    private final ObservableList<String> roleOptions = FXCollections.observableArrayList();
    private final ObservableList<String> departmentOptions = FXCollections.observableArrayList();

    private final Logger logger = LogManager.getLogger(CreateStorekeeper.class);
    private final UserService userService = new UserService();
    private final DepartmentService departmentService = new DepartmentService();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @FXML private VBox formContainer;
    @FXML private Label errorLabel;
    @FXML private Button submitButton;

    @FXML
    public void initialize() {
        initializeRoleOptions();
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
            submitButton.setText("Adding...");

            String roleValue = role.getSelection();
            String departmentValue = "STOREKEEPER".equals(roleValue) ? department.getSelection() : null;

            userService.createStoreKeeperOrAdmin(
                    email.getValue(),
                    firstName.getValue(),
                    lastName.getValue(),
                    password.getValue(),
                    roleValue,
                    departmentValue
            ).thenAccept(response -> Platform.runLater(() -> {
                if (response.statusCode() == 201) {
                    showSuccessAlert();
                    form.reset();
                } else {
                    showErrorAlert("Failed to create user: " + response.body());
                    submitButton.setText("Add");
                }
            })).exceptionally(ex -> {
                Platform.runLater(() -> {
                    showErrorAlert("Error creating user: " + ex.getMessage());
                    logger.error("Error creating user", ex);
                    submitButton.setText("Add");
                });
                return null;
            });
        } else {
            errorLabel.setText("Please fix the errors in the form");
            errorLabel.setVisible(true);
            submitButton.setText("Add");
        }
    }

    private void showSuccessAlert() {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Success");
        alert.setHeaderText(null);
        alert.setContentText("User created successfully!");
        alert.initModality(Modality.WINDOW_MODAL);
        alert.initOwner(getWindow());
        alert.showAndWait();
        submitButton.setText("Add");
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

    private Window getWindow() {
        return submitButton.getScene().getWindow();
    }

    private void initializeRoleOptions() {
        roleOptions.addAll("ADMIN", "STOREKEEPER");
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

        role = Field.ofSingleSelectionType(roleOptions, -1)
                .label("Role")
                .validate(CustomValidator.forPredicate(role -> role != null && (!role.equals("ADMIN") || !role.equals("STOREKEEPER")), "Invalid role"))
                .required("Role is required");

        department = Field.ofSingleSelectionType(departmentOptions, -1)
                .label("Department");

        form = Form.of(
                Group.of(
                        firstName,
                        lastName,
                        email,
                        password,
                        role,
                        department
                )
        );

        role.selectionProperty().addListener((obs, oldVal, newVal) -> {
            if ("STOREKEEPER".equals(newVal)) {
                fetchDepartments();
                department.required("Department is required for store keepers");
            } else {
                departmentOptions.clear();
                department.required(false);
            }
        });

        department.required(false);

        FormRenderer formRenderer = new FormRenderer(form);
        formContainer.getChildren().add(formRenderer);
        formRenderer.setStyle("-fx-border-color: transparent; -fx-border-width: 0;");
    }

    private void fetchDepartments() {
        departmentService.getAllDepartmentsNames().thenAccept(response -> Platform.runLater(() -> {
            if (response == null) {
                logger.error("Response from department service is null.");
                showErrorAlert("Failed to fetch departments: Empty response.");
                return;
            }

            if (response.statusCode() == 200) {
                try {
                    JsonNode responseNode = objectMapper.readTree(response.body());
                    logger.info("Raw departments response: {}", responseNode);

                    ObservableList<String> fetchedDepartmentNames = FXCollections.observableArrayList();

                    // Handle different possible response formats
                    if (responseNode.isArray()) {
                        // Case 1: Response is a simple array of strings
                        if (responseNode.elements().next().isTextual()) {
                            for (JsonNode deptNode : responseNode) {
                                fetchedDepartmentNames.add(deptNode.asText());
                            }
                        }
                        // Case 2: Response is an array of objects with name property
                        else {
                            for (JsonNode deptObj : responseNode) {
                                JsonNode nameNode = deptObj.path("name");
                                if (!nameNode.isMissingNode()) {
                                    fetchedDepartmentNames.add(nameNode.asText());
                                }
                            }
                        }
                    }
                    // Case 3: Response is an object with departments array
                    else if (responseNode.has("departments") && responseNode.get("departments").isArray()) {
                        for (JsonNode deptNode : responseNode.get("departments")) {
                            JsonNode nameNode = deptNode.path("name");
                            if (!nameNode.isMissingNode()) {
                                fetchedDepartmentNames.add(nameNode.asText());
                            }
                        }
                    }

                    logger.info("Fetched departments: {}", fetchedDepartmentNames);

                    // Clear and update the department options
                    departmentOptions.clear();
                    departmentOptions.addAll(fetchedDepartmentNames);

                    // Force UI update if this is a STOREKEEPER role
                    if ("STOREKEEPER".equals(role.getSelection())) {
                        department.items(departmentOptions);
                    }

                } catch (JsonProcessingException e) {
                    logger.error("Error parsing department response", e);
                    showErrorAlert("Failed to parse department data: " + e.getMessage());
                }
            } else {
                try {
                    JsonNode errorNode = objectMapper.readTree(response.body());
                    String errorMsg = errorNode.path("message").asText("Failed to fetch departments");
                    showErrorAlert(errorMsg);
                    logger.error("Department service error: {}", errorMsg);
                } catch (JsonProcessingException e) {
                    showErrorAlert("Failed to fetch departments. Error: " + response.body());
                    logger.error("Error parsing error response", e);
                }
            }
        })).exceptionally(e -> {
            Platform.runLater(() -> {
                logger.error("Department fetch error", e);
                showErrorAlert("Network error fetching departments: " + e.getMessage());
            });
            return null;
        });
    }
}