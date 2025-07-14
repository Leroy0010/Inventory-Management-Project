package com.leroy.inventorymanagementfx.controller.staff;

import com.leroy.inventorymanagementfx.controller.MainController;
import com.leroy.inventorymanagementfx.enums.CommonPages;
import com.leroy.inventorymanagementfx.enums.StaffPages;
import com.leroy.inventorymanagementfx.interfaces.FxmlPage;
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController;
import com.leroy.inventorymanagementfx.interfaces.SidebarHasNotificationButton;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.layout.VBox;
import org.kordamp.ikonli.javafx.FontIcon;

import java.net.URL;
import java.util.ResourceBundle;

public class StaffSidebarController implements NeedsMainController, Initializable, SidebarHasNotificationButton {
    @FXML private VBox sidebar;
    @FXML private Button dashboardBtn, inventoryItemsBtn, settingsBtn, logoutBtn, cartBtn;

    private MainController mainController;
    private Button currentlySelectedButton;
    @FXML private Button notificationBtn, requestBtn;

    @Override
    public void setMainController(MainController mainController) {
        this.mainController = mainController;
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        for (Node node : sidebar.getChildren()) {
            if (node instanceof Button button) {
                FontIcon icon = (FontIcon) button.getGraphic();
                if (icon != null) {
                    icon.setIconSize(18);
                }

                // Add style class for selection management
                button.getStyleClass().add("selectable-sidebar-item");
                button.setOnAction(event -> {
                    handleButtonSelection(button);
                });

            }
        }

        // Set initial selection
        setSelectedButton(dashboardBtn);
    }

    /**
     * Sets the 'selected' style class on the given button and removes it from the previously selected button.
     * @param button The button to set as selected.
     */
    private void setSelectedButton(Button button) {
        if (currentlySelectedButton == button) {
            return; // Already selected
        }

        // Remove selected style from the previous button
        if (currentlySelectedButton != null) {
            currentlySelectedButton.getStyleClass().remove("selected");
        }

        // Add selected style to new button
        button.getStyleClass().add("selected");
        currentlySelectedButton = button;
    }

    /**
     * Handles the action when a sidebar button is clicked.
     * Sets the selected style and loads the corresponding page.
     * @param button The button that was clicked.
     */
    private void handleButtonSelection(Button button) {
        setSelectedButton(button);

        if (button == dashboardBtn) mainController.loadView(StaffPages.DASHBOARD);
        else if (button == inventoryItemsBtn) mainController.loadView(StaffPages.INVENTORY_ITEMS);
        else if (button == cartBtn) mainController.loadView(StaffPages.CART);
        else  if (button == logoutBtn) mainController.logout();
        else if (button == notificationBtn) mainController.loadView(CommonPages.NOTIFICATION);
        else if (button == requestBtn) mainController.loadView(StaffPages.REQUESTS);
        // Add more conditions for other sidebar buttons as needed
    }

    /**
     * Public method to programmatically select a sidebar button based on the StaffPages enum.
     * This is called by the MainController to synchronize sidebar selection with page changes.
     * @param page The StaffPages enum representing the page to select in the sidebar.
     */
    public void selectButtonForPage(FxmlPage page) {
        Button buttonToSelect = null;
        if (page == StaffPages.DASHBOARD) {
            buttonToSelect = dashboardBtn;
        } else if (page == StaffPages.INVENTORY_ITEMS) {
            buttonToSelect = inventoryItemsBtn;
        } else if (page == StaffPages.CART) {
            buttonToSelect = cartBtn;
        } else if (page == CommonPages.NOTIFICATION) {
            buttonToSelect = notificationBtn;
        }
        // Add more conditions for other StaffPages if they correspond to sidebar buttons

        if (buttonToSelect != null) {
            setSelectedButton(buttonToSelect);
        }
    }
}
