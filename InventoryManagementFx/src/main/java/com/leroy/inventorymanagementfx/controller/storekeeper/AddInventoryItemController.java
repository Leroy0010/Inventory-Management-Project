package com.leroy.inventorymanagementfx.controller.storekeeper;

import com.dlsc.formsfx.model.structure.*;
import com.dlsc.formsfx.model.validators.StringLengthValidator;
import com.dlsc.formsfx.view.renderer.FormRenderer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.service.admin.DepartmentService;
import com.leroy.inventorymanagementfx.service.storekeeper.InventoryItemService;
import com.leroy.inventorymanagementfx.util.ImageStorageService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import javafx.stage.FileChooser;
import javafx.stage.Modality;
import javafx.stage.Stage;
import javafx.stage.Window;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.net.http.HttpResponse;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class AddInventoryItemController {

    private final Logger logger = LogManager.getLogger(AddInventoryItemController.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final InventoryItemService inventoryItemService = new InventoryItemService();
    private final DepartmentService departmentService = new DepartmentService();
    private final ImageStorageService imageStorageService = new ImageStorageService();
    
    private String userDepartment;

    @FXML
    private VBox formContainer;
    
    private Form form;
    
    private FormRenderer renderer;

    @FXML
    private Button fileButton;

    @FXML
    private Label fileLabel;

    @FXML
    private ImageView imagePreview;

    private StringField name, unit, description;
    private IntegerField reorderLevel;

    private File selectedImageFile;

    @FXML
    public void initialize() {
        try {
            setupForm();
            fetchUserDepartment();

            // Make sure to add the form renderer only once
            if (formContainer.getChildren().isEmpty() ||
                    !formContainer.getChildren().get(1).equals(renderer)) {
                formContainer.getChildren().add(1, renderer);
            }

            fileButton.setOnAction(e -> openFileChooser());

            // Set default department if fetch fails
            if (userDepartment == null || userDepartment.isEmpty()) {
                userDepartment = "general";
                logger.warn("Using default department: general");
            }
        } catch (Exception e) {
            logger.error("Error initializing AddInventoryItemController", e);
            showAlert("Initialization Error", "Failed to initialize the form. Please restart the application.");
        }
    }
    
    private void setupForm(){
        name = Field.ofStringType("")
                .label("Inventory Name")
                .validate(StringLengthValidator.atLeast(3, "Name too short!"))
                .required("Name required");
        
        unit = Field.ofStringType("")
                .label("Unit of Measurement")
                .validate(StringLengthValidator.atLeast(2, "Unit too short"))
                .required("Inventory unit required");
        
        description = Field.ofStringType("")
                        .label("Description").multiline(true);
        reorderLevel = Field.ofIntegerType(0)
                .label("Reorder Level")
                .required("Required");

        form = Form.of(
                Group.of(name, unit, description, reorderLevel));
        renderer = new FormRenderer(form);
    }

    private void openFileChooser() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Choose Item Image");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("Images", "*.jpg", "*.png", "*.jpeg"));

        File file = fileChooser.showOpenDialog(fileButton.getScene().getWindow());

        if (file != null) {
            selectedImageFile = file;
            fileLabel.setText(file.getName());
            imagePreview.setImage(new Image(file.toURI().toString()));
        }
    }

    @FXML
    private void handleSubmit() {
        if (!form.isValid()) {
            showValidationAlert();
            return;
        }

        Optional<String> imagePathOptional = imageStorageService.saveImage(selectedImageFile, userDepartment);
        if (imagePathOptional.isEmpty()) {
            showAlert("Image Error", "Could not store selected image. Please try again.");
            return;
        }
        String imagePath = imagePathOptional.get();
    

        // Show loading indicator
        Alert processingAlert = createProcessingAlert();
        processingAlert.show();
        
        inventoryItemService.createInventoryItem(
                name.getValue(),
                unit.getValue(),
                description.getValue(),
                reorderLevel.getValue(),
                imagePath
        ).thenAccept(response -> {
                    Platform.runLater(() -> {
                        processingAlert.close();  // ✅ Now runs on JavaFX thread

                        if (response.statusCode() == 201) {
                            showSuccessAlert(
                                    String.format("'%s' has been successfully added to inventory.", name.getValue()));
                            resetForm();
                        } else {
                            try {
                                String errorMsg = objectMapper.readTree(response.body())
                                        .findValue("message").asText("Failed to create inventory item");
                                showAlert("Error", errorMsg);
                            } catch (JsonProcessingException e) {
                                logger.error("Error parsing error response", e);
                                showAlert("Error", "Failed to create inventory item. Please try again.");
                            }
                        }
                    });
                })
                .exceptionally(e -> {
            Platform.runLater(() -> {
                processingAlert.close();
                logger.error("Exception during item creation", e);
                showAlert("Error", "An unexpected error occurred. Please try again.");
            });
            return null;
        });
    }

    private void fetchUserDepartment() {
        try {
            // Assuming you have a service to get user department
            CompletableFuture<HttpResponse<String>> future = departmentService.getUserDepartment();
            HttpResponse<String> response = future.get();

            if (response.statusCode() == 200) {
                userDepartment = response.body();
                logger.info("User department fetched: {}", userDepartment);
            } else {
                logger.error("Failed to fetch user department. Status: {}. Body: {}", response.statusCode(), objectMapper.readTree(response.body()).findValue("message"));
            }
        } catch (InterruptedException | ExecutionException | IOException e) {
            logger.error("Error fetching user department", e);
            // fallback
        }
    }

    private void resetForm() {
        form.reset();
        fileLabel.setText("No file selected");
        imagePreview.setImage(null);
    }

    private void showValidationAlert() {
        Alert alert = new Alert(Alert.AlertType.WARNING);
        alert.setTitle("Validation Error");
        alert.setHeaderText("Please fix the following issues:");

        StringBuilder content = new StringBuilder();

        // Check each field for errors
        if (!name.getErrorMessages().isEmpty()) {
            content.append("- Name: ").append(name.getErrorMessages().getFirst()).append("\n");
        }
        if (!unit.getErrorMessages().isEmpty()) {
            content.append("- Unit: ").append(unit.getErrorMessages().getFirst()).append("\n");
        }
        if (!description.getErrorMessages().isEmpty()) {
            content.append("- Description: ").append(description.getErrorMessages().getFirst()).append("\n");
        }
        if (!reorderLevel.getErrorMessages().isEmpty()) {
            content.append("- Reorder Level: ").append(reorderLevel.getErrorMessages().getFirst()).append("\n");
        }

        // If we have specific field errors, show them, otherwise show generic message
        if (!content.isEmpty()) {
            alert.setContentText(content.toString());
        } else {
            alert.setContentText("Please fill all required fields correctly.");
        }
        alert.initModality(Modality.WINDOW_MODAL);
        alert.initOwner(getWindow());
        alert.showAndWait();
    }

    private Alert createProcessingAlert() {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Processing");
        alert.setHeaderText("Creating inventory item...");
        alert.setContentText("Please wait while we process your request.");
        alert.getDialogPane().setPrefWidth(400);
        alert.initModality(Modality.WINDOW_MODAL);
        alert.initOwner(getWindow());
        return alert;
    }

    private void showSuccessAlert(String content) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Inventory Item Created");
        alert.setHeaderText(null);
        alert.setContentText(content);

        // Add success icon
        Stage stage = (Stage) alert.getDialogPane().getScene().getWindow();
//        stage.getIcons().add(new Image("/images/success-icon.png"));
        alert.initModality(Modality.WINDOW_MODAL);
        alert.initOwner(getWindow());
        alert.showAndWait();
        
    }

    private void showAlert(String title, String content) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(content);
        alert.initModality(Modality.WINDOW_MODAL);
        alert.initOwner(getWindow());
        alert.showAndWait();
        
    }
    
    private Window getWindow(){
        return formContainer.getScene().getWindow();
    }
    
}
