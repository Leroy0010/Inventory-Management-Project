package com.leroy.inventorymanagementfx.controller.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.service.admin.DepartmentService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.stage.Modality;
import javafx.stage.Window;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class CreateDepartment {
    private final Logger logger = LogManager.getLogger(CreateDepartment.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DepartmentService departmentService = new DepartmentService();
    @FXML private Button submitBtn;

    @FXML private TextField nameField;
    @FXML private Label errorLabel;

    @FXML
    public void initialize() {
        // Initialize any necessary the parts
    }

    @FXML
    public void addDepartment() {
        String departmentName = nameField.getText().trim();

        if (departmentName.isEmpty()) {
            showError("Department name cannot be empty");
            return;
        }

        errorLabel.setVisible(false);
        submitBtn.setText("Saving Department...");

        departmentService.addDepartment(departmentName)
                .thenAccept(response -> {
                    Platform.runLater(() -> {
                        switch (response.statusCode()) {
                            case 201:
                                showSuccess();
                                nameField.clear();
                                break;
                            case 409:
                                showError("Department already exists");
                                break;
                            case 500:
                                showError("Server error creating department");
                                break;
                            default:
                                try {
                                    JsonNode message = objectMapper.readTree(response.body());
                                    showError(message.get("message").asText());
                                } catch (JsonProcessingException e) {
                                    throw new RuntimeException(e);
                                }
                                
                        }
                        
                    });
                })
                .exceptionally(ex -> {
                    Platform.runLater(() -> showError("Network error: " + ex.getMessage()));
                    errorLabel.setText("Network error");
                    errorLabel.setVisible(true);
                    submitBtn.setText("Save Department");
                    return null;
                });
    }
    private void showError(String message) {
        Platform.runLater(() -> {
            errorLabel.setText(message);
            errorLabel.setVisible(true);
            submitBtn.setText("Save Department");
        });
    }

    private void showSuccess() {
        Platform.runLater(() -> {
            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle("Success");
            alert.setHeaderText(null);
            alert.setContentText("Department created successfully!");
            alert.initModality(Modality.WINDOW_MODAL);
            alert.initOwner(getWindow());
            alert.showAndWait();
            submitBtn.setText("Save Department");
        });
    }

    private Window getWindow() {
        return submitBtn.getScene().getWindow();
    }
}