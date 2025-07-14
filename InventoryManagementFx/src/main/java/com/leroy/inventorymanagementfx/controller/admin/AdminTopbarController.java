package com.leroy.inventorymanagementfx.controller.admin;

import com.leroy.inventorymanagementfx.controller.MainController;
import com.leroy.inventorymanagementfx.enums.CommonPages;
import com.leroy.inventorymanagementfx.interfaces.HasNotificationCount;
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController;
import com.leroy.inventorymanagementfx.security.UserSession;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.MenuButton;
import javafx.scene.control.MenuItem;
import javafx.scene.input.MouseButton;

public class AdminTopbarController implements NeedsMainController, HasNotificationCount {
    private MenuItem profileBtn;
    private MainController mainController;
    
    @FXML
    private Button sidebarToggle, notificationBtn, backBtn, forwardBtn;
    @FXML private MenuItem logoutBtn;
    @FXML private MenuButton userName;
    @FXML private Label notificationCountLabel;

    @Override
    public void setMainController(MainController mainController) {
        this.mainController = mainController;
        setupButtonActions();
    }
    
    public void initialize() {
        userName.setText(UserSession.getInstance().getFirstName());
    }

    private void setupButtonActions() {
        sidebarToggle.setOnAction(event -> mainController.toggleSidebar());
        backBtn.setOnAction(event -> mainController.goBack());
        forwardBtn.setOnAction(event -> mainController.goForward());
        logoutBtn.setOnAction(event -> mainController.logout());
        profileBtn.setOnAction(event -> mainController.loadView(CommonPages.PROFILE));
        notificationBtn.setOnAction(event -> {
            mainController.loadView(CommonPages.NOTIFICATION);
            mainController.updateSidebarSelection(CommonPages.NOTIFICATION);
        });

        notificationCountLabel.setOnMouseClicked(event -> {
            if(event.getButton() == MouseButton.PRIMARY)
                notificationBtn.fire();
        });
    }

    @Override // This is now implementing the interface method
    public void updateNotificationCount(int count) {
        // Ensure notificationCountLabel is properly initialized from FXML
        Platform.runLater(() -> {
            if (notificationCountLabel != null) {
                notificationCountLabel.setText(String.valueOf(count));
                boolean hasNotifications = count > 0;
                notificationCountLabel.setVisible(hasNotifications);
                notificationCountLabel.setManaged(hasNotifications); // Controls layout space
            } else {
                System.err.println("notificationCountLabel is null in AdminTopbarController.");
            }
        });
    }


}
