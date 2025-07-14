package com.leroy.inventorymanagementfx.controller.storekeeper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.leroy.inventorymanagementfx.controller.MainController;
import com.leroy.inventorymanagementfx.dto.request.ApproveRequestDto; // Only ApproveRequestDto needed now
import com.leroy.inventorymanagementfx.dto.response.RequestResponseDto;
import com.leroy.inventorymanagementfx.dto.response.User;
import com.leroy.inventorymanagementfx.enums.CommonPages;
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController;
import com.leroy.inventorymanagementfx.service.RequestService;
import javafx.application.Platform;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.HBox;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Timestamp;
// Keep for date formatting if needed elsewhere, not directly used in this snippet
// Keep for date formatting if needed elsewhere
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public class StorekeeperRequestsController implements NeedsMainController {

    private static final Logger logger = LogManager.getLogger(StorekeeperRequestsController.class);
    private MainController mainController;
    private final RequestService requestService = new RequestService();
    private final ObjectMapper objectMapper = new ObjectMapper();
    // private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("MMM dd,yyyy HH:mm").withZone(ZoneId.systemDefault()); // Not directly used in this part of code, removed for brevity if not needed

    // Observable lists for table data and filtering
    private ObservableList<RequestResponseDto> masterRequestData = FXCollections.observableArrayList();
    private FilteredList<RequestResponseDto> filteredRequestData;

    @FXML private TableView<RequestResponseDto> requestTable;
    @FXML private TableColumn<RequestResponseDto, Long> idColumn;
    @FXML private TableColumn<RequestResponseDto, String> submittedByColumn;
    @FXML private TableColumn<RequestResponseDto, Timestamp> submittedAtColumn;
    @FXML private TableColumn<RequestResponseDto, String> statusColumn;
    @FXML private TableColumn<RequestResponseDto, Integer> itemCountColumn;
    @FXML private TableColumn<RequestResponseDto, String> approverColumn;
    @FXML private TableColumn<RequestResponseDto, String> fulfillerColumn;
    @FXML private TableColumn<RequestResponseDto, Void> actionsColumn;

    @FXML private TextField searchField;
    @FXML private ComboBox<String> statusFilterComboBox;

    public StorekeeperRequestsController() {
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void setMainController(MainController mainController) {
        this.mainController = mainController;
        if (mainController != null) {
            loadRequests(); // Load data when the controller is set
        }
    }

    @FXML
    public void initialize() {
        // Initialize Table Columns
        idColumn.setCellValueFactory(new PropertyValueFactory<>("id"));
        submittedByColumn.setCellValueFactory(cellData -> {
            String submittedBy = (cellData.getValue().getUser_id() <= 0) ? "User ID: " + cellData.getValue().getUser_id() : "N/A";
            // If RequestResponseDto had a 'requester' User object:
            // User requester = cellData.getValue().getRequester();
            // String submittedBy = (requester != null) ? requester.getFullName() : "N/A";
            return new SimpleStringProperty(submittedBy);
        });
        submittedAtColumn.setCellValueFactory(new PropertyValueFactory<>("submittedAt"));
        statusColumn.setCellValueFactory(new PropertyValueFactory<>("status"));

        itemCountColumn.setCellValueFactory(cellData ->
                new SimpleIntegerProperty(cellData.getValue().getItems() != null ? cellData.getValue().getItems().size() : 0).asObject()
        );

        approverColumn.setCellValueFactory(cellData -> {
            User approver = cellData.getValue().getApprover();
            String approverName = (approver != null) ? approver.getFullName() : "N/A";
            return new SimpleStringProperty(approverName);
        });

        fulfillerColumn.setCellValueFactory(cellData -> {
            User fulfiller = cellData.getValue().getFulfiller();
            String fulfillerName = (fulfiller != null) ? fulfiller.getFullName() : "N/A";
            return new SimpleStringProperty(fulfillerName);
        });

        // Initialize FilteredList and SortedList
        filteredRequestData = new FilteredList<>(masterRequestData, p -> true); // Initially show all data
        SortedList<RequestResponseDto> sortedData = new SortedList<>(filteredRequestData);
        sortedData.comparatorProperty().bind(requestTable.comparatorProperty());
        requestTable.setItems(sortedData);
        requestTable.setPlaceholder(new Label("No requests found. Adjust filters or search criteria."));

        // Set up search field listener
        searchField.textProperty().addListener((observable, oldValue, newValue) -> filterRequests());

        // Set up status filter ComboBox
        statusFilterComboBox.setItems(FXCollections.observableArrayList(
                "All", "PENDING", "APPROVED", "FULFILLED", "REJECTED"
        ));
        statusFilterComboBox.setValue("All"); // Default selection
        statusFilterComboBox.valueProperty().addListener((observable, oldValue, newValue) -> filterRequests());

        // Set up Actions Column
        actionsColumn.setCellFactory(param -> new TableCell<>() {
            private final Button viewDetailsButton = new Button("View Details");
            private final Button approveButton = new Button("Approve");
            private final Button rejectButton = new Button("Reject");
            // Fulfill button removed from here, as it's for Staff now

            {
                viewDetailsButton.getStyleClass().add("table-action-button");
                approveButton.getStyleClass().addAll("table-action-button", "primary-button");
                rejectButton.getStyleClass().addAll("table-action-button", "danger-button");

                viewDetailsButton.managedProperty().bind(viewDetailsButton.visibleProperty());
                approveButton.managedProperty().bind(approveButton.visibleProperty());
                rejectButton.managedProperty().bind(rejectButton.visibleProperty());

                viewDetailsButton.setOnAction(event -> {
                    RequestResponseDto request = getTableView().getItems().get(getIndex());
                    if (request != null) {
                        logger.info("Storekeeper: View Details clicked for Request ID: {}", request.getId());
                        mainController.loadView(CommonPages.REQUEST_DETAILS, request.getId());
                    }
                });
                approveButton.setOnAction(event -> handleApproveReject(getTableView().getItems().get(getIndex()), "APPROVE"));
                rejectButton.setOnAction(event -> handleApproveReject(getTableView().getItems().get(getIndex()), "REJECT"));
            }

            @Override
            protected void updateItem(Void item, boolean empty) {
                super.updateItem(item, empty);
                if (empty) {
                    setGraphic(null);
                } else {
                    RequestResponseDto request = getTableView().getItems().get(getIndex());
                    HBox buttons = new HBox(5);
                    buttons.getChildren().add(viewDetailsButton);

                    if (request != null) {
                        // Logic to show/hide action buttons based on request status for Storekeeper
                        switch (request.getStatus()) {
                            case "PENDING":
                                approveButton.setVisible(true);
                                rejectButton.setVisible(true);
                                buttons.getChildren().addAll(approveButton, rejectButton);
                                break;
                            default: // APPROVED, FULFILLED, REJECTED - no approve/reject actions
                                approveButton.setVisible(false);
                                rejectButton.setVisible(false);
                                break;
                        }
                    } else {
                        // If request is null
                        approveButton.setVisible(false);
                        rejectButton.setVisible(false);
                    }
                    setGraphic(buttons);
                }
            }
        });
    }

    private void loadRequests() {
        requestService.getUserRequests()
                .thenAccept(response -> Platform.runLater(() -> {
                    for(var req : response)
                        System.out.println("Id: " + req.getId());
                    masterRequestData.setAll(response);
                    logger.info("Successfully loaded {} requests for storekeeper.", response.size());
                    filterRequests();
                }))
                .exceptionally(e -> {
                    logger.error("Exception while loading requests for storekeeper: {}", e.getMessage(), e);
                    Platform.runLater(() -> mainController.showErrorAlert("Network Error", "Could not load requests."));
                    return null;
                });
    }

    private void filterRequests() {
        String searchText = searchField.getText() != null ? searchField.getText().toLowerCase().trim() : "";
        String selectedStatus = statusFilterComboBox.getValue();

        filteredRequestData.setPredicate(request -> {
            boolean matchesSearch = true;
            boolean matchesStatus = true;

            // Status Filter
            if (selectedStatus != null && !"All".equals(selectedStatus)) {
                matchesStatus = request.getStatus().equalsIgnoreCase(selectedStatus);
            }

            // Search Filter
            if (!searchText.isEmpty()) {
                if (String.valueOf(request.getId()).contains(searchText)) {
                    matchesSearch = true;
                }
                else if (String.valueOf(request.getUser_id()).contains(searchText)) {
                    matchesSearch = true;
                }
                else if (request.getItems() != null && request.getItems().stream()
                        .anyMatch(item -> item.getName().toLowerCase().contains(searchText))) {
                    matchesSearch = true;
                }
                else {
                    matchesSearch = false;
                }
            }

            return matchesSearch && matchesStatus;
        });
    }

    @FXML
    private void handleClearFilters() {
        searchField.clear();
        statusFilterComboBox.setValue("All");
    }

    // Renamed from handleApproveRejectFulfill as it no longer handles fulfill
    private void handleApproveReject(RequestResponseDto request, String actionType) {
        if (request == null) return;

        Alert.AlertType alertType = Alert.AlertType.CONFIRMATION;
        String title;
        String headerText;
        String contentText;
        String successMessage;

        switch (actionType) {
            case "APPROVE":
                title = "Confirm Approval";
                headerText = "Approve Request " + request.getId() + "?";
                contentText = "Are you sure you want to approve this request?";
                successMessage = "Request Approved Successfully.";
                break;
            case "REJECT":
                title = "Confirm Rejection";
                headerText = "Reject Request " + request.getId() + "?";
                contentText = "Are you sure you want to reject this request?";
                successMessage = "Request Rejected Successfully.";
                break;
            // FULFILL case removed as per new role definitions
            default:
                return; // Should not happen
        }

        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(headerText);
        alert.setContentText(contentText);

        Optional<ButtonType> result = alert.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            logger.info("{} Request ID: {}", actionType, request.getId());
            CompletableFuture<RequestResponseDto> future = requestService.approveOrRejectRequest(
                    new ApproveRequestDto(request.getId(), actionType.equals("APPROVE") ? "APPROVED" : "REJECTED", actionType.equals("APPROVE")));

            final String finalSuccessMessage = successMessage;
            future.thenAccept(response -> Platform.runLater(() -> {
                        if (response != null) {
                            mainController.showInfoAlert("Success", finalSuccessMessage);
                            loadRequests(); // Reload data to update table status and actions
                        } else {
                            mainController.showErrorAlert("Action Failed", "Could not " + actionType.toLowerCase() + " request. Please try again.");
                        }
                    }))
                    .exceptionally(e -> {
                        logger.error("Exception while {} request {}: {}", actionType, request.getId(), e.getMessage(), e);
                        Platform.runLater(() -> mainController.showErrorAlert("Network Error", "Failed to " + actionType.toLowerCase() + " request."));
                        return null;
                    });
        }
    }
}