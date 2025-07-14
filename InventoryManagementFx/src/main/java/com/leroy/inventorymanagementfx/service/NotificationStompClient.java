package com.leroy.inventorymanagementfx.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.controller.MainController;
import com.leroy.inventorymanagementfx.dto.response.WebSocketNotificationDto;
import com.leroy.inventorymanagementfx.enums.CommonPages;
import com.leroy.inventorymanagementfx.enums.StaffPages;
import com.leroy.inventorymanagementfx.security.AuthTokenHolder;
import javafx.application.Platform;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.SimpleBooleanProperty;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.IntegerProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.util.Duration;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.controlsfx.control.Notifications;

import org.springframework.http.HttpHeaders;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.ExecutionException;


public class NotificationStompClient {

    private static final Logger logger = LogManager.getLogger(NotificationStompClient.class);
    private WebSocketStompClient stompClient;
    private StompSession stompSession;
    private final String websocketUrl;
    private final HttpClient httpClient = AuthTokenHolder.getHttpClient();
    private int userId; // The ID of the currently logged-in user
    private final ObjectMapper objectMapper = new ObjectMapper(); // For manual JSON handling if needed, though MappingJackson2MessageConverter handles most

    // Observable properties for UI binding
    private final ObservableList<WebSocketNotificationDto> unreadNotifications = FXCollections.observableArrayList();
    private final IntegerProperty unreadCount = new SimpleIntegerProperty(0);
    private final BooleanProperty connected = new SimpleBooleanProperty(false);

    private MainController mainController;

    private final NotificationService notificationService; // Inject or create this

    public NotificationStompClient(String websocketUrl, int userId) {
        this.websocketUrl = websocketUrl;
        this.userId = userId;
        this.notificationService = new NotificationService(); // Initialize here or inject
        initializeStompClient();
    }

    public void setMainController(MainController mainController) {
        this.mainController = mainController;
        // Add a listener to the unreadCountProperty to automatically update the topbar
        this.unreadCount.addListener((obs, oldVal, newVal) -> {
            if (this.mainController != null) {
                Platform.runLater(() -> this.mainController.updateTopbarNotificationCount(newVal.intValue()));
            }
        });
    }

    private void initializeStompClient() {
        WebSocketClient client = new StandardWebSocketClient(); // Uses JSR-356 (Tyrus is our chosen implementation)
        stompClient = new WebSocketStompClient(client);

        // Crucial: Configures how JSON payloads are converted to/from DTOs
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());
        stompClient.setReceiptTimeLimit(15 * 1000); // Timeout for STOMP message receipts

