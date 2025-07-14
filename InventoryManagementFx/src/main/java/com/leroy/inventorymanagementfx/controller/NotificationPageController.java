package com.leroy.inventorymanagementfx.controller;

import com.leroy.inventorymanagementfx.dto.response.NotificationResponseDto;
import com.leroy.inventorymanagementfx.dto.response.WebSocketNotificationDto;
import com.leroy.inventorymanagementfx.enums.CommonPages; // Assuming RequestDetails is a CommonPage
import com.leroy.inventorymanagementfx.enums.NotificationType;
import com.leroy.inventorymanagementfx.enums.StaffPages; // Assuming RequestDetails might be StaffPages
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController; // Import this interface
import com.leroy.inventorymanagementfx.interfaces.NeedsNotificationStompClient;
import com.leroy.inventorymanagementfx.security.UserSession;
import com.leroy.inventorymanagementfx.service.NotificationService;
import com.leroy.inventorymanagementfx.service.NotificationStompClient;
import javafx.application.Platform;
import javafx.beans.binding.Bindings;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ListCell;
import javafx.scene.control.ListView;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

public class NotificationPageController implements NeedsMainController, NeedsNotificationStompClient { // Add NeedsNotificationStompClient

    private static final Logger LOGGER = LogManager.getLogger(NotificationPageController.class);
    private final NotificationService notificationService = new NotificationService();

    @FXML private Label unreadCountLabel;
    @FXML private ListView<WebSocketNotificationDto> notificationListView;
    @FXML private Button markAllReadButton;
    @FXML private Button refreshButton;
    @FXML private Label emptyStateLabel;

    private NotificationStompClient notificationStompClient;
    private MainController mainController; // Declare MainController field

    // New ObservableList to hold ALL notifications for the ListView display
    private final ObservableList<WebSocketNotificationDto> allNotificationsForDisplay = javafx.collections.FXCollections.observableArrayList();

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm").withZone(ZoneId.systemDefault());


    // Implement setMainController from NeedsMainController
    @Override
    public void setMainController(MainController mainController) {
        this.mainController = mainController;
        // No action needed here for notification binding, that happens via setNotificationStompClient
    }

    @Override
    public void setNotificationStompClient(NotificationStompClient client) {
        this.notificationStompClient = client;
        LOGGER.info("NotificationStompClient set in NotificationPageController. Proceeding with UI setup.");

        Platform.runLater(() -> {
            notificationListView.setItems(allNotificationsForDisplay);
            unreadCountLabel.textProperty().bind(notificationStompClient.unreadCountProperty().asString("Unread: %d"));

            // IMPORTANT: Remove the self-triggering listener here
            // The MainController or other central logic should manage how new WebSocket
            // messages affect this page, not a direct loop.
            // When a new WebSocket message arrives, the mainController might
            // call updateNotificationsFromWebSocket(newNotification).

            setupButtonActions();
            fetchNotificationsForDisplay(); // Initial fetch on page load/setup
        });
    }
    

    @FXML
    public void initialize() {
        // This method is called by FXML loader. Do not set notificationStompClient here.
        // It's too early for dependencies injected by MainController's loadView method.
        // Perform initial UI setup that does NOT depend on notificationStompClient or mainController.
        updateEmptyStateVisibility(); // Set initial visibility for empty state label
    }

    private void setupButtonActions() {
        if (markAllReadButton != null) {
            markAllReadButton.setOnAction(event -> handleMarkAllRead());
            // Disable until client is ready or list has items
            markAllReadButton.disableProperty().bind(Bindings.isEmpty(allNotificationsForDisplay));
        }
        if (refreshButton != null) {
            refreshButton.setOnAction(event -> handleRefresh());
        }

        // This is the correct place to set the cell factory, as notificationStompClient and mainController are guaranteed non-null here.
        if (notificationListView != null && notificationStompClient != null && mainController != null) {
            notificationListView.setCellFactory(lv -> new NotificationCell(mainController, notificationStompClient, this));
        } else {
            LOGGER.warn("Failed to set NotificationCell factory: ListView, StompClient or MainController is null, this should not happen now.");
        }
    }

    private void updateEmptyStateVisibility() {
        boolean isEmpty = allNotificationsForDisplay.isEmpty();
        emptyStateLabel.setVisible(isEmpty);
        emptyStateLabel.setManaged(isEmpty);
        notificationListView.setVisible(!isEmpty);
        notificationListView.setManaged(!isEmpty);
    }

