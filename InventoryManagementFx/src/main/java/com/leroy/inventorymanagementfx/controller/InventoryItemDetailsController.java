
package com.leroy.inventorymanagementfx.controller;

import com.leroy.inventorymanagementfx.enums.CommonPages;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.*;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;

public class InventoryItemDetailsController {
    private static final Logger logger = LogManager.getLogger(InventoryItemDetailsController.class);

    @FXML private final VBox rootContainer;
    @FXML private ImageView itemImageView;
    @FXML private Label idLabel;
    @FXML private Label nameLabel;
    @FXML private Label unitLabel;
    @FXML private Label quantityLabel;
    @FXML private Label reorderLevelLabel;
    @FXML private TextArea descriptionTextArea;
    @FXML private Button editButton;
    @FXML private Button deleteButton;
    @FXML private Button addToCartButton;
    @FXML private Button closeButton;

    private Runnable onCloseAction;
    private boolean isInCart = false;

    public InventoryItemDetailsController() {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource(
                    CommonPages.INVENTORY_ITEM_DETAILS.getPath()));
            fxmlLoader.setController(this);
            rootContainer = fxmlLoader.load();
            initialize();
        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }
    }

    private void initialize() {
        closeButton.setOnAction(event -> {
            if (onCloseAction != null) {
                onCloseAction.run();
            }
        });

        addToCartButton.setOnAction(event -> {
            isInCart = true;
            addToCartButton.setDisable(true);
            addToCartButton.setText("In Cart");
            logger.info("Item added to cart: {}", nameLabel.getText());
        });
    }

    public VBox getView() {
        return rootContainer;
    }
    public void setOnCloseAction(Runnable onCloseAction) {
        this.onCloseAction = onCloseAction;
    }

    public void setItemImage(Image image) {
        itemImageView.setImage(image);
    }

    public void setItemId(String id) {
        idLabel.setText(id);
    }

    public void setItemName(String name) {
        nameLabel.setText(name);
    }

    public void setItemUnit(String unit) {
        unitLabel.setText(unit);
    }

    public void setQuantity(String quantity) {
        quantityLabel.setText(quantity);
    }

    public void setReorderLevel(String reorderLevel) {
        reorderLevelLabel.setText(reorderLevel);
    }

    public void setDescription(String description) {
        descriptionTextArea.setText(description);
    }

    public void setStorekeeperView(boolean isStorekeeper) {
        editButton.setVisible(isStorekeeper);
        deleteButton.setVisible(isStorekeeper);
        addToCartButton.setVisible(!isStorekeeper);
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

    public boolean isInCart() {
        return isInCart;
    }
}
