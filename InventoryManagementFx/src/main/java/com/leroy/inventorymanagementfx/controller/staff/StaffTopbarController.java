package com.leroy.inventorymanagementfx.controller.staff;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.controller.MainController;
import com.leroy.inventorymanagementfx.dto.response.CartResponse;
import com.leroy.inventorymanagementfx.enums.CommonPages;
import com.leroy.inventorymanagementfx.enums.StaffPages;
import com.leroy.inventorymanagementfx.interfaces.HasNotificationCount;
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController;
import com.leroy.inventorymanagementfx.security.UserSession;
import com.leroy.inventorymanagementfx.service.staff.CartService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.MenuButton;
import javafx.scene.control.MenuItem;
import javafx.scene.input.MouseButton;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class StaffTopbarController implements NeedsMainController, HasNotificationCount {
    private MainController mainController;
    private static final Logger logger = LogManager.getLogger(StaffTopbarController.class);

    @FXML
    private Button sidebarToggle, notificationBtn, backBtn, forwardBtn;
    @FXML private MenuItem logoutBtn, profileBtn;
    @FXML private MenuButton userName;
    @FXML private Button cartBtn;
    @FXML private Label itemCountLabel;
    @FXML private Label notificationCountLabel;

    @Override
    public void setMainController(MainController mainController) {
        this.mainController = mainController;
        setupButtonActions();
    }

    public void initialize() {
        userName.setText(UserSession.getInstance().getFirstName());
        CartService cartService = new CartService();
        cartService.getCart().thenAccept(response -> {
            if (response.statusCode() == 200) {
                try {
                    CartResponse cart = new ObjectMapper().readValue(response.body(), CartResponse.class);
                    int count = cart.getItems().toArray().length;
                   updateItemCount(count);
                } catch (Exception e) {
                    // Log or ignore
                }
            }
        });
        
        
    }

    private void setupButtonActions() {
        sidebarToggle.setOnAction(event -> mainController.toggleSidebar());
        backBtn.setOnAction(event -> mainController.goBack());
        forwardBtn.setOnAction(event -> mainController.goForward());
        logoutBtn.setOnAction(event -> mainController.logout());
        profileBtn.setOnAction(event -> mainController.loadView(CommonPages.PROFILE));
        cartBtn.setOnAction(event -> {
            mainController.loadView(StaffPages.CART);
            // Inform MainController to update sidebar selection
            mainController.updateSidebarSelection(StaffPages.CART);
        });
        notificationBtn.setOnAction(event -> {
            mainController.loadView(CommonPages.NOTIFICATION);
            mainController.updateSidebarSelection(CommonPages.NOTIFICATION);
        });
        
        itemCountLabel.setOnMouseClicked(event -> {
            if(event.getButton() == MouseButton.PRIMARY)
                cartBtn.fire();
        });

        notificationCountLabel.setOnMouseClicked(event -> {
            if(event.getButton() == MouseButton.PRIMARY)
                notificationBtn.fire();
        });
    }

    // In StaffTopbarController.java

    public void updateItemCount(int count) {
        Platform.runLater(() -> {
            if (itemCountLabel != null) {
                itemCountLabel.setText(String.valueOf(count));
                logger.info("Item count label set to: '{}'. Visibility should be: {}", itemCountLabel.getText(), count > 0);
                boolean hasItems = count > 0;
                itemCountLabel.setVisible(hasItems);
                itemCountLabel.setManaged(hasItems);
            } else {
                logger.error("itemCountLabel is null when trying to update count.");
            }
        });
    }

    @Override
    public void updateNotificationCount(int count) {
        Platform.runLater(() -> {
            if (notificationCountLabel != null) {
                notificationCountLabel.setText(String.valueOf(count));
                logger.info("Notification count label set to: '{}'. Visibility should be: {}", notificationCountLabel.getText(), count > 0);
                boolean hasNotifications = count > 0;
                notificationCountLabel.setVisible(hasNotifications);
                notificationCountLabel.setManaged(hasNotifications);
            } else {
                logger.error("notificationCountLabel is null when trying to update count.");
            }
        });
    }


}
