package com.leroy.inventorymanagementfx.controller;

import javafx.application.Platform;
import javafx.beans.value.ChangeListener;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.geometry.Insets;
import javafx.scene.Node;
import javafx.scene.control.*;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.util.Pair;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Consumer; // Import Consumer

public class InventoryItemCardController extends VBox {

    @FXML private VBox rootContainer;
    @FXML private ImageView itemImageView;
    @FXML private Label nameLabel;
    @FXML private Label unitLabel;
    @FXML private Label quantityLabel;
    @FXML private Label reorderLevelLabel;
    @FXML private HBox storekeeperFields;
    @FXML private HBox storekeeperButtons;
    @FXML private Button addToCartButton;
    @FXML private Button editButton;
    @FXML private Button deleteButton;
    @FXML private Label idLabel;
    @FXML private Button viewDetailsBtn;

    private String description;
    private int itemId; // Add a field to store the item ID

    private final Logger logger = LogManager.getLogger(InventoryItemCardController.class);

    private boolean isStorekeeperView;

    // Add a Consumer for the add to cart action
    private Consumer<Integer> addToCartAction; // Consumer that takes an item ID

    public InventoryItemCardController() {
        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource(
                "/fxml/component/inventory-item-card.fxml"));
        fxmlLoader.setRoot(this);
        fxmlLoader.setController(this);

        try {
            fxmlLoader.load();
        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }

