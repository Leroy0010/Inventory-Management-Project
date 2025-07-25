package com.leroy.inventorymanagementfx;

import com.leroy.inventorymanagementfx.config.Config;
import com.leroy.inventorymanagementfx.controller.MainController;
import com.leroy.inventorymanagementfx.dto.response.WebSocketNotificationDto; // Import WebSocketNotificationDto
import com.leroy.inventorymanagementfx.enums.CommonPages; // Import CommonPages
import com.leroy.inventorymanagementfx.security.UserSession;
import com.leroy.inventorymanagementfx.service.AuthService;
import com.leroy.inventorymanagementfx.service.NotificationStompClient;
import com.leroy.inventorymanagementfx.util.CloseAppDialogUtil;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;
import javafx.stage.WindowEvent;
import javafx.scene.image.Image; // Import Image class
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.awt.*;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.net.URL;
import java.util.Objects;
import java.util.Optional;

public class InventoryApplication extends Application {
    private static final Logger LOGGER = LogManager.getLogger(InventoryApplication.class);
    private static final AuthService authService = new AuthService();
    private NotificationStompClient notificationClient;
    private Stage primaryStage;
    private TrayIcon trayIcon;

    // Keep a reference to the MainController to interact with it
    private MainController mainController;

    @Override
    public void start(Stage stage) throws IOException {
        LOGGER.info("Starting Inventory Management Application");
        this.primaryStage = stage;

        int currentUserId = UserSession.getInstance().getId();
        if (currentUserId == 0) {
            LOGGER.warn("User ID is 0. WebSocket notifications may not work correctly until a user logs in.");
        }
//        System.out.println(Config.getWebSocketURL());
        notificationClient = new NotificationStompClient(Config.getWebSocketURL(), currentUserId);
        notificationClient.connect();

        try {
            LOGGER.debug("Loading main FXML file");
            URL fxmlLocation = getClass().getResource("/fxml/main.fxml");

            if (fxmlLocation == null) {
                LOGGER.error("main.fxml not found at /fxml/main.fxml. Please check the path and file existence.");
                throw new IOException("main.fxml not found at specified location.");
            }

            FXMLLoader loader = new FXMLLoader(fxmlLocation);
            Scene scene = new Scene(loader.load());
            scene.getStylesheets().add(getClass().getResource("/styles/notification.css").toExternalForm());

            // Get the controller instance
            mainController = loader.getController();
            mainController.setNotificationStompClient(notificationClient);

//            Platform.runLater(() -> mainController.initializeApplication());
            mainController.initializeApplication();

            // Pass the notification client to the MainController
//            Platform.runLater(() -> mainController.setNotificationStompClient(notificationClient));

            // --- ADD THIS SECTION TO SET THE WINDOW ICON ---
            try {
                URL iconUrl = getClass().getResource("/static/images/inventoryfxico.ico"); // Path to your desired icon
                if (iconUrl != null) {
                    Image applicationIcon = new Image(iconUrl.toExternalForm());
                    stage.getIcons().add(applicationIcon);
                    LOGGER.info("Application icon set successfully from: {}", iconUrl);
                } else {
                    LOGGER.warn("Window icon not found at /static/images/ucc-logo.png. Using default icon.");
                }
            } catch (Exception e) {
                LOGGER.error("Failed to load application icon: {}", e.getMessage(), e);
            }
            // --- END OF NEW SECTION ---

            stage.setMinWidth(800);
            stage.setMinHeight(750);
            stage.setScene(scene);
            stage.setTitle("Inventory Management System");
            stage.show();
            LOGGER.info("Application UI initialized successfully");

            // Setup system tray
            setupSystemTray();

            // Handle close request: Minimize to tray or close completely
            stage.setOnCloseRequest(this::handleCloseRequest);

            // Add listener to notification client for new unread notifications
            notificationClient.getUnreadNotifications().addListener((javafx.collections.ListChangeListener<WebSocketNotificationDto>) change -> {
                while (change.next()) {
                    if (change.wasAdded()) {
                        for (WebSocketNotificationDto newNotification : change.getAddedSubList()) {
                            // Only show tray notification if the primary stage is hidden
                            if (!primaryStage.isShowing() && trayIcon != null) {
                                Platform.runLater(() -> {
                                    trayIcon.displayMessage(
                                            newNotification.getTitle(),
                                            newNotification.getMessage(),
                                            TrayIcon.MessageType.INFO
                                    );
                                    LOGGER.info("Displayed tray notification for: {}", newNotification.getTitle());
                                });
                            }

                            // --- NEW: Inform the MainController about the new notification ---
                            // MainController should then decide how to handle it (e.g., if NotificationPage is open)
                            if (mainController != null) {
                                mainController.handleNewWebSocketNotification(newNotification);
                            }
                        }
                    }
                }
            });
        } catch (IOException e) {
            LOGGER.error("Failed to load main FXML file: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            LOGGER.error("Unexpected error during application startup: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void setupSystemTray() {
        if (!SystemTray.isSupported()) {
            LOGGER.warn("System Tray is not supported on this platform.");
            return;
        }

        SystemTray tray = SystemTray.getSystemTray();
        java.awt.Image image = Toolkit.getDefaultToolkit().getImage(getClass().getResource("/static/images/ucc-logo.png"));

        PopupMenu popup = new PopupMenu();
        MenuItem showItem = new MenuItem("Show Window");
        MenuItem notificationsItem = new MenuItem("View Notifications"); // New menu item
        MenuItem exitItem = new MenuItem("Exit");

        showItem.addActionListener(e -> Platform.runLater(() -> {
            primaryStage.show();
            primaryStage.toFront();
        }));

        // Action for the new "View Notifications" menu item
        notificationsItem.addActionListener(e -> Platform.runLater(() -> {
            primaryStage.show();
            primaryStage.toFront();
            if (mainController != null) {
                mainController.loadView(CommonPages.NOTIFICATION);
                mainController.updateSidebarSelection(CommonPages.NOTIFICATION); // Ensure sidebar is updated
            }
        }));

        exitItem.addActionListener(e -> {
            Platform.exit();
            tray.remove(trayIcon);
            if (notificationClient != null) {
                notificationClient.disconnect();
            }
            System.exit(0);
        });

        popup.add(showItem);
        popup.add(notificationsItem); // Add the new menu item
        popup.addSeparator();
        popup.add(exitItem);

        trayIcon = new TrayIcon(image, "Inventory Management", popup);
        trayIcon.setImageAutoSize(true);

        // Action listener for single-click (or double-click) on the tray icon itself
        // This will now default to showing the window and navigating to notifications page
        trayIcon.addActionListener(e -> {
            // For a single click (or a mouse release event)
            if (e.getID() == java.awt.event.MouseEvent.MOUSE_RELEASED || e.getID() == java.awt.event.ActionEvent.ACTION_PERFORMED) {
                Platform.runLater(() -> {
                    primaryStage.show();
                    primaryStage.toFront();
                    if (mainController != null) {
                        mainController.loadView(CommonPages.NOTIFICATION);
                        mainController.updateSidebarSelection(CommonPages.NOTIFICATION);
                    }
                });
            }
        });

        try {
            tray.add(trayIcon);
            LOGGER.info("Application added to System Tray.");
        } catch (AWTException e) {
            LOGGER.error("Unable to add application to System Tray: {}", e.getMessage(), e);
        }
    }

    private void handleCloseRequest(WindowEvent event) {
        UserSession session = UserSession.getInstance();
        Optional<CloseAppDialogUtil.CloseAction> result = CloseAppDialogUtil.showCloseConfirmation(session.isAuthenticated());

        result.ifPresent(action -> {
            switch (action) {
                case LOGOUT:
                    LOGGER.info("User chose to logout before closing");
                    authService.logout();
                    if (notificationClient != null) {
                        notificationClient.disconnect();
                    }
                    Platform.exit();
                    if (trayIcon != null) SystemTray.getSystemTray().remove(trayIcon);
                    System.exit(0);
                    break;
                case CLOSE:
                    LOGGER.info("User chose to minimize to tray");
                    primaryStage.hide();
                    event.consume();
                    break;
                case CANCEL:
                    LOGGER.info("User cancelled close operation");
                    event.consume();
                    break;
            }
        });
    }

    @Override
    public void stop() throws Exception {
        LOGGER.info("Inventory Management Application is stopping.");
        if (notificationClient != null) {
            notificationClient.disconnect(); // Ensure WebSocket is disconnected on app exit
        }
        if (trayIcon != null) {
            SystemTray.getSystemTray().remove(trayIcon); // Clean up tray icon
        }
        super.stop();
    }

    public static void main(String[] args) {
        LOGGER.info("Inventory Management Application starting up");
        try {
            GraphicsEnvironment.getLocalGraphicsEnvironment();
        } catch (Exception e) {
            LOGGER.error("AWT initialization failed: {}", e.getMessage());
        }

        launch();
    }
}