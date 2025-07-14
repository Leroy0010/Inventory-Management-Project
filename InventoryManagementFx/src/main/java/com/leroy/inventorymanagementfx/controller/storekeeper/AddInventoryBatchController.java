package com.leroy.inventorymanagementfx.controller.storekeeper;

import com.dlsc.formsfx.model.structure.*;
import com.dlsc.formsfx.model.validators.CustomValidator;
import com.dlsc.formsfx.model.validators.DoubleRangeValidator;
import com.dlsc.formsfx.model.validators.IntegerRangeValidator;
import com.dlsc.formsfx.view.renderer.FormRenderer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.dto.request.CreateBatchRequest;
import com.leroy.inventorymanagementfx.service.storekeeper.InventoryBatchService;
import com.leroy.inventorymanagementfx.service.storekeeper.InventoryItemService;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Window;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.math.BigDecimal;
import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

import static javafx.scene.input.KeyCode.ENTER;

public class AddInventoryBatchController implements Initializable {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Logger logger = LogManager.getLogger(AddInventoryBatchController.class);
    private final InventoryBatchService batchService = new InventoryBatchService();
    private final InventoryItemService itemService = new InventoryItemService();

    private final ObservableList<String> itemsOptions = FXCollections.observableArrayList();


    @FXML private VBox formContainer;
    @FXML private Button submitButton;

    private Form form;

