package com.leroy.inventorymanagementfx.controller;

import com.leroy.inventorymanagementfx.controller.staff.StaffTopbarController;
import com.leroy.inventorymanagementfx.dto.response.WebSocketNotificationDto;
import com.leroy.inventorymanagementfx.enums.AdminPages;
import com.leroy.inventorymanagementfx.enums.CommonPages;
import com.leroy.inventorymanagementfx.enums.StaffPages;
import com.leroy.inventorymanagementfx.enums.StorekeeperPages;
import com.leroy.inventorymanagementfx.interfaces.*;
import com.leroy.inventorymanagementfx.security.UserSession;
import com.leroy.inventorymanagementfx.service.AuthService;
import com.leroy.inventorymanagementfx.service.NotificationStompClient;
import com.leroy.inventorymanagementfx.util.FXMLLoaderUtil;
import com.leroy.inventorymanagementfx.util.SidebarToggler;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.layout.BorderPane;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URL;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.ResourceBundle;

public class MainController implements Initializable {

    @FXML
    private BorderPane rootLayout;
    private final Deque<FxmlPage> backStack = new ArrayDeque<>();
    private final Deque<FxmlPage> forwardStack = new ArrayDeque<>();
    private FxmlPage currentPage;
    private final UserSession userSession = UserSession.getInstance();
    private final Logger logger = LogManager.getLogger(MainController.class);
    private final AuthService authService = new AuthService();