        // Needed for heartbeats and managing scheduled tasks like reconnections
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.initialize(); // Initialize the scheduler
        stompClient.setTaskScheduler(taskScheduler);
    }

    public void connect() {
        logger.info("Attempting to connect STOMP client to: {}", websocketUrl);

        new Thread(() -> {
            try {
                WebSocketHttpHeaders httpHeaders = new WebSocketHttpHeaders();
                httpHeaders.add(HttpHeaders.AUTHORIZATION, "Bearer " + AuthTokenHolder.getJwtToken());

                StompHeaders connectHeaders = new StompHeaders();
                connectHeaders.add("Authorization", "Bearer " + AuthTokenHolder.getJwtToken());

                stompSession = stompClient
                        .connectAsync(websocketUrl, httpHeaders, connectHeaders, new StompSessionHandlerImpl())
                        .get();

            } catch (InterruptedException | ExecutionException e) {
                logger.error("Failed to connect STOMP client", e);
                Platform.runLater(() -> connected.set(false));
            }
        }).start();
    }

    public void disconnect() {
        if (stompSession != null && stompSession.isConnected()) {
            logger.info("Attempting to disconnect STOMP client...");
            stompSession.disconnect();
            Platform.runLater(() -> connected.set(false));
        } else if (stompClient != null && stompClient.getTaskScheduler() instanceof ThreadPoolTaskScheduler scheduler) {
            // Shut down the scheduler cleanly if it exists and is an instance of ThreadPoolTaskScheduler
            scheduler.shutdown();
        }
    }

    // ... (StompSessionHandlerImpl and StompFrameHandlerImpl as provided, they're well-implemented)
    // The handleFrame methods correctly add to unreadNotifications and show toasts.

    // UI related methods (as provided, excellent for binding)
    public ObservableList<WebSocketNotificationDto> getUnreadNotifications() {
        return unreadNotifications;
    }

    public IntegerProperty unreadCountProperty() {
        return unreadCount;
    }

    public BooleanProperty connectedProperty() {
        return connected;
    }

    public void markNotificationAsRead(long notificationId) {
        // Remove from the local observable list ONLY if it's the unread list
        // This is primarily for the topbar count. The full list is handled by NotificationPageController
        Platform.runLater(() -> {
            boolean removed = unreadNotifications.removeIf(n -> n.getId() == notificationId);
            if (removed) {
                // Update the topbar count immediately based on its own source
                unreadCount.set(unreadNotifications.size());
            }
        });

        // Call the backend API to persist the 'read' status
        // Use the new NotificationService method
        notificationService.markNotificationAsRead(notificationId)
                .thenAccept(success -> {
                    if (success) {
                        logger.info("Notification {} marked as read on backend.", notificationId);
                        // No need to explicitly update unreadCount here from this class,
                        // as the NotificationPageController will re-calculate from its full list,
                        // or if the stomp client's unreadNotifications list is bound to the topbar,
                        // its `removeIf` above already handles it.
                    } else {
                        logger.warn("Failed to mark notification {} as read on backend.", notificationId);
                    }
                })
                .exceptionally(ex -> {
                    logger.error("Error marking notification {} as read on backend: {}", notificationId, ex.getMessage());
                    return null;
                });
    }

    /**
     * Sends a request to the backend to mark a notification as read.
     * This will be implemented in the "Integrating Backend API Calls" section.
     */
    private void sendMarkAsReadToBackend(long notificationId) {
        // TODO: Implement actual HTTP PUT request to your backend's /api/notifications/{id}/mark-read endpoint
        // Example (using java.net.http.HttpClient - recommended for modern JavaFX):

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(Config.getBackendUrl() + "api/notifications/" + notificationId + "/mark-read"))
                    .PUT(HttpRequest.BodyPublishers.noBody())
                    .header("Authorization", "Bearer " + AuthTokenHolder.getJwtToken()) // If authentication is used
                    .build();
            httpClient.sendAsync(request, HttpResponse.BodyHandlers.discarding())
                  .thenAccept(response -> {
                      if (response.statusCode() == 200) {
                          logger.info("Notification {} marked as read on backend.", notificationId);
                      } else {
                          logger.warn("Failed to mark notification {} as read on backend. Status: {}", notificationId, response.statusCode());
                      }
                  })
                  .exceptionally(ex -> {
                      logger.error("Error marking notification {} as read on backend: {}", notificationId, ex.getMessage());
                      return null;
                  });
        } catch (Exception e) {
            logger.error("Error creating HTTP request to mark notification as read: {}", e.getMessage());
        }
        
    }



    /**
     * Displays a toast notification with styling and integrated navigation.
     * The appearance is controlled by CSS classes applied based on notification type.
     * Clicking the toast will mark it as read and navigate to the relevant view.
     *
     * @param notification The WebSocketNotificationDto containing notification details.
     */
    private void showToastNotification(WebSocketNotificationDto notification) {
        Notifications notifications = Notifications.create()
                .title(notification.getTitle())
                .text(notification.getMessage())
                .hideAfter(Duration.seconds(10))
                .position(javafx.geometry.Pos.BOTTOM_RIGHT)
                .onAction(event -> {
                    // This block executes when the toast notification is clicked.
                    logger.info("Notification toast clicked: {} (ID: {})", notification.getTitle(), notification.getId());

                    // Mark as read when navigated. Do this BEFORE navigation to ensure it's processed.
                    // This is handled by the markNotificationAsRead method which also updates UI.
                    if (!notification.isRead()) {
                        markNotificationAsRead(notification.getId());
                        // Optimistically update the DTO if needed for immediate UI response,
                        // though markNotificationAsRead should handle the observable list.
                        notification.setRead(true);
                    }

                    // Navigate to a specific view based on notification type
                    if (mainController != null) {
                        switch (notification.getType()) {
                            case NEW_REQUEST:
                            case REQUEST_APPROVED:
                            case REQUEST_REJECTED:
                            case REQUEST_FULFILLED:
                                if (notification.getRequestId() != null) {
                                    mainController.loadView(CommonPages.REQUEST_DETAILS, notification.getRequestId());
                                    // Assuming StaffPages.REQUESTS is the correct sidebar item for request details
                                    mainController.updateSidebarSelection(StaffPages.REQUESTS);
                                } else {
                                    logger.warn("Notification type is request-related, but no requestId found for notification ID: {}", notification.getId());
                                    mainController.showInfoAlert("Missing Request ID", "Could not open request details. Request ID not found for this notification.");
                                }
                                break;
                            case LOW_STOCK:
                                // Assuming these link to inventory item details
                                if (notification.getItemId() != null) {
                                    // Convert Integer to Long if your loadView expects Long for item IDs
                                    mainController.loadView(CommonPages.INVENTORY_ITEM_DETAILS, notification.getItemId().longValue());
                                    // Choose the appropriate sidebar selection based on the user's role
                                    // For Staff:
                                    mainController.updateSidebarSelection(StaffPages.INVENTORY_ITEMS);
                                    // For Storekeeper (if applicable, uncomment and use StorekeeperPages):
                                    // mainController.updateSidebarSelection(StorekeeperPages.INVENTORY_ITEMS);
                                } else {
                                    logger.warn("Notification type is item-related, but no itemId found for notification ID: {}", notification.getId());
                                    mainController.showInfoAlert("Missing Item ID", "Could not open item details. Item ID not found for this notification.");
                                }
                                break;
                            case GENERAL:
                            default:
                                mainController.showInfoAlert("No Specific Details", "This notification does not have specific details to view.");
                                logger.info("No specific view defined for notification type: {}", notification.getType());
                                break;
                        }
                    } else {
                        logger.error("MainController is null in NotificationStompClient. Cannot navigate from toast.");
                    }
                });

        // Apply CSS style classes based on notification type for visual differentiation
        switch (notification.getType()) {
            case REQUEST_APPROVED:
                notifications.show(); // Use show() and let CSS handle the styling
                notifications.getStyleClass().add("confirm"); // Add a CSS class for success/confirm
                break;
            case REQUEST_REJECTED:
                notifications.show();
                notifications.getStyleClass().add("error"); // Add a CSS class for error
                break;
            case LOW_STOCK:
                notifications.show();
                notifications.getStyleClass().add("warning"); // Add a CSS class for warning
                break;
            case NEW_REQUEST:
                notifications.show();
                notifications.getStyleClass().add("new-request"); // Custom class for new requests
                break;
            case REQUEST_FULFILLED:
                notifications.show();
                notifications.getStyleClass().add("fulfilled"); // Custom class for fulfilled requests
                break;
            case GENERAL:
            default:
                notifications.show();
                notifications.getStyleClass().add("information"); // Default info style
                break;
        }
    }

    // *** RESTORE THESE INNER CLASSES HERE ***
    private class StompSessionHandlerImpl extends StompSessionHandlerAdapter {

        @Override
        public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
            logger.info("STOMP Connected to: {}", session.getSessionId());
            stompSession = session; // Store the session for later use (e.g., subscribing, disconnecting)
            Platform.runLater(() -> connected.set(true));

            // Subscribe to the user-specific topic
            String topic = "/topic/notifications/user-" + userId;
            logger.info("Subscribing to STOMP topic: {}", topic);
            session.subscribe(topic, new StompFrameHandlerImpl());

            // Optionally, fetch initial unread notifications from REST API here
            // This is useful if the user logs in and there are already notifications in the DB.
        }

        @Override
        public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload, Throwable exception) {
            logger.error("STOMP handleException for command {}: {}", command, exception.getMessage(), exception);
            Platform.runLater(() -> connected.set(false));
        }

        @Override
        public void handleTransportError(StompSession session, Throwable exception) {
            logger.error("STOMP Transport Error: {}", exception.getMessage(), exception);
            Platform.runLater(() -> connected.set(false));
            // Implement re-connection logic here if needed
            // For production, you'd want a back-off retry mechanism
        }

        @Override
        public Type getPayloadType(StompHeaders headers) {
            // This method tells the message converter what type to convert the payload to
            return WebSocketNotificationDto.class;
        }

        @Override
        public void handleFrame(StompHeaders headers, Object payload) {
            // This method is called when a message is received on a subscribed topic
            if (payload instanceof WebSocketNotificationDto notificationDto) {
                logger.info("Received STOMP notification: {}", notificationDto.getTitle());

                Platform.runLater(() -> {
                    if (!notificationDto.isRead()) {
                        unreadNotifications.addFirst(notificationDto); // Add to top of the list
                        unreadCount.set(unreadNotifications.size());
                    }
                    showToastNotification(notificationDto);
                });
            } else {
                logger.warn("Received unexpected payload type: {}", payload != null ? payload.getClass().getName() : "null");
            }
        }
    }

    // Inner class to handle messages for a specific subscription
    private class StompFrameHandlerImpl implements StompFrameHandler {
        @Override
        public Type getPayloadType(StompHeaders headers) {
            // This specifies the type for the message body (the Notification DTO)
            return WebSocketNotificationDto.class;
        }

        @Override
        public void handleFrame(StompHeaders headers, Object payload) {
            // This method is called when a message is received on *this* specific subscription
            // The payload is already converted by the MappingJackson2MessageConverter
            if (payload instanceof WebSocketNotificationDto notificationDto) {
                logger.info("Received STOMP message on topic: {}", notificationDto.getTitle());

                Platform.runLater(() -> {
                    if (!notificationDto.isRead()) {
                        unreadNotifications.addFirst(notificationDto); // Add to top of the list
                        unreadCount.set(unreadNotifications.size());
                    }
                    showToastNotification(notificationDto);
                });
            }
        }
    }
}


