package com.leroy.inventorymanagementfx.controller.admin;

import com.leroy.inventorymanagementfx.controller.MainController;
import com.leroy.inventorymanagementfx.enums.AdminPages;
import com.leroy.inventorymanagementfx.enums.CommonPages;
import com.leroy.inventorymanagementfx.interfaces.FxmlPage;
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController;
import com.leroy.inventorymanagementfx.interfaces.SidebarHasNotificationButton;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.layout.VBox;
import org.kordamp.ikonli.javafx.FontIcon;

public class AdminSidebarController implements NeedsMainController, SidebarHasNotificationButton {
    
    @FXML
    private VBox sidebar;
    @FXML private Button notificationBtn, sendMessageBtn, dashboardBtn, settingsBtn, addStoreKeeperBtn, addDepartmentBtn;
    private MainController mainController;
    private Button currentlySelectedButton;

    @FXML
    public void initialize() {
        // Initialize icons and click handlers
        for (Node node : sidebar.getChildren()) {
            if (node instanceof Button button) {
                FontIcon icon = (FontIcon) button.getGraphic();
                if (icon != null) {
                    icon.setIconSize(18);
                }

                // Add style class for selection management
                button.getStyleClass().add("selectable-sidebar-item");

                if (button != sidebar.lookup("#logout")) {
                    button.setOnAction(event -> handleButtonSelection(button));
                }
            }
        }
        
        // Set initial selection
        setSelectedButton(addDepartmentBtn);
    }

    private void handleButtonSelection(Button clickedButton) {
        // Handle specific button actions
        if (clickedButton == dashboardBtn) {
            // Handle dashboard click
            mainController.loadView(AdminPages.DASHBOARD);
            setSelectedButton(dashboardBtn);
        } else if (clickedButton == addStoreKeeperBtn) {
            loadAddStoreKeeperPage();
        } else if (clickedButton == addDepartmentBtn) {
            loadAddDepartmentPage();
        } else if (clickedButton == settingsBtn) {
            loadSettingsPage();
        } else if (clickedButton == notificationBtn) {
            mainController.loadView(CommonPages.NOTIFICATION);
            setSelectedButton(notificationBtn);
        } else if (clickedButton == sendMessageBtn) {
            mainController.loadView(CommonPages.GENERAL_NOTIFICATION);
            setSelectedButton(sendMessageBtn);
        }
    }

    /**
     * Public method to programmatically select a sidebar button based on the StaffPages enum.
     * This is called by the MainController to synchronize sidebar selection with page changes.
     * @param page The StaffPages enum representing the page to select in the sidebar.
     */
    public void selectButtonForPage(FxmlPage page) {
        Button buttonToSelect = null;
        
         if (page == CommonPages.NOTIFICATION) 
            buttonToSelect = notificationBtn;
        
       
        if (buttonToSelect != null) {
            setSelectedButton(buttonToSelect);
        }
    }

    private void setSelectedButton(Button button) {
        // Skip if already selected
        if (currentlySelectedButton == button) {
            return;
        }

        // Remove selected style from the previous button
        if (currentlySelectedButton != null) {
            currentlySelectedButton.getStyleClass().remove("selected");
        }

        // Add selected style to new button
        button.getStyleClass().add("selected");
        currentlySelectedButton = button;
    }
    
    @FXML
    public void logout() {
        mainController.logout();
    }

    @FXML
    public void loadAddDepartmentPage() {
        setSelectedButton(addDepartmentBtn); // Or the appropriate button
        mainController.loadView(AdminPages.CREATE_DEPARTMENT);
    }

    @FXML
    public void loadAddStoreKeeperPage() {
        setSelectedButton(addStoreKeeperBtn); // Or the appropriate button
        mainController.loadView(AdminPages.CREATE_STOREKEEPER);
    }

    @FXML
    public void loadSettingsPage() {
        setSelectedButton(settingsBtn);
        // Load settings page logic
    }

    @Override
    public void setMainController(MainController mainController) {
        this.mainController = mainController;
    }

  
}