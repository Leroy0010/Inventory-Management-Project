package com.leroy.inventorymanagementfx.controller.storekeeper; // Changed package name to match FXML

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.dto.response.InventoryItemDto; // New import
import com.leroy.inventorymanagementfx.dto.report.TransactionReportDto;
import com.leroy.inventorymanagementfx.dto.report.TransactionReportRequest;
import com.leroy.inventorymanagementfx.enums.StockTransactionType;
import com.leroy.inventorymanagementfx.service.storekeeper.InventoryItemService;
import com.leroy.inventorymanagementfx.service.storekeeper.TransactionReportService;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.util.StringConverter; // New import
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class TransactionReportController {

    @FXML
    private ComboBox<InventoryItemDto> itemComboBox; // Changed from TextField
    @FXML
    private ComboBox<Integer> yearComboBox;
    @FXML
    private ComboBox<String> monthComboBox;
    @FXML
    private ComboBox<StockTransactionType> transactionTypeComboBox;
    @FXML
    private DatePicker startDatePicker;
    @FXML
    private DatePicker endDatePicker;
    @FXML
    private TableView<TransactionReportDto> transactionReportTable;
    @FXML
    private TableColumn<TransactionReportDto, Integer> itemIdColumn;
    @FXML
    private TableColumn<TransactionReportDto, String> itemNameColumn;
    @FXML
    private TableColumn<TransactionReportDto, String> unitOfMeasurementColumn;
    @FXML
    private TableColumn<TransactionReportDto, Integer> totalReceivedColumn;
    @FXML
    private TableColumn<TransactionReportDto, Integer> totalIssuedColumn;
    @FXML
    private TableColumn<TransactionReportDto, Integer> netChangeColumn;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final InventoryItemService inventoryItemService = new InventoryItemService();
    private final TransactionReportService transactionReportService = new TransactionReportService();
    private final Logger logger = LogManager.getLogger(TransactionReportController.class);

    public void initialize() {
        // Initialize ComboBoxes
        populateYearComboBox();
        populateMonthComboBox();
        populateTransactionTypeComboBox();
        populateItemComboBox(); // New method to populate item ComboBox

        // Set up table columns
        itemIdColumn.setCellValueFactory(new PropertyValueFactory<>("itemId"));
        itemNameColumn.setCellValueFactory(new PropertyValueFactory<>("itemName"));
        unitOfMeasurementColumn.setCellValueFactory(new PropertyValueFactory<>("unitOfMeasurement"));
        totalReceivedColumn.setCellValueFactory(new PropertyValueFactory<>("totalReceived"));
        totalIssuedColumn.setCellValueFactory(new PropertyValueFactory<>("totalIssued"));
        netChangeColumn.setCellValueFactory(new PropertyValueFactory<>("netChange"));

        // Load initial data
//        loadTransactionReportData(null);
    }

    /**
     * Populates the item combo box with inventory item names and IDs from the backend.
     */
    private void populateItemComboBox() {
        inventoryItemService.getInventoryItemsNamesAndIdsByDepartment()
                .thenAccept(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            List<InventoryItemDto> items = objectMapper.readValue(response.body(), new TypeReference<>() {
                            });
                            Platform.runLater(() -> {
                                itemComboBox.setItems(FXCollections.observableArrayList(items));
                                itemComboBox.setConverter(new StringConverter<>() {
                                    @Override
                                    public String toString(InventoryItemDto item) {
                                        return item != null ? item.getName() : "";
                                    }

                                    @Override
                                    public InventoryItemDto fromString(String string) {
                                        // This method is used when the user types into the ComboBox.
                                        // For now, we'll just return null or find an exact match if implemented.
                                        // For a simple dropdown, this might not be strictly necessary if not editable.
                                        return itemComboBox.getItems().stream()
                                                .filter(item -> item.getName().equals(string))
                                                .findFirst()
                                                .orElse(null);
                                    }
                                });
                            });
                        } catch (JsonProcessingException e) {
                            logger.error("Error parsing inventory items: " + e.getMessage(), e);
                            Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to parse inventory items."));
                        }
                    } else {
                        logger.error("Failed to fetch inventory items. Status: " + response.statusCode() + ", Body: " + response.body());
                        Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to fetch inventory items."));
                    }
                })
                .exceptionally(e -> {
                    logger.error("Exception while fetching inventory items: " + e.getMessage(), e);
                    Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Network error fetching inventory items."));
                    return null;
                });
    }

    /**
     * Populates the year combo box with a range of years.
     */
    private void populateYearComboBox() {
        int currentYear = LocalDate.now().getYear();
        List<Integer> years = IntStream.rangeClosed(currentYear - 5, currentYear + 1)
                .boxed()
                .collect(Collectors.toList());
        yearComboBox.setItems(FXCollections.observableArrayList(years));
    }

    /**
     * Populates the month combo box with month names.
     */
    private void populateMonthComboBox() {
        List<String> months = Arrays.asList(
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
        );
        monthComboBox.setItems(FXCollections.observableArrayList(months));
    }

    /**
     * Populates the transaction type combo box with enum values.
     */
    private void populateTransactionTypeComboBox() {
        transactionTypeComboBox.setItems(FXCollections.observableArrayList(StockTransactionType.values()));
    }

    /**
     * Handles the "Apply Filters" button action.
     * Constructs a request object and loads data based on filters.
     */
    @FXML
    private void handleApplyFilters() {
        TransactionReportRequest request = new TransactionReportRequest();

        // Item ID from ComboBox
        InventoryItemDto selectedItem = itemComboBox.getValue();
        if (selectedItem != null) {
            request.setItemId(selectedItem.getId());
        }

        // Year
        request.setYear(yearComboBox.getValue());

        // Month (convert month name to 1-based integer)
        String selectedMonthName = monthComboBox.getValue();
        if (selectedMonthName != null) {
            request.setMonth(getMonthNumber(selectedMonthName));
        }

        // Transaction Type
        request.setTransactionType(transactionTypeComboBox.getValue());

        // Start and End Dates
        request.setStartDate(startDatePicker.getValue());
        request.setEndDate(endDatePicker.getValue());

        loadTransactionReportData(request);
    }

    /**
     * Converts month name to its 1-based integer representation.
     */
    private Integer getMonthNumber(String monthName) {
        return switch (monthName) {
            case "January" -> 1;
            case "February" -> 2;
            case "March" -> 3;
            case "April" -> 4;
            case "May" -> 5;
            case "June" -> 6;
            case "July" -> 7;
            case "August" -> 8;
            case "September" -> 9;
            case "October" -> 10;
            case "November" -> 11;
            case "December" -> 12;
            default -> null;
        };
    }

    /**
     * Handles the "Clear Filters" button action.
     * Clears all filter inputs and reloads data without filters.
     */
    @FXML
    private void handleClearFilters() {
        itemComboBox.getSelectionModel().clearSelection(); // Clear item ComboBox
        yearComboBox.getSelectionModel().clearSelection();
        monthComboBox.getSelectionModel().clearSelection();
        transactionTypeComboBox.getSelectionModel().clearSelection();
        startDatePicker.setValue(null);
        endDatePicker.setValue(null);
        loadTransactionReportData(null); // Load all data
    }

    /**
     * Loads transaction report data into the TableView by making an API call.
     *
     * @param request The filter request, or null for no filters.
     */
    private void loadTransactionReportData(TransactionReportRequest request) {
        try {
            transactionReportService.getReport(
                            request != null ? request.getItemId() : null,
                            request != null ? request.getYear() : null,
                            request != null ? request.getMonth() : null,
                            request != null ? request.getTransactionType() : null,
                            request != null ? request.getStartDate() : null,
                            request != null ? request.getEndDate() : null
                    )
                    .thenAccept(response -> {
                        if (response.statusCode() == 200) {
                            try {
                                List<TransactionReportDto> data = objectMapper.readValue(response.body(), new TypeReference<>() {
                                });
                                Platform.runLater(() -> transactionReportTable.setItems(FXCollections.observableArrayList(data)));
                            } catch (JsonProcessingException e) {
                                logger.error("Error parsing transaction report: " + e.getMessage(), e);
                                Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to parse transaction report data."));
                            }
                        } else {
                            logger.error("Failed to fetch transaction report. Status: " + response.statusCode() + ", Body: " + response.body());
                            Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to fetch transaction report."));
                        }
                    })
                    .exceptionally(e -> {
                        logger.error("Exception while fetching transaction report: " + e.getMessage(), e);
                        Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Network error fetching transaction report."));
                        return null;
                    });
        } catch (JsonProcessingException e) {
            logger.error("Error creating JSON request for transaction report: " + e.getMessage(), e);
            showAlert(Alert.AlertType.ERROR, "Error", "Failed to create report request.");
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
        alert.showAndWait();
    }
}