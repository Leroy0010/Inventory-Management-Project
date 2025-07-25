package com.leroy.inventorymanagementfx.controller.storekeeper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.dto.dashboard.InventorySummaryDto;
import com.leroy.inventorymanagementfx.service.dashboard.DashboardService;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Alert; // Added import for Alert
import javafx.scene.control.Label;

import javafx.stage.Modality;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Controller for the Storekeeper dashboard content view.
 * Handles display of summary information specific to the Storekeeper role.
 */
public class DashboardController {

    // Labels for Inventory Summary Cards
    @FXML
    private Label totalItemsInStockLabel;
    @FXML
    private Label itemsBelowReorderLevelLabel;
    @FXML
    private Label issuedTodayLabel;
    @FXML
    private Label issuedThisMonthLabel;
    @FXML
    private Label receivedTodayLabel;
    @FXML
    private Label receivedThisMonthLabel;
    @FXML
    private Label totalStaffInDepartmentLabel; // New Label
    @FXML
    private Label totalOfficesInDepartmentLabel; // New Label

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DashboardService dashboardService = new DashboardService();
    private final Logger logger = LogManager.getLogger(DashboardController.class);

    public void initialize() {
        // Load dashboard summary data
        loadInventorySummary();
    }

    /**
     * Loads inventory summary data from the backend and updates the dashboard cards.
     */
    private void loadInventorySummary() {
        dashboardService.getInventorySummary()
                .thenAccept(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            InventorySummaryDto summary = objectMapper.readValue(response.body(), InventorySummaryDto.class);
                            Platform.runLater(() -> updateSummaryCards(summary));
                        } catch (Exception e) {
                            logger.error("Error parsing inventory summary: " + e.getMessage(), e);
                            Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to parse inventory summary data."));
                        }
                    } else {
                        logger.error("Failed to fetch inventory summary. Status: " + response.statusCode() + ", Body: " + response.body());
                        Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to fetch inventory summary."));
                    }
                })
                .exceptionally(e -> {
                    logger.error("Exception while fetching inventory summary: " + e.getMessage(), e);
                    Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Network error fetching inventory summary."));
                    return null;
                });
    }

    /**
     * Updates the UI labels with the fetched inventory summary data.
     * @param summary The InventorySummaryDto containing the data.
     */
    private void updateSummaryCards(InventorySummaryDto summary) {
        totalItemsInStockLabel.setText(String.valueOf(summary.getTotalItemsInStock()));
        itemsBelowReorderLevelLabel.setText(String.valueOf(summary.getItemsBelowReorderLevel()));
        issuedTodayLabel.setText(String.valueOf(summary.getIssuedToday()));
        issuedThisMonthLabel.setText(String.valueOf(summary.getIssuedThisMonth()));
        receivedTodayLabel.setText(String.valueOf(summary.getReceivedToday()));
        receivedThisMonthLabel.setText(String.valueOf(summary.getReceivedThisMonth()));
        totalStaffInDepartmentLabel.setText(String.valueOf(summary.getTotalStaffInDepartment())); // Set new label
        totalOfficesInDepartmentLabel.setText(String.valueOf(summary.getTotalOfficesInDepartment())); // Set new label

        // Optionally add specific styles for low stock if it's critical
        if (summary.getItemsBelowReorderLevel() > 0) {
            itemsBelowReorderLevelLabel.getParent().getStyleClass().add("low-stock");
        } else {
            itemsBelowReorderLevelLabel.getParent().getStyleClass().remove("low-stock");
        }
    }

    /**
     * Shows an alert dialog.
     * @param alertType The type of alert.
     * @param title The title of the alert.
     * @param message The message content of the alert.
     */
    private void showAlert(Alert.AlertType alertType, String title, String message) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.initOwner(itemsBelowReorderLevelLabel.getScene().getWindow());
        alert.initModality(Modality.WINDOW_MODAL);
        alert.showAndWait();
    }
}