    private SingleSelectionField<String> itemName;
    private IntegerField quantity;
    private DoubleField totalPrice;
    private StringField supplierName;
    private StringField invoiceId;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        setupForm();
        loadItemNames();
        setupSubmitHandler();
        setupOnEnterKeyPressedSubmission();
        
    }

    private void setupForm() {
        itemName = Field.ofSingleSelectionType(itemsOptions, -1)
                .label("Item Name")
                .required("Item name is required")
                .placeholder("Select an item");

        quantity = Field.ofIntegerType(1)
                .label("Quantity")
                .required("Quantity is required")
                .placeholder("Enter quantity")
                .validate(IntegerRangeValidator.atLeast(1, "Quantity must be at least 1"));

        totalPrice = Field.ofDoubleType(0.00)
                .label("Total Price")
                .placeholder("Enter total price")
                .required("Total price is required")
                .validate(DoubleRangeValidator.forPredicate(
                        amount -> amount != null && amount > 0.00,
                        "Amount must be greater than 0.00"));

        supplierName = Field.ofStringType("")
                .label("Supplier Name")
                .placeholder("Enter supplier's name");

        invoiceId = Field.ofStringType("")
                .label("Invoice ID")
                .placeholder("Enter Invoice ID")
                .required("Invoice ID is required")
                .validate(CustomValidator.forPredicate(
                        id -> id != null && id.length() <= 20,
                        "Invoice ID can't be more than 20 characters"));

        form = Form.of(
                Group.of(
                        itemName,
                        quantity,
                        totalPrice,
                        supplierName,
                        invoiceId
                )
        ).title("Batch Details");

        FormRenderer renderer = new FormRenderer(form);
        renderer.setPrefWidth(600);
        

        formContainer.getChildren().add(renderer);
    }

    private void loadItemNames() {
        itemService.getInventoryItemNamesByDepartment()
                .thenAccept(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            JsonNode jsonNode = objectMapper.readTree(response.body());
                            List<String> items = objectMapper.convertValue(
                                    jsonNode,
                                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)
                            );
                            
                            itemsOptions.clear();
                            itemsOptions.addAll(items);
                            itemName.items(itemsOptions);
                            form.persist();
                            
                        } catch (Exception e) {
                            logger.error("Error parsing item names", e);
                            showError("Error", "Failed to load inventory items");
                        }
                    } else {
                        Platform.runLater(() ->
                                showError("Error", "Failed to load inventory items: " + response.statusCode()));
                    }
                })
                .exceptionally(e -> {
                    logger.error("Error fetching item names", e);
                    Platform.runLater(() ->
                            showError("Error", "Failed to load inventory items: " + e.getMessage()));
                    return null;
                });
    }

    private void setupSubmitHandler() {
        submitButton.setOnAction(event -> submitForm());
    }

    private void submitForm() {
        if (!form.isValid()) {
            showError("Validation Error", "Please correct the form errors before submitting.");
            return;
        }
        
        submitButton.setText("Adding Batch...");

        submitButton.setDisable(true);

        CreateBatchRequest request = new CreateBatchRequest(
                itemName.getSelection(),
                quantity.getValue(),
                BigDecimal.valueOf(totalPrice.getValue()),
                invoiceId.getValue(),
                supplierName.getValue()
        );

        batchService.addBatch(
                request.getItemName(),
                request.getQuantity(),
                request.getTotalPrice(),
                request.getInvoiceId(),
                request.getSupplierName()
        ).thenAccept(response -> {
            Platform.runLater(() -> {
                submitButton.setDisable(false);

                if (response.statusCode() == 201 || response.statusCode() == 202) {
                    showSuccess("Success", "Inventory batch created successfully!");
                    resetForm();
                    submitButton.setText("Add Batch");
                } else {
                    try {
                        JsonNode jsonNode = objectMapper.readTree(response.body());
                        String errorMessage = jsonNode.has("message") ?
                                jsonNode.get("message").asText() :
                                jsonNode.has("error_description") ?
                                        jsonNode.get("error_description").asText() :
                                        "Failed to create batch";
                        showError("Error", errorMessage);
                        submitButton.setText("Add Batch");
                    } catch (Exception e) {
                        logger.error("Error parsing error response", e);
                        showError("Error", "Failed to create batch: " + response.statusCode());
                        submitButton.setText("Add Batch");
                    }
                }
            });
        }).exceptionally(e -> {
            Platform.runLater(() -> {
                submitButton.setDisable(false);
                logger.error("Error creating batch", e);
                showError("Error", "Failed to create batch: " + e.getMessage());
                submitButton.setText("Add Batch");
            });
            return null;
        });
    }

    private void resetForm() {
        form.reset();
        form.persist();
    }

    private void showError(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        styleAlert(alert);
        alert.showAndWait();
    }

    private void showSuccess(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        styleAlert(alert);
        alert.showAndWait();
    }

    private void styleAlert(Alert alert) {
        Window window = alert.getDialogPane().getScene().getWindow();
        window.setOnShown(e -> Platform.runLater(window::sizeToScene));

        alert.initModality(Modality.WINDOW_MODAL);
        alert.initOwner(formContainer.getScene().getWindow());

        alert.getDialogPane().setStyle(
                "-fx-background-color: white; " +
                        "-fx-border-color: #e0e0e0; " +
                        "-fx-border-width: 1; " +
                        "-fx-border-radius: 5; " +
                        "-fx-effect: dropshadow(three-pass-box, rgba(0,0,0,0.1), 10, 0, 0, 0);"
        );

        alert.getDialogPane().lookupButton(ButtonType.OK).setStyle(
                "-fx-background-color: #4a7dff; -fx-text-fill: white; -fx-font-weight: bold;"
        );
    }
    
    private void setupOnEnterKeyPressedSubmission(){
        invoiceId.getRenderer().setOnKeyPressed(event -> {
            if(event.getCode() == ENTER)
                submitButton.fire();
        });

        supplierName.getRenderer().setOnKeyPressed(event -> {
            if(event.getCode() == ENTER)
                submitButton.fire();
        });

        totalPrice.getRenderer().setOnKeyPressed(event -> {
            if(event.getCode() == ENTER)
                submitButton.fire();
        });

        quantity.getRenderer().setOnKeyPressed(event -> {
            if(event.getCode() == ENTER)
                submitButton.fire();
        });
        
        
    }
}