        initialize();
    }

    private void initialize() {
        viewDetailsBtn.setStyle("-fx-background-color: transparent; -fx-text-fill: #3aafa9; -fx-font-size: 12px;");
        viewDetailsBtn.setOnAction(event -> showDetailsView());

        // Set up delete button action
        deleteButton.setOnAction(event -> showDeleteConfirmation());

        // Set up edit button action
        editButton.setOnAction(event -> showEditDialog());

        // Modify addToCartButton action to use the injected Consumer
        addToCartButton.setOnAction(event -> {
            if (addToCartAction != null) {
                addToCartAction.accept(this.itemId); // Pass the item ID
            } else {
                logger.warn("Add to cart action not set for item: {}", nameLabel.getText());
            }
        });
    }

    private void showDeleteConfirmation() {
        Alert confirmation = new Alert(Alert.AlertType.CONFIRMATION);
        confirmation.setTitle("Confirm Deletion");
        confirmation.setHeaderText("Delete Inventory Item");
        confirmation.setContentText("Are you sure you want to delete " + nameLabel.getText() + "?");
        confirmation.initOwner(this.getScene().getWindow());
        confirmation.initModality(Modality.WINDOW_MODAL);

        Optional<ButtonType> result = confirmation.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            // Handle deletion logic here
            logger.info("Deleting item: {}", nameLabel.getText());
            // You would typically call a service method here
        }
    }

    private void showEditDialog() {
        Dialog<Pair<String, String>> dialog = new Dialog<>();
        dialog.setTitle("Edit Inventory Item");
        dialog.setHeaderText("Editing " + nameLabel.getText());
        dialog.initOwner(this.getScene().getWindow());
        dialog.initModality(Modality.WINDOW_MODAL);

        // Set the button types
        ButtonType saveButtonType = new ButtonType("Save", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(saveButtonType, ButtonType.CANCEL);

        // Create the edit form
        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.setPadding(new Insets(20, 150, 10, 10));

        TextField nameField = new TextField(nameLabel.getText());
        TextField unitField = new TextField(unitLabel.getText());
        TextField reorderField = new TextField(reorderLevelLabel.getText());
        TextArea descriptionArea = new TextArea(getDescription());
        descriptionArea.setWrapText(true);

        grid.add(new Label("Name:"), 0, 0);
        grid.add(nameField, 1, 0);
        grid.add(new Label("Unit:"), 0, 1);
        grid.add(unitField, 1, 1);
        grid.add(new Label("Reorder Level:"), 0, 2);
        grid.add(reorderField, 1, 2);
        grid.add(new Label("Description:"), 0, 3);
        grid.add(descriptionArea, 1, 3);

        // Enable/Disable save button depending on validation
        Node saveButton = dialog.getDialogPane().lookupButton(saveButtonType);
        saveButton.setDisable(true);

        // Add validation
        ChangeListener<String> validationListener = (observable, oldValue, newValue) -> {
            boolean isValid = !nameField.getText().isEmpty()
                    && !unitField.getText().isEmpty()
                    && !reorderField.getText().isEmpty();
            saveButton.setDisable(!isValid);
        };

        nameField.textProperty().addListener(validationListener);
        unitField.textProperty().addListener(validationListener);
        reorderField.textProperty().addListener(validationListener);

        dialog.getDialogPane().setContent(grid);
        Platform.runLater(nameField::requestFocus);

        // Convert the result to a pair when the save button is clicked
        dialog.setResultConverter(dialogButton -> {
            if (dialogButton == saveButtonType) {
                return new Pair<>(nameField.getText(), unitField.getText());
            }
            return null;
        });

        Optional<Pair<String, String>> result = dialog.showAndWait();

        result.ifPresent(values -> {
            // Handle save logic here
            logger.info("Updating item: {} with new values: {}", nameLabel.getText(), values);
            // You would typically call a service method here
        });
    }
    public void setStorekeeperView(boolean isStorekeeper) {
        this.isStorekeeperView = isStorekeeper;
        storekeeperFields.setVisible(isStorekeeper);
        storekeeperFields.setManaged(isStorekeeper);
        storekeeperButtons.setVisible(isStorekeeper);
        storekeeperButtons.setManaged(isStorekeeper);
        addToCartButton.setVisible(!isStorekeeper);
        addToCartButton.setManaged(!isStorekeeper);
    }

    public void setItemName(String name) {
        nameLabel.setText(name);
    }

    public void setItemUnit(String unit) {
        unitLabel.setText(unit);
    }

    public void setItemId(int id) {
        this.itemId = id; // Store the actual int ID
        idLabel.setText("ID: " + id);
    }


    public void setItemImage(String imagePath) {
        try {
            String fullPath;
            if (imagePath.startsWith("http") || imagePath.startsWith("file:")) {
                // Already a full URL/path
                fullPath = imagePath;
            } else {
                fullPath = new File(imagePath).toURI().toString();
            }


            Image image = new Image(fullPath);
            itemImageView.setImage(image);
        } catch (Exception e) {
            logger.error("Error loading image: {}", imagePath, e);
            itemImageView.setImage(new Image(
                    Objects.requireNonNull(getClass().getResourceAsStream("/images/default-item.png"))
            ));
        }
    }

    public void setQuantity(int quantity) {
        quantityLabel.setText(String.valueOf(quantity));
    }

    public void setReorderLevel(int reorderLevel) {
        reorderLevelLabel.setText(String.valueOf(reorderLevel));
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Button getEditButton() {
        return editButton;
    }

    public Button getDeleteButton() {
        return deleteButton;
    }

    public Button getAddToCartButton() {
        return addToCartButton;
    }

    public void setAddToCartAction(Consumer<Integer> action) {
        this.addToCartAction = action;
    }

    public String getDescription() {
        return description;
    }

    private void showDetailsView() {
        try {
            InventoryItemDetailsController detailsController = new InventoryItemDetailsController();

            // Set all the data
            detailsController.setItemImage(itemImageView.getImage());
            detailsController.setItemId(idLabel.getText());
            detailsController.setItemName(nameLabel.getText());
            detailsController.setItemUnit(unitLabel.getText());
            detailsController.setQuantity(quantityLabel.getText());
            detailsController.setReorderLevel(reorderLevelLabel.getText());
            detailsController.setDescription(getDescription());
            detailsController.setStorekeeperView(isStorekeeperView);

            // Handle edit button in details view
            detailsController.getEditButton().setOnAction(event -> showEditDialog());

            // Handle delete button in details view
            detailsController.getDeleteButton().setOnAction(event -> showDeleteConfirmation());

            // Create dialog
            Dialog<Void> dialog = new Dialog<>();
            dialog.initOwner(getScene().getWindow());
            dialog.initModality(Modality.WINDOW_MODAL);
            dialog.getDialogPane().setContent(detailsController.getView());
            dialog.getDialogPane().getButtonTypes().add(ButtonType.CLOSE);

            // Set close action
            detailsController.setOnCloseAction(dialog::close);

            dialog.showAndWait();
        } catch (Exception e) {
            logger.error("Error showing details view", e);
        }
    }
}