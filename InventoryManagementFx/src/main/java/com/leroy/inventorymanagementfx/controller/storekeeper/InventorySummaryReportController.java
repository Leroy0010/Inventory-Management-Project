package com.leroy.inventorymanagementfx.controller.storekeeper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.dto.report.InventorySummaryItemDto;
import com.leroy.inventorymanagementfx.dto.report.InventorySummaryReportRequest;
import com.leroy.inventorymanagementfx.enums.CostFlowMethod;
import com.leroy.inventorymanagementfx.enums.InventorySummaryType;
import com.leroy.inventorymanagementfx.service.storekeeper.InventorySummaryReportService;
import javafx.application.Platform;
import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.util.Callback;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class InventorySummaryReportController {

    @FXML
    private ComboBox<InventorySummaryType> reportTypeComboBox;
    @FXML
    private ComboBox<CostFlowMethod> costFlowMethodComboBox;
    @FXML
    private ComboBox<Integer> yearComboBox;
    @FXML
    private DatePicker startDatePicker;
    @FXML
    private DatePicker endDatePicker;
    @FXML
    private TableView<InventorySummaryItemDto> inventorySummaryTable;
    @FXML
    private TableColumn<InventorySummaryItemDto, Integer> numberingColumn;
    @FXML
    private TableColumn<InventorySummaryItemDto, Integer> inventoryIdColumn;
    @FXML
    private TableColumn<InventorySummaryItemDto, String> inventoryNameColumn;
    @FXML
    private TableColumn<InventorySummaryItemDto, String> unitColumn;
    @FXML
    private TableColumn<InventorySummaryItemDto, Object> broughtForwardColumn; // Object to handle both Integer and BigDecimal
    @FXML
    private TableColumn<InventorySummaryItemDto, Object> receivedColumn;       // Object to handle both Integer and BigDecimal
    @FXML
    private TableColumn<InventorySummaryItemDto, Object> issuedColumn;         // Object to handle both Integer and BigDecimal
    @FXML
    private TableColumn<InventorySummaryItemDto, Object> carriedForwardColumn; // Object to handle both Integer and BigDecimal

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final InventorySummaryReportService reportService = new InventorySummaryReportService();
    private final Logger logger = LogManager.getLogger(InventorySummaryReportController.class);

    public void initialize() {
        // Initialize ComboBoxes
        populateReportTypeComboBox();
        populateCostFlowMethodComboBox();
        populateYearComboBox();

        // Set up table columns
        setupTableColumns();

        // Add listener to reportTypeComboBox to toggle visibility of costFlowMethodComboBox
        reportTypeComboBox.valueProperty().addListener((obs, oldVal, newVal) -> {
            boolean isValueReport = (newVal == InventorySummaryType.BY_VALUE);
            costFlowMethodComboBox.setVisible(isValueReport);
            costFlowMethodComboBox.setManaged(isValueReport); // Also manage its layout space
            updateColumnHeaders(newVal); // Update headers when report type changes
        });

        // Set initial column headers based on default report type (BY_QUANTITY)
        updateColumnHeaders(reportTypeComboBox.getValue());

        // Load initial data (optional, might want to wait for user to apply filters)
        // loadInventorySummaryReportData(null);
    }

    /**
     * Populates the report type combo box.
     */
    private void populateReportTypeComboBox() {
        reportTypeComboBox.setItems(FXCollections.observableArrayList(InventorySummaryType.values()));
        reportTypeComboBox.getSelectionModel().select(InventorySummaryType.BY_QUANTITY); // Default to Quantity
    }

    /**
     * Populates the cost flow method combo box.
     */
    private void populateCostFlowMethodComboBox() {
        costFlowMethodComboBox.setItems(FXCollections.observableArrayList(CostFlowMethod.values()));
        costFlowMethodComboBox.getSelectionModel().selectFirst(); // Select first by default
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
     * Sets up the table columns and their cell value factories.
     */
    private void setupTableColumns() {
        // Numbering column (1, 2, 3, ...)
        numberingColumn.setCellValueFactory(cellData ->
                new ReadOnlyObjectWrapper<>(inventorySummaryTable.getItems().indexOf(cellData.getValue()) + 1));
        numberingColumn.setCellFactory(new Callback<>() {
            @Override
            public TableCell<InventorySummaryItemDto, Integer> call(TableColumn<InventorySummaryItemDto, Integer> param) {
                return new TableCell<InventorySummaryItemDto, Integer>() {
                    @Override
                    protected void updateItem(Integer item, boolean empty) {
                        super.updateItem(item, empty);
                        if (empty) {
                            setText(null);
                        } else {
                            setText(String.valueOf(getIndex() + 1));
                        }
                    }
                };
            }
        });
        numberingColumn.setSortable(false); // Numbering column should not be sortable

        inventoryIdColumn.setCellValueFactory(new PropertyValueFactory<>("inventoryId"));
        inventoryNameColumn.setCellValueFactory(new PropertyValueFactory<>("inventoryName"));
        unitColumn.setCellValueFactory(new PropertyValueFactory<>("unit"));

        // Dynamic cell value factories for quantity/value columns
        broughtForwardColumn.setCellValueFactory(cellData -> {
            InventorySummaryItemDto item = cellData.getValue();
            return new ReadOnlyObjectWrapper<>(
                    reportTypeComboBox.getValue() == InventorySummaryType.BY_QUANTITY ?
                            item.getQuantityBroughtForward() : item.getValueBroughtForward()
            );
        });
        receivedColumn.setCellValueFactory(cellData -> {
            InventorySummaryItemDto item = cellData.getValue();
            return new ReadOnlyObjectWrapper<>(
                    reportTypeComboBox.getValue() == InventorySummaryType.BY_QUANTITY ?
                            item.getQuantityReceived() : item.getValueReceived()
            );
        });
        issuedColumn.setCellValueFactory(cellData -> {
            InventorySummaryItemDto item = cellData.getValue();
            return new ReadOnlyObjectWrapper<>(
                    reportTypeComboBox.getValue() == InventorySummaryType.BY_QUANTITY ?
                            item.getQuantityIssued() : item.getValueIssued()
            );
        });
        carriedForwardColumn.setCellValueFactory(cellData -> {
            InventorySummaryItemDto item = cellData.getValue();
            return new ReadOnlyObjectWrapper<>(
                    reportTypeComboBox.getValue() == InventorySummaryType.BY_QUANTITY ?
                            item.getQuantityCarriedForward() : item.getValueCarriedForward()
            );
        });

        // Set custom cell factory for BigDecimal columns to format them as currency (if needed)
        // This will apply to all Object columns, so we need to check the type inside
        Callback<TableColumn<InventorySummaryItemDto, Object>, TableCell<InventorySummaryItemDto, Object>> currencyCellFactory =
                new Callback<TableColumn<InventorySummaryItemDto, Object>, TableCell<InventorySummaryItemDto, Object>>() {
                    @Override
                    public TableCell<InventorySummaryItemDto, Object> call(TableColumn<InventorySummaryItemDto, Object> param) {
                        return new TableCell<InventorySummaryItemDto, Object>() {
                            @Override
                            protected void updateItem(Object item, boolean empty) {
                                super.updateItem(item, empty);
                                if (empty || item == null) {
                                    setText(null);
                                } else {
                                    if (item instanceof BigDecimal) {
                                        // Format as currency, e.g., "$1,234.56"
                                        setText(String.format("$%.2f", (BigDecimal) item));
                                    } else {
                                        setText(String.valueOf(item));
                                    }
                                }
                            }
                        };
                    }
                };

        broughtForwardColumn.setCellFactory(currencyCellFactory);
        receivedColumn.setCellFactory(currencyCellFactory);
        issuedColumn.setCellFactory(currencyCellFactory);
        carriedForwardColumn.setCellFactory(currencyCellFactory);
    }

    /**
     * Updates the header text of the quantity/value columns based on the selected report type.
     * @param reportType The selected InventorySummaryType.
     */
    private void updateColumnHeaders(InventorySummaryType reportType) {
        if (reportType == InventorySummaryType.BY_QUANTITY) {
            broughtForwardColumn.setText("Qty B/F");
            receivedColumn.setText("Qty Received");
            issuedColumn.setText("Qty Issued");
            carriedForwardColumn.setText("Balance C/F");
        } else if (reportType == InventorySummaryType.BY_VALUE) {
            broughtForwardColumn.setText("Value B/F");
            receivedColumn.setText("Value Received");
            issuedColumn.setText("Value Issued");
            carriedForwardColumn.setText("Balance C/F");
        }
        // Force table refresh to apply new column headers and cell values
        inventorySummaryTable.getColumns().forEach(column -> column.setVisible(false));
        inventorySummaryTable.getColumns().forEach(column -> column.setVisible(true));
    }

    /**
     * Handles the "Generate Report" button action.
     * Constructs a request object and loads data based on filters.
     */
    @FXML
    private void handleApplyFilters() {
        InventorySummaryReportRequest request = new InventorySummaryReportRequest();

        // Report Type (Required)
        InventorySummaryType selectedReportType = reportTypeComboBox.getValue();
        if (selectedReportType == null) {
            showAlert(Alert.AlertType.WARNING, "Missing Selection", "Please select a Report Type (Quantity or Value).");
            return;
        }
        request.setInventorySummaryType(selectedReportType);

        // Cost Flow Method (Required if Report Type is BY_VALUE)
        if (selectedReportType == InventorySummaryType.BY_VALUE) {
            CostFlowMethod selectedCostFlowMethod = costFlowMethodComboBox.getValue();
            if (selectedCostFlowMethod == null) {
                showAlert(Alert.AlertType.WARNING, "Missing Selection", "Please select a Cost Flow Method for Value reports.");
                return;
            }
            request.setCostFlowMethod(selectedCostFlowMethod);
        }

        // Date Filters
        Integer selectedYear = yearComboBox.getValue();
        LocalDate selectedStartDate = startDatePicker.getValue();
        LocalDate selectedEndDate = endDatePicker.getValue();

        // Prioritize single year if selected
        if (selectedYear != null) {
            request.setYear(selectedYear);
            request.setStartYear(null);
            request.setEndYear(null);
            request.setStartDate(null);
            request.setEndDate(null);
        } else if (selectedStartDate != null && selectedEndDate != null) {
            // Use date range if year is not selected and both dates are present
            request.setStartDate(selectedStartDate);
            request.setEndDate(selectedEndDate);
            request.setYear(null);
            request.setStartYear(null);
            request.setEndYear(null);
        } else if (selectedStartDate != null || selectedEndDate != null) {
            showAlert(Alert.AlertType.WARNING, "Incomplete Date Range", "Please select both Start Date and End Date for a date range filter.");
            return;
        }
        // If no date filters are selected, backend should default to a reasonable period (e.g., current year)

        loadInventorySummaryReportData(request);
    }

    /**
     * Handles the "Clear Filters" button action.
     * Clears all filter inputs and reloads data without filters (or with default filters).
     */
    @FXML
    private void handleClearFilters() {
        reportTypeComboBox.getSelectionModel().select(InventorySummaryType.BY_QUANTITY); // Reset to default
        costFlowMethodComboBox.getSelectionModel().clearSelection();
        yearComboBox.getSelectionModel().clearSelection();
        startDatePicker.setValue(null);
        endDatePicker.setValue(null);
        loadInventorySummaryReportData(null); // Load data with no filters
    }

    /**
     * Loads inventory summary report data into the TableView by making an API call.
     *
     * @param request The filter request, or null for no filters.
     */
    private void loadInventorySummaryReportData(InventorySummaryReportRequest request) {
        reportService.generateSummaryReport(request)
                .thenAccept(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            List<InventorySummaryItemDto> data = objectMapper.readValue(response.body(), new TypeReference<List<InventorySummaryItemDto>>() {});
                            Platform.runLater(() -> inventorySummaryTable.setItems(FXCollections.observableArrayList(data)));
                        } catch (JsonProcessingException e) {
                            logger.error("Error parsing inventory summary report: " + e.getMessage(), e);
                            Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to parse inventory summary report data."));
                        }
                    } else {
                        logger.error("Failed to fetch inventory summary report. Status: " + response.statusCode() + ", Body: " + response.body());
                        Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to fetch inventory summary report."));
                    }
                })
                .exceptionally(e -> {
                    logger.error("Exception while fetching inventory summary report: " + e.getMessage(), e);
                    Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Network error fetching inventory summary report."));
                    return null;
                });
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