    private SidebarHasNotificationButton sidebarController;
    private StaffTopbarController staffTopbarController;
    private HasNotificationCount currentTopbarWithNotification;
    private NotificationStompClient notificationStompClient;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        String role = userSession.getRole();
        logger.info("MainController initialized. User Role: {}", role);
    }

    public void initializeApplication() {
        String role = userSession.getRole();
        if (role == null) {
            loadView(CommonPages.LOGIN); // Use new overload
        } else {
            loadTopBar(getDefaultTopBar(role));
            loadSideBar(getDefaultSidebar(role));
            loadView(getDefaultPage(role)); // Use new overload for initial dashboard
        }
    }

    /**
     * Handles a new WebSocket notification received by the application.
     * This method is called by the InventoryApplication.
     * It decides how to propagate the notification to currently active views.
     * @param newNotification The new notification DTO.
     */
    public void handleNewWebSocketNotification(WebSocketNotificationDto newNotification) {
        Platform.runLater(() -> {
            // Update the topbar count immediately (already bound via notificationStompClient.unreadCountProperty())
            // no explicit call needed here if the binding is set up correctly in loadTopBar

            // If the current page is the NotificationPage, add it to its display list
            if (currentPage != null && currentPage.getFxmlName().equals(CommonPages.NOTIFICATION.getFxmlName())) {
                // Assuming NotificationPageController is the controller for CommonPages.NOTIFICATION
                // You'll need to ensure you can get a reference to the active NotificationPageController instance.
                // This typically involves storing a reference when it's loaded by doLoadView.
                // For simplicity, let's assume you have a way to get the current controller.
                if (rootLayout.getCenter() != null && rootLayout.getCenter().getUserData() instanceof NotificationPageController notificationPageController) {
                    notificationPageController.addAndDisplayNewWebSocketNotification(newNotification);
                } else {
                    logger.warn("Notification page is the current view, but its controller is not accessible for direct update.");
                    // Fallback: If not accessible, consider triggering a full refresh next time page is loaded
                    // or ensuring the notificationStompClient's internal list correctly reflects it,
                    // which will eventually lead to a correct count on the topbar.
                }
            }

        });
    }

    /**
     * Sets the NotificationStompClient for the MainController.
     * This method should be called by the Application class after the client is initialized.
     * @param client The NotificationStompClient instance.
     */
    public void setNotificationStompClient(NotificationStompClient client) {
        this.notificationStompClient = client;
        logger.info("NotificationStompClient set in MainController.");

        // REMOVE THE BINDING LOGIC FROM HERE.
        // It will be handled in loadTopBar where currentTopbarWithNotification is guaranteed to be set.
        if (currentTopbarWithNotification == null) {
            logger.warn("NotificationStompClient set, but topbar not yet loaded. Binding will occur when topbar is available.");
        }
    }

    public void setSidebarVisible(boolean visible) {
        Node sidebar = rootLayout.getLeft();
        if (sidebar != null) {
            sidebar.setVisible(visible);
            sidebar.setManaged(visible);
        }
    }

    public void loadTopBar(FxmlPage page) {
        Node topbar = FXMLLoaderUtil.load(page.getPath(), controller -> {
            if (controller instanceof NeedsMainController) {
                ((NeedsMainController) controller).setMainController(this);
            }

            if (controller instanceof HasNotificationCount) {
                this.currentTopbarWithNotification = (HasNotificationCount) controller;
                // --- CRITICAL CHANGE: Establish binding here when topbar is available ---
                if (notificationStompClient != null) {
                    Platform.runLater(() -> { // Ensure UI updates are on JavaFX thread
                        // Remove any old listener before adding a new one, though typically not needed
                        // if loadTopBar replaces the topbar entirely. If it's the same topbar
                        // being re-used, you'd want to manage listeners to prevent duplicates.
                        // For a typical app, reloading a view means creating new controllers.

                        // Bind the topbar's update method to the StompClient's unread count property
                        notificationStompClient.unreadCountProperty().addListener((obs, oldVal, newVal) -> {
                            // Ensure the topbar is still the current one before updating
                            if (this.currentTopbarWithNotification == controller) { // Added check for robustness
                                this.currentTopbarWithNotification.updateNotificationCount(newVal.intValue());
                            }
                        });

                        // Set the initial count immediately
                        this.currentTopbarWithNotification.updateNotificationCount(notificationStompClient.getUnreadNotifications().size());
                        logger.info("Topbar notification count bound successfully to NotificationStompClient.");
                    });
                } else {
                    logger.warn("NotificationStompClient is null when loading topbar. Cannot bind notification count.");
                }
            } else {
                this.currentTopbarWithNotification = null;
                logger.warn("Loaded topbar controller does not implement HasNotificationCount.");
            }
        });

        if (topbar != null) {
            rootLayout.setTop(topbar);
        }
    }
    public void loadSideBar(FxmlPage page) {
        // No longer need array holder, can assign directly to the field in the callback
        Node sidebar = FXMLLoaderUtil.load(page.getPath(), controller -> {
            if (controller instanceof NeedsMainController) {
                ((NeedsMainController) controller).setMainController(this);
            }
            // Assign to sidebarController if it implements the general interface
            if (controller instanceof SidebarHasNotificationButton) {
                this.sidebarController = (SidebarHasNotificationButton) controller;
            } else {
                this.sidebarController = null; // Ensure it's null if new sidebar doesn't implement
            }
        });

        if (sidebar != null) {
            rootLayout.setLeft(sidebar);
            // sidebarController is already set inside the callback
        }
    }


    /**
     * Overloaded method to load an FXML page without an associated entity ID.
     * This is for general page navigation (e.g., Dashboard, My Requests list).
     * @param page The FxmlPage enum instance representing the target page.
     */
    public void loadView(FxmlPage page) {
        loadView(page, null);
    }

    /**
     * Overloaded method to load an FXML page, potentially with an associated entity ID.
     * This is useful for detail views (e.g., Request Details, Item Details).
     * @param page The FxmlPage enum instance representing the target page.
     * @param entityId Optional ID of an entity to be displayed or acted upon in the new view. Can be null.
     */
    public void loadView(FxmlPage page, Long entityId) {
        // Delegate to the core loading logic using the FXML name
        doLoadView(page, entityId);
    }

    /**
     * Core private method to handle the actual loading of an FXML view.
     * It manages history, injects the MainController, and passes entity IDs.
     * @param targetPage The FxmlPage enum instance representing the target page.
     * @param entityId Optional ID of an entity to be displayed or acted upon in the new view. Can be null.
     */
    private void doLoadView(FxmlPage targetPage, Long entityId) {
        if (targetPage == null) {
            logger.error("Attempted to load a null FxmlPage.");
            showErrorAlert("Navigation Error", "Attempted to navigate to an unknown page.");
            return;
        }

        // Handle login page specifically (no sidebar, clear history)
        boolean isLoginPage = targetPage.getPath().equals(CommonPages.LOGIN.getPath());
        setSidebarVisible(!isLoginPage);
        if (isLoginPage) {
            backStack.clear();
            forwardStack.clear();
            currentPage = null; // Clear the current page as well for login
        }

        // Manage navigation history (back/forward stack)
        // Only push to history if it's not the login page, and it's a new page
        if (currentPage != null && !isLoginPage && !targetPage.equals(currentPage)) {
            logger.debug("Adding current page {} to back stack", currentPage.getFxmlName());
            backStack.push(currentPage);
            forwardStack.clear(); // Any forward history is invalidated when a new page is loaded
        }


        Node content = FXMLLoaderUtil.load(targetPage.getPath(), controller -> {
            if (controller instanceof NeedsMainController) {
                ((NeedsMainController) controller).setMainController(this);
            }

            // --- CRITICAL ADDITION FOR SUB-CONTROLLERS ---
            // If the loaded controller needs NotificationStompClient, inject it.
            if (controller instanceof NeedsNotificationStompClient) {
                ((NeedsNotificationStompClient) controller).setNotificationStompClient(this.notificationStompClient);
                logger.debug("Injected NotificationStompClient into controller: {}", controller.getClass().getSimpleName());
            }

            // Pass the entity ID to specific detail controllers
            // Use targetPage.getFxmlName() for comparison
            if (targetPage.getFxmlName().equals("request-details-view") && controller instanceof RequestDetailsController) {
                ((RequestDetailsController) controller).setRequestId(entityId);
            }
            // Add more conditions here for other detail views needing an ID:
            // else if (targetPage.getFxmlName().equals("add-batch-view") && controller instanceof AddBatchController) {
            //     ((AddBatchController) controller).setInventoryItemId(entityId);
            // }
            // else if (targetPage.getFxmlName().equals("inventory-item-details-view") && controller instanceof InventoryItemDetailsController) {
            //     ((InventoryItemDetailsController) controller).setItemId(entityId);
            // }
        });

        if (content != null) {
            currentPage = targetPage; // Update current page
            rootLayout.setCenter(content);
            logger.info("Successfully loaded view: {}", targetPage.getFxmlName());
        } else {
            logger.error("Failed to load content for view: {}", targetPage.getFxmlName());
            showErrorAlert("Navigation Error", "Failed to load content for " + targetPage.getFxmlName() + ".");
        }
    }


    public void goBack() {
        if (!backStack.isEmpty()) {
            forwardStack.push(currentPage);
            FxmlPage previous = backStack.pop();
            // Call the core loading method, but without adding to history again
            doLoadView(previous, null); // Assuming back button won't carry entity ID context for now
            updateSidebarSelection(previous); // This will need to be fixed
        }
    }

    public void goForward() {
        if (!forwardStack.isEmpty()) {
            backStack.push(currentPage);
            FxmlPage next = forwardStack.pop();
            // Call the core loading method, but without adding to history again
            doLoadView(next, null); // Assuming forward button won't carry entity ID context for now
            updateSidebarSelection(next); // This will need to be fixed
        }
    }

    // Keep loadPageWithoutTracking if you have specific scenarios where history shouldn't be affected.
    // This is less needed now with the refined doLoadView, but keeping it for context/migration.
    // For general navigation, loadView(FxmlPage) is preferred.
    private void loadPageWithoutTracking(FxmlPage page) {
        doLoadView(page, null); // Delegate to the core logic without history modification
    }

    private FxmlPage getDefaultPage(String role) {
        if (role == null || role.isEmpty()) {
            return CommonPages.LOGIN;
        }
        return switch (role) {
            case "ADMIN" -> AdminPages.DASHBOARD;
            case "STOREKEEPER" -> StorekeeperPages.DASHBOARD;
            default -> StaffPages.DASHBOARD;
        };
    }

    private FxmlPage getDefaultTopBar(String role) {
        return switch (role) {
            case "ADMIN" -> AdminPages.TOPBAR;
            case "STOREKEEPER" -> StorekeeperPages.TOPBAR;
            default -> StaffPages.TOPBAR;
        };
    }

    private FxmlPage getDefaultSidebar(String role){
        return switch (role) {
            case "ADMIN" -> AdminPages.SIDEBAR;
            case "STOREKEEPER" -> StorekeeperPages.SIDEBAR;
            default -> StaffPages.SIDEBAR;
        };
    }

    @FXML
    public void toggleSidebar() {
        SidebarToggler.toggleSidebar(rootLayout);
    }

    public void logout(){
        authService.logout();
        loadView(CommonPages.LOGIN); // Use new overload
        rootLayout.setTop(null);
        rootLayout.setLeft(null);
    }



    public void updateSidebarSelection(FxmlPage page) {
        if (sidebarController != null) {
            // This method in SidebarHasNotificationButton interface/StaffSidebarController
            // likely needs to be updated to accept the FxmlPage or its fxmlName.
            // Assuming it takes FxmlPage now based on your previous code.
            sidebarController.selectButtonForPage(page);
        } else {
            logger.warn("sidebarController is null. Cannot update sidebar selection.");
        }
    }

    public void updateTopbarItemCount(int count) {
        if (staffTopbarController != null) {
            staffTopbarController.updateItemCount(count);
        }
    }

    public void updateTopbarNotificationCount(int count) {
        if (currentTopbarWithNotification != null) {
            Platform.runLater(() -> currentTopbarWithNotification.updateNotificationCount(count));
        } else {
            logger.warn("Current topbar does not implement HasNotificationCount. Cannot update notification count.");
        }
    }

    public void showErrorAlert(String title, String message) {
        Platform.runLater(() -> {
            Alert alert = new Alert(AlertType.ERROR);
            alert.setTitle(title);
            alert.setHeaderText(null);
            alert.setContentText(message);
            alert.showAndWait();
        });
    }

    public void showInfoAlert(String title, String message) {
        Platform.runLater(() -> {
            Alert alert = new Alert(AlertType.INFORMATION);
            alert.setTitle(title);
            alert.setHeaderText(null);
            alert.setContentText(message);
            alert.showAndWait();
        });
    }
}