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

    @FXML
    private Button sendMessageBtn, transactionReportBtn,
            inventorySummaryReportBtn, userReportBtn; // Removed inventorySummaryByValueBtn, inventorySummaryByQuantityBtn
    @FXML
    private Button reportsToggleBtn; // New button for toggling reports submenu
    @FXML
    private VBox reportsSubmenuVBox; // New VBox for reports submenu
    @FXML
    private FontIcon reportsToggleIcon; // New icon for the reports toggle button

    private MainController mainController;
    @FXML
    private VBox sidebar;

    @FXML
    Button currentlySelectedButton, requestBtn, dashboardBtn, settingsBtn, addOfficeBtn,
            addStaffBtn, addInventoryItemBtn, inventoryItemsBtn, logoutBtn, addBatchBtn, notificationBtn;

    @FXML
    public void initialize() {
        // Initialize icons and click handlers for main sidebar items
        for (Node node : sidebar.getChildren()) {
            if (node instanceof Button button && button != reportsToggleBtn) { // Exclude reportsToggleBtn from general handling
                FontIcon icon = (FontIcon) button.getGraphic();
                if (icon != null) {
                    icon.setIconSize(18);
                }

                // Add style class for selection management
                button.getStyleClass().add("selectable-sidebar-item");
                button.setOnAction(event -> handleButtonSelection(button));
            }
        }

        // Initialize click handlers for reports submenu items
        for (Node node : reportsSubmenuVBox.getChildren()) {
            if (node instanceof Button button) {
                button.getStyleClass().add("selectable-sidebar-item"); // Apply selectable style to sub-items too
                button.setOnAction(event -> handleButtonSelection(button));
            }
        }

        // Handle Reports toggle button separately
        reportsToggleBtn.setOnAction(event -> toggleReportsSubmenu());

        // Set initial selection
        setSelectedButton(dashboardBtn);
    }

    /**
     * Toggles the visibility of the reports submenu.
     */
    private void toggleReportsSubmenu() {
        boolean isVisible = reportsSubmenuVBox.isVisible();
        reportsSubmenuVBox.setVisible(!isVisible);
        reportsSubmenuVBox.setManaged(!isVisible); // Also toggle managed property for layout

        if (!isVisible) {
            reportsToggleIcon.setIconLiteral("fas-chevron-down"); // Point down when expanded
            reportsToggleBtn.getStyleClass().add("expanded");
        } else {
            reportsToggleIcon.setIconLiteral("fas-chevron-right"); // Point right when collapsed
            reportsToggleBtn.getStyleClass().remove("expanded");
        }
    }


    private void handleButtonSelection(Button button) {
        setSelectedButton(button);

        // Ensure reports submenu is visible if a sub-item is selected
        if (button == transactionReportBtn || button == inventorySummaryReportBtn || button == userReportBtn) {
            if (!reportsSubmenuVBox.isVisible()) {
                toggleReportsSubmenu(); // Expand if collapsed
            }
            // Also ensure the reportsToggleBtn is marked as selected if a subitem is selected
            // This is a design choice; you might want the parent to be selected or not.
            // For now, let's keep only the actual clicked button selected.
        } else {
            // If a non-report button is clicked, collapse reports submenu if it's open
            if (reportsSubmenuVBox.isVisible()) {
                toggleReportsSubmenu();
            }
        }

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
        else if (button == logoutBtn)
            mainController.logout();
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
        else if (button == inventorySummaryReportBtn) // ISR is now directly selectable
            mainController.loadView(StorekeeperPages.ISR);
    }

    /**
     * Public method to programmatically select a sidebar button based on the FxmlPage enum.
     * This is called by the MainController to synchronize sidebar selection with page changes.
     * @param page The FxmlPage enum representing the page to select in the sidebar.
     */
    public void selectButtonForPage(FxmlPage page) {
        Button buttonToSelect = null;

        if (page == CommonPages.NOTIFICATION) {
            buttonToSelect = notificationBtn;
        } else if (page == StorekeeperPages.DASHBOARD) {
            buttonToSelect = dashboardBtn;
        } else if (page == StorekeeperPages.ADD_STAFF) {
            buttonToSelect = addStaffBtn;
        } else if (page == StorekeeperPages.ADD_OFFICE) {
            buttonToSelect = addOfficeBtn;
        } else if (page == StorekeeperPages.ADD_INVENTORY) {
            buttonToSelect = addInventoryItemBtn;
        } else if (page == StorekeeperPages.INVENTORY_ITEMS) {
            buttonToSelect = inventoryItemsBtn;
        } else if (page == StorekeeperPages.ADD_BATCH) {
            buttonToSelect = addBatchBtn;
        } else if (page == CommonPages.GENERAL_NOTIFICATION) {
            buttonToSelect = sendMessageBtn;
        } else if (page == StorekeeperPages.REQUESTS) {
            buttonToSelect = requestBtn;
        } else if (page == StorekeeperPages.TRANSACTION_REPORT) {
            buttonToSelect = transactionReportBtn;
            if (!reportsSubmenuVBox.isVisible()) toggleReportsSubmenu(); // Ensure submenu is open
        } else if (page == StorekeeperPages.USER_REPORT) {
            buttonToSelect = userReportBtn;
            if (!reportsSubmenuVBox.isVisible()) toggleReportsSubmenu(); // Ensure submenu is open
        } else if (page == StorekeeperPages.ISR) {
            buttonToSelect = inventorySummaryReportBtn;
            if (!reportsSubmenuVBox.isVisible()) toggleReportsSubmenu(); // Ensure submenu is open
        }
        // Add more else if for other pages as needed

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
