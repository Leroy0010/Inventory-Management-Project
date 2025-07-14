package com.leroy.inventorymanagementfx.controller.storekeeper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.service.storekeeper.OfficeService;
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

public class CreateOfficeController {
    private final Logger logger = LogManager.getLogger(CreateOfficeController.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final OfficeService officeService = new OfficeService();

    @FXML private TextField nameField;
    @FXML private Label errorLabel;
    @FXML private Button submitBtn;

    @FXML
    public void initialize() {
        // Initialize any necessary parts
    }

    @FXML
    public void addOffice() {
        String officeName = nameField.getText().trim();

        if (officeName.isEmpty()) {
            showError("Office name cannot be empty");
            return;
        }

        errorLabel.setVisible(false);
        submitBtn.setText("Saving Office...");

        officeService.addOffice(officeName)
                .thenAccept(response -> {
                    Platform.runLater(() -> {
                        switch (response.statusCode()) {
                            case 201:
                                showSuccess();
                                nameField.clear();
                                submitBtn.setText("Save Office");
                                break;
                            case 409:
                                showError("Office already exists");
                                submitBtn.setText("Save Office");
                                break;
                            case 500:
                                showError("Server error creating office");
                                submitBtn.setText("Save Office");
                                break;
                            default:
                                try {
                                    JsonNode message = objectMapper.readTree(response.body());
                                    showError(message.get("message").asText());
                                    submitBtn.setText("Save Office");
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
                    submitBtn.setText("Save Office");
                    return null;
                });
    }
    private void showError(String message) {
        Platform.runLater(() -> {
            errorLabel.setText(message);
            errorLabel.setVisible(true);
            submitBtn.setText("Save Office");
        });
    }

    private void showSuccess() {
        Platform.runLater(() -> {
            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle("Success");
            alert.setHeaderText(null);
            alert.setContentText("Office created successfully!");
            alert.showAndWait();
            alert.initModality(Modality.WINDOW_MODAL);
            alert.initOwner(getWindow());
            submitBtn.setText("Save Office");
        });
    }
    
    private Window getWindow(){
        return submitBtn.getScene().getWindow();
    }
}