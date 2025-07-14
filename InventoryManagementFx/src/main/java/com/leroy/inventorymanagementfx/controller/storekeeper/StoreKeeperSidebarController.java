package com.leroy.inventorymanagementfx.controller.storekeeper;

import com.leroy.inventorymanagementfx.controller.MainController;
import com.leroy.inventorymanagementfx.enums.CommonPages;
import com.leroy.inventorymanagementfx.enums.StorekeeperPages;
import com.leroy.inventorymanagementfx.interfaces.FxmlPage;
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController;
import com.leroy.inventorymanagementfx.interfaces.SidebarHasNotificationButton;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.layout.VBox;
import org.kordamp.ikonli.javafx.FontIcon;

public class StoreKeeperSidebarController implements NeedsMainController, SidebarHasNotificationButton {

   
    @FXML private Button sendMessageBtn, transactionReportBtn, 
            inventorySummaryReportBtn, inventorySummaryByValueBtn,
            inventorySummaryByQuantityBtn, userReportBtn;
    private MainController mainController;
    @FXML
    private VBox sidebar;
    
    @FXML
    Button currentlySelectedButton, requestBtn, dashboardBtn, settingsBtn, addOfficeBtn,
            addStaffBtn, addInventoryItemBtn, inventoryItemsBtn, logoutBtn, addBatchBtn, notificationBtn;

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
                button.setOnAction(event -> handleButtonSelection(button));

            }
        }

        // Set initial selection
        setSelectedButton(dashboardBtn);
    }


    private void handleButtonSelection(Button button) {
        
        setSelectedButton(button);
        
        if (button == dashboardBtn)
            mainController.loadView(StorekeeperPages.DASHBOARD);
        else if (button == addStaffBtn) 
            mainController.loadView(StorekeeperPages.ADD_STAFF);
        else if (button == addOfficeBtn) 
            mainController.loadView(StorekeeperPages.ADD_OFFICE);
         else if (button == addInventoryItemBtn) 
            mainController.loadView(StorekeeperPages.ADD_INVENTORY);
         else if (button == inventoryItemsBtn) 
            mainController.loadView(StorekeeperPages.INVENTORY_ITEMS);
         else if (button == logoutBtn) mainController.logout();
        else if (button == addBatchBtn) 
            mainController.loadView(StorekeeperPages.ADD_BATCH);
        else if (button == notificationBtn)
            mainController.loadView(CommonPages.NOTIFICATION);
        else if (button == sendMessageBtn)
            mainController.loadView(CommonPages.GENERAL_NOTIFICATION);
        else if (button == requestBtn)
            mainController.loadView(StorekeeperPages.REQUESTS);
        else if (button == transactionReportBtn)
            mainController.loadView(StorekeeperPages.TRANSACTION_REPORT);
        else if (button == userReportBtn)
            mainController.loadView(StorekeeperPages.USER_REPORT);
            

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


    @Override
    public void setMainController(MainController mainController) {
        this.mainController = mainController;
    }
}