    private void fetchNotificationsForDisplay() {
        if (notificationStompClient == null) {
            LOGGER.error("NotificationStompClient is null in fetchNotificationsForDisplay. Cannot fetch or update UI.");
            return;
        }

        int userId = UserSession.getInstance().getId();
        notificationService.fetchAllNotificationsForUser(userId)
                .thenAccept(backendNotifications -> Platform.runLater(() -> {
                    try {
                        allNotificationsForDisplay.clear();

                        List<WebSocketNotificationDto> convertedAndSorted = backendNotifications.stream()
                                .map(this::toWebSocketNotificationDto)
                                .sorted(Comparator.comparing(WebSocketNotificationDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                                .collect(java.util.ArrayList::new, java.util.ArrayList::add, java.util.ArrayList::addAll);

                        allNotificationsForDisplay.addAll(convertedAndSorted);

                        long unreadCount = backendNotifications.stream().filter(n -> !n.isRead()).count();

                        // Update the STOMP client's unread count property
                        notificationStompClient.unreadCountProperty().set((int) unreadCount);

                        // IMPORTANT: ONLY update the STOMP client's internal unread list if necessary.
                        // This should reflect the *actual* current unread count from the backend.
                        // This is fine here as it's a full sync from the backend.
                        notificationStompClient.getUnreadNotifications().clear();
                        backendNotifications.stream()
                                .filter(n -> !n.isRead())
                                .map(this::toWebSocketNotificationDto)
                                .forEach(notificationStompClient.getUnreadNotifications()::add);


                        updateEmptyStateVisibility();
                        LOGGER.info("Fetched {} total notifications from backend for display. {} unread.",
                                allNotificationsForDisplay.size(), unreadCount);
                    } catch (Exception e) {
                        LOGGER.error("Error updating notification list in UI: {}", e.getMessage(), e);
                    }
                }))
                .exceptionally(ex -> {
                    LOGGER.error("Failed to fetch all notifications from backend: {}", ex.getMessage(), ex);
                    return null;
                });
    }

    /**
     * Call this method from MainController when a new WebSocket notification arrives
     * and the NotificationPage is currently visible.
     */
    public void addAndDisplayNewWebSocketNotification(WebSocketNotificationDto newNotification) {
        Platform.runLater(() -> {
            LOGGER.info("Adding new WebSocket notification to display: {}", newNotification.getTitle());
            // Add the new notification to the display list
            allNotificationsForDisplay.addFirst(newNotification); // Add to top for recent
            allNotificationsForDisplay.sort(Comparator.comparing(WebSocketNotificationDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()))); // Re-sort

            // Then re-calculate unread count from the current display list and update StompClient
            updateUnreadCountInUI();
            updateEmptyStateVisibility(); // Re-check empty state
        });
    }


    private WebSocketNotificationDto toWebSocketNotificationDto(NotificationResponseDto dto) {
        WebSocketNotificationDto webSocketDto = new WebSocketNotificationDto();
        webSocketDto.setId(dto.getId());
        webSocketDto.setTitle(dto.getTitle());
        webSocketDto.setMessage(dto.getMessage());
        webSocketDto.setRead(dto.isRead());
        webSocketDto.setType(dto.getType());
        webSocketDto.setRequestId(dto.getRequestId());
        webSocketDto.setItemId(dto.getItemId());
        webSocketDto.setCreatedAt(dto.getCreatedAt());
        return webSocketDto;
    }

    @FXML
    private void handleMarkAllRead() {
        if (UserSession.getInstance().isAuthenticated()) {
            notificationService.markAllAsRead(UserSession.getInstance().getId()).thenAccept(success -> {
                if (success) {
                    Platform.runLater(() -> {
                        allNotificationsForDisplay.forEach(n -> n.setRead(true));
                        // The next line will implicitly update the top bar via binding
                        notificationStompClient.unreadCountProperty().set(0);
                        updateEmptyStateVisibility();
                        LOGGER.info("All notifications marked as read on client.");
                        // No need for fetchNotificationsForDisplay() here as UI is optimistically updated
                        // unless you need to sync with backend for some reason, which might cause a flicker.
                        // Consider if a full re-fetch is truly needed, or if the optimistic update is enough.
                        // If backend triggers new websocket messages on markAllRead, it will auto-update.
                    });
                } else {
                    Platform.runLater(() -> LOGGER.warn("Failed to mark all notifications as read on backend."));
                }
            }).exceptionally(ex -> {
                LOGGER.error("Error marking all notifications as read: {}", ex.getMessage(), ex);
                return null;
            });
        } else {
            LOGGER.warn("User not authenticated. Cannot mark all notifications as read.");
        }
    }
    

    @FXML
    private void handleRefresh() {
        fetchNotificationsForDisplay(); // Now fetches all
    }


    // Custom ListCell to display notifications nicely
    private class NotificationCell extends ListCell<WebSocketNotificationDto> {
        private final VBox content;
        private final Label titleLabel;
        private final Label messageLabel;
        private final Label timestampLabel;
        private final HBox actionsContainer;
        private final Button markReadButton;
        private final Button viewDetailsButton;
        private final MainController cellMainController;
        private final NotificationStompClient cellNotificationStompClient; // Need reference to stomp client
        private final NotificationPageController cellNotificationPageController; // Need reference to parent controller

        // Constructor now accepts MainController, NotificationStompClient, and NotificationPageController
        public NotificationCell(MainController mainController, NotificationStompClient stompClient, NotificationPageController pageController) {
            super();
            this.cellMainController = mainController;
            this.cellNotificationStompClient = stompClient;
            this.cellNotificationPageController = pageController;

            // ... (rest of your label, button, and container initialization) ...
            titleLabel = new Label();
            titleLabel.getStyleClass().add("notification-title");
            messageLabel = new Label();
            messageLabel.setWrapText(true);
            messageLabel.getStyleClass().add("notification-message");
            timestampLabel = new Label();
            timestampLabel.getStyleClass().add("notification-timestamp");

            markReadButton = new Button("Mark as Read");
            markReadButton.getStyleClass().add("mark-read-button");
            markReadButton.setOnAction(event -> {
                WebSocketNotificationDto item = getItem();
                if (item != null && !item.isRead()) { // Only mark if not already read
                    // Call the NotificationStompClient's method which also calls backend API
                    cellNotificationStompClient.markNotificationAsRead(item.getId());
                    // Optimistically update this specific cell's item state
                    item.setRead(true);
                    updateItem(item, false); // Force update of the cell's graphic/style

                    // This will also eventually trigger the overall fetchNotificationsForDisplay
                    // through the stompClient's listener on its unread list.
                    // For immediate local update of total unread count:
                    cellNotificationPageController.updateUnreadCountInUI(); // New helper to re-calculate UI unread count
                }
            });

            viewDetailsButton = new Button("View Details");
            viewDetailsButton.getStyleClass().add("view-details-button");
            viewDetailsButton.setOnAction(event -> {
                WebSocketNotificationDto item = getItem();
                if (item != null && cellMainController != null) {
                    LOGGER.info("Viewing details for notification: {} (ID: {})", item.getTitle(), item.getId());

                    // Mark as read when navigated. Do this BEFORE navigation to ensure it's processed.
                    if (!item.isRead()) {
                        cellNotificationStompClient.markNotificationAsRead(item.getId());
                        item.setRead(true); // Optimistically update
                        updateItem(item, false); // Force cell update
                        cellNotificationPageController.updateUnreadCountInUI(); // Update count
                    }

                    // Determine which page to load based on notification type and available IDs
                    switch (item.getType()) {
                        case NEW_REQUEST:
                        case REQUEST_APPROVED:
                        case REQUEST_REJECTED:
                        case REQUEST_FULFILLED:
                            if (item.getRequestId() != null) {
                                cellMainController.loadView(CommonPages.REQUEST_DETAILS, item.getRequestId());
                                cellMainController.updateSidebarSelection(StaffPages.REQUESTS);
                            } else {
                                LOGGER.warn("Notification type is request-related, but no requestId found for notification ID: {}", item.getId());
                                cellMainController.showInfoAlert("Missing Request ID", "Could not open request details. Request ID not found for this notification.");
                            }
                            break;
                        // Add cases for ITEM_RESTOCKED, BATCH_EXPIRED etc. here, similar to above
                        case LOW_STOCK:
//                        case ITEM_RESTOCKED: // Assuming these link to inventory item details
                            if (item.getItemId() != null) {
                                // You might need to confirm the page enum for item details and if it takes an Integer or Long.
                                cellMainController.loadView(CommonPages.INVENTORY_ITEM_DETAILS, item.getItemId().longValue()); // Convert Integer to Long
                                // Ensure you have a relevant sidebar page for inventory items, e.g., StaffPages.INVENTORY_ITEMS
                                // This assumes CommonPages.INVENTORY_ITEM_DETAILS exists and is a valid target.
                                // If your item details are specific to staff/storekeeper, use the appropriate enum.
                                cellMainController.updateSidebarSelection(StaffPages.INVENTORY_ITEMS); // Or StorekeeperPages.INVENTORY_ITEMS
                            } else {
                                LOGGER.warn("Notification type is item-related, but no itemId found for notification ID: {}", item.getId());
                                cellMainController.showInfoAlert("Missing Item ID", "Could not open item details. Item ID not found for this notification.");
                            }
                            break;
                        case GENERAL:
                        default:
                            cellMainController.showInfoAlert("No Specific Details", "This notification does not have specific details to view.");
                            LOGGER.info("No specific view defined for notification type: {}", item.getType());
                            break;
                    }
                } else if (cellMainController == null) {
                    LOGGER.error("MainController is null in NotificationCell. Cannot navigate.");
                }
            });

            actionsContainer = new HBox(10, markReadButton, viewDetailsButton);
            actionsContainer.getStyleClass().add("notification-actions");

            HBox header = new HBox(5, titleLabel, timestampLabel);
            HBox.setHgrow(titleLabel, Priority.ALWAYS);

            content = new VBox(5, header, messageLabel, actionsContainer);
            content.setPadding(new Insets(10));
            content.getStyleClass().add("notification-card");
            VBox.setVgrow(content, Priority.NEVER);
        }

        @Override
        protected void updateItem(WebSocketNotificationDto item, boolean empty) {
            super.updateItem(item, empty);
            if (empty || item == null) {
                setGraphic(null);
                setText(null);
                setStyle(""); // Clear any old styles
                getStyleClass().removeAll("notification-read", "notification-unread"); // Ensure styles are removed
            } else {
                titleLabel.setText(item.getTitle());
                messageLabel.setText(item.getMessage());

                if (item.getCreatedAt() != null) {
                    timestampLabel.setText(formatter.format(item.getCreatedAt().toInstant()));
                } else {
                    timestampLabel.setText("No date");
                }

                boolean isRead = item.isRead();
                markReadButton.setVisible(!isRead);
                markReadButton.setManaged(!isRead);

                // Determine if 'View Details' button should be visible
                boolean hasDetails = (item.getRequestId() != null && isRequestRelated(item.getType())) ||
                        (item.getItemId() != null && isItemRelated(item.getType())); // Use the new helper

                viewDetailsButton.setVisible(hasDetails);
                viewDetailsButton.setManaged(hasDetails);

                // Apply CSS styles based on read status
                getStyleClass().removeAll("notification-read", "notification-unread"); // Clear previous states
                if (isRead) {
                    getStyleClass().add("notification-read");
                } else {
                    getStyleClass().add("notification-unread");
                }
                setGraphic(content);
            }
        }

        // Helper methods for notification types
        private boolean isRequestRelated(NotificationType type) {
            return type == NotificationType.NEW_REQUEST ||
                    type == NotificationType.REQUEST_APPROVED ||
                    type == NotificationType.REQUEST_REJECTED ||
                    type == NotificationType.REQUEST_FULFILLED;
        }

        // New helper method for item-related types
        private boolean isItemRelated(NotificationType type) {
            return type == NotificationType.LOW_STOCK;  // ||
//                    type == NotificationType.ITEM_RESTOCKED ||
//                    type == NotificationType.BATCH_EXPIRED; // Add all relevant item types here
        }
    }

    public void updateUnreadCountInUI() {
        long currentUnreadCount = allNotificationsForDisplay.stream()
                .filter(n -> !n.isRead())
                .count();
        // This will update the bound label and also propagate to the topbar via the NotificationStompClient's property
        if (notificationStompClient != null) {
            notificationStompClient.unreadCountProperty().set((int) currentUnreadCount);
        } else {
            LOGGER.warn("NotificationStompClient is null in updateUnreadCountInUI. Cannot update count.");
        }
    }
}