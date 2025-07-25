package com.leroy.inventorymanagementfx.controller.storekeeper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.dto.report.UserReportItemDto;
import com.leroy.inventorymanagementfx.dto.report.UserReportRequest;
import com.leroy.inventorymanagementfx.dto.response.UserEmailAndIdDto;
import com.leroy.inventorymanagementfx.service.storekeeper.UserReportService; // New service
import com.leroy.inventorymanagementfx.service.admin.UserService; // Assuming a UserService exists
import javafx.application.Platform;
import javafx.beans.property.ReadOnlyObjectWrapper;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.util.Callback;
import javafx.util.StringConverter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class UserReportController {

    @FXML
    private ComboBox<UserEmailAndIdDto> userComboBox; // ComboBox for user selection
    @FXML
    private ComboBox<Integer> yearComboBox;
    @FXML
    private TableView<UserReportItemDto> userReportTable;
    @FXML
    private TableColumn<UserReportItemDto, Integer> numberingColumn;
    @FXML
    private TableColumn<UserReportItemDto, Integer> inventoryIdColumn;
    @FXML
    private TableColumn<UserReportItemDto, String> inventoryNameColumn;
    @FXML
    private TableColumn<UserReportItemDto, String> unitColumn;
    @FXML
    private TableColumn<UserReportItemDto, Integer> quantityReceivedColumn;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserReportService userReportService = new UserReportService();
    private final UserService userService = new UserService(); // Assuming this service exists
    private final Logger logger = LogManager.getLogger(UserReportController.class);

    public void initialize() {
        // Initialize ComboBoxes
        populateYearComboBox();
        populateUserComboBox(); // Populate user ComboBox

        // Set up table columns
        setupTableColumns();

        // Load initial data
//        try {
//            loadUserReportData(null);
//        } catch (JsonProcessingException e) {
//            throw new RuntimeException(e);
//        }
    }

    /**
     * Sets up the table columns and their cell value factories.
     */
    private void setupTableColumns() {
        // Numbering column (1, 2, 3, ...)
        numberingColumn.setCellValueFactory(cellData ->
                new ReadOnlyObjectWrapper<>(userReportTable.getItems().indexOf(cellData.getValue()) + 1));
        numberingColumn.setCellFactory(new Callback<>() {
            @Override
            public TableCell<UserReportItemDto, Integer> call(TableColumn<UserReportItemDto, Integer> param) {
                return new TableCell<>() {
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

        inventoryIdColumn.setCellValueFactory(new PropertyValueFactory<>("inventoryCode"));
        inventoryNameColumn.setCellValueFactory(new PropertyValueFactory<>("inventoryName"));
        unitColumn.setCellValueFactory(new PropertyValueFactory<>("unit"));
        quantityReceivedColumn.setCellValueFactory(new PropertyValueFactory<>("quantityReceived"));

        // Set dynamic text for Quantity Received column based on selected year
        updateQuantityReceivedColumnHeader(null); // Initial update
    }

    /**
     * Populates the user combo box with the user names and IDs from the backend.
     */
    private void populateUserComboBox() {
        userService.getUsersEmailsAndIds() // Assuming this method exists in UserService
                .thenAccept(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            List<UserEmailAndIdDto> users = objectMapper.readValue(response.body(), new TypeReference<>() {
                            });
                            Platform.runLater(() -> {
                                userComboBox.setItems(FXCollections.observableArrayList(users));
                                userComboBox.setConverter(new StringConverter<>() {
                                    @Override
                                    public String toString(UserEmailAndIdDto user) {
                                        return user != null ? user.getEmail() : "";
                                    }

                                    @Override
                                    public UserEmailAndIdDto fromString(String string) {
                                        // This method is used when the user types into the ComboBox.
                                        // For now, we'll just find an exact match if implemented.
                                        return userComboBox.getItems().stream()
                                                .filter(user -> user.getEmail().equals(string))
                                                .findFirst()
                                                .orElse(null);
                                    }
                                });
                            });
                        } catch (JsonProcessingException e) {
                            logger.error("Error parsing user items: {}", e.getMessage(), e);
                            Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to parse user data."));
                        }
                    } else {
                        logger.error("Failed to fetch user items. Status: {}, Body: {}", response.statusCode(), response.body());
                        Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to fetch user data."));
                    }
                })
                .exceptionally(e -> {
                    logger.error("Exception while fetching user items: {}", e.getMessage(), e);
                    Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Network error fetching user data."));
                    return null;
                });
    }

    /**
     * Populates the year combo box with a range of years.
     */
    private void populateYearComboBox() {
        int currentYear = LocalDate.now().getYear();
        List<Integer> years = IntStream.rangeClosed(currentYear - 7, currentYear + 1)
                .boxed()
                .collect(Collectors.toList());
        yearComboBox.setItems(FXCollections.observableArrayList(years));

        // Listener to update column header when year changes
        yearComboBox.valueProperty().addListener((obs, oldVal, newVal) -> updateQuantityReceivedColumnHeader(newVal));
    }

    /**
     * Updates the header text of the "Quantity Received" column based on the selected year.
     * @param year The selected year, or null if no year is selected.
     */
    private void updateQuantityReceivedColumnHeader(Integer year) {
        if (year != null) {
            quantityReceivedColumn.setText("Quantity Received in " + year);
        } else {
            quantityReceivedColumn.setText("Quantity Received");
        }
    }

    /**
     * Handles the "Apply Filters" button action.
     * Constructs a request object and loads data based on filters.
     */
    @FXML
    private void handleApplyFilters() {
        UserReportRequest request = new UserReportRequest();

        // User ID from ComboBox
        UserEmailAndIdDto selectedUser = userComboBox.getValue();
        if (selectedUser != null) {
            request.setUserId(selectedUser.getId());
        }

        // Year
        request.setYear(yearComboBox.getValue());

        try {
            loadUserReportData(request);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Handles the "Clear Filters" button action.
     * Clears all filter inputs and reloads data without filters.
     */
    @FXML
    private void handleClearFilters() {
        userComboBox.getSelectionModel().clearSelection();
        yearComboBox.getSelectionModel().clearSelection();
        try {
            loadUserReportData(null); // Load all data
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Loads user report data into the TableView by making an API call.
     *
     * @param request The filter request, or null for no filters.
     */
    private void loadUserReportData(UserReportRequest request) throws JsonProcessingException {
        Integer userId = (request != null) ? request.getUserId() : null;
        Integer year = (request != null) ? request.getYear() : null;

        userReportService.getUserReport(userId, year)
                .thenAccept(response -> {
                    if (response.statusCode() == 200) {
                        try {
                            List<UserReportItemDto> data = objectMapper.readValue(response.body(), new TypeReference<>() {
                            });
                            Platform.runLater(() -> userReportTable.setItems(FXCollections.observableArrayList(data)));
                        } catch (JsonProcessingException e) {
                            logger.error("Error parsing user report: {}", e.getMessage(), e);
                            Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to parse user report data."));
                        }
                    } else {
                        logger.error("Failed to fetch user report. Status: {}, Body: {}", response.statusCode(), response.body());
                        Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to fetch user report."));
                    }
                })
                .exceptionally(e -> {
                    logger.error("Exception while fetching user report: {}", e.getMessage(), e);
                    Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Network error fetching user report."));
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
