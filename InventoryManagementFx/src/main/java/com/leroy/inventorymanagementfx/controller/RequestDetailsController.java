package com.leroy.inventorymanagementfx.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.leroy.inventorymanagementfx.dto.request.ApproveRequestDto;
import com.leroy.inventorymanagementfx.dto.request.RequestFulfillmentDto;
import com.leroy.inventorymanagementfx.dto.response.RequestItemResponseDto;
import com.leroy.inventorymanagementfx.dto.response.RequestResponseDto;
import com.leroy.inventorymanagementfx.dto.response.RequestStatusHistoryDto;
import com.leroy.inventorymanagementfx.dto.response.User;
import com.leroy.inventorymanagementfx.enums.StaffPages;
import com.leroy.inventorymanagementfx.enums.StorekeeperPages; // Import StorekeeperPages
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController;
import com.leroy.inventorymanagementfx.security.UserSession;
import com.leroy.inventorymanagementfx.service.RequestService;
import javafx.application.Platform;
import javafx.beans.property.SimpleStringProperty;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

public class RequestDetailsController implements NeedsMainController {

    private static final Logger logger = LogManager.getLogger(RequestDetailsController.class);
    private MainController mainController;
    private Long requestId;
    private RequestResponseDto currentRequestDto; // To hold the loaded request for actions
    private final RequestService requestService = new RequestService();
    private final ObjectMapper objectMapper = new ObjectMapper();
    // Corrected pattern for year to standard 'yyyy'
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("MMM dd,yyyy HH:mm").withZone(ZoneId.systemDefault());

    private final UserSession userSession = UserSession.getInstance();

    @FXML private Label requestIdLabel;
    @FXML private Label statusLabel;
    @FXML private Label submittedByLabel;
    @FXML private Label submittedAtLabel;

    @FXML private VBox approvalSection;
    @FXML private Label approvedByLabel;
    @FXML private Label approvedAtLabel;

    @FXML private VBox fulfillmentSection;
    @FXML private Label fulfilledByLabel;
    @FXML private Label fulfilledAtLabel;

    @FXML private TableView<RequestItemResponseDto> itemsTable;
    @FXML private TableColumn<RequestItemResponseDto, String> itemNameColumn;
    @FXML private TableColumn<RequestItemResponseDto, Integer> itemQuantityColumn;

    @FXML private TableView<RequestStatusHistoryDto> historyTable;
    @FXML private TableColumn<RequestStatusHistoryDto, String> historyStatusColumn;
    @FXML private TableColumn<RequestStatusHistoryDto, String> historyChangedByColumn;
    @FXML private TableColumn<RequestStatusHistoryDto, Timestamp> historyTimestampColumn;

    @FXML private Button backButton;
    @FXML private Button approveButton;
    @FXML private Button rejectButton;
    @FXML private Button fulfillButton;
    @FXML private HBox detailsActions;

    public RequestDetailsController() {
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void setMainController(MainController mainController) {
        this.mainController = mainController;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
        logger.info("RequestDetailsController received Request ID: {}", requestId);
        fetchRequestDetails(requestId);
    }

    @FXML
    public void initialize() {
        // Initialize Requested Items Table columns
        itemNameColumn.setCellValueFactory(new PropertyValueFactory<>("name"));
        itemQuantityColumn.setCellValueFactory(new PropertyValueFactory<>("quantity"));
        itemsTable.setPlaceholder(new Label("No items found for this request."));

        // Initialize Status History Table columns
        historyStatusColumn.setCellValueFactory(new PropertyValueFactory<>("statusName"));
        historyChangedByColumn.setCellValueFactory(cellData -> {
            User changedBy = cellData.getValue().getChangedBy();
            String changedByName = (changedBy != null) ? changedBy.getFullName() : "System";
            return new SimpleStringProperty(changedByName);
        });
        historyTimestampColumn.setCellValueFactory(new PropertyValueFactory<>("timestamp"));
        historyTable.setPlaceholder(new Label("No status history found."));

        // Initialize action buttons (hidden by default, managed property ensures they don't take space)
        if (approveButton != null) {
            approveButton.setVisible(false);
            approveButton.setManaged(false);
            approveButton.setOnAction(event -> handleApproveRequest());
        }
        if (rejectButton != null) {
            rejectButton.setVisible(false);
            rejectButton.setManaged(false);
            rejectButton.setOnAction(event -> handleRejectRequest());
        }
        if (fulfillButton != null) {
            fulfillButton.setVisible(false);
            fulfillButton.setManaged(false);
            fulfillButton.setOnAction(event -> handleFulfillRequest());
        }
    }

    private void fetchRequestDetails(Long id) {
        requestService.getRequestById(id)
                .thenAccept(requestDto -> Platform.runLater(() -> {
                    if (requestDto != null) {
                        this.currentRequestDto = requestDto; // Store the loaded DTO
                        populateRequestDetails(requestDto);
                        logger.info("Successfully loaded details for Request ID: {}", id);
                    } else {
                        logger.warn("Request details not found for ID: {}", id);
                        mainController.showErrorAlert("Request Not Found", "Details for request ID " + id + " could not be loaded.");
                        // Handle case where request is not found, e.g., navigate back
                        handleBackToRequests();
                    }
                }))
                .exceptionally(e -> {
                    logger.error("Exception while fetching request details for ID {}: {}", id, e.getMessage(), e);
                    Platform.runLater(() -> mainController.showErrorAlert("Network Error", "Could not load request details."));
                    // Handle network error, e.g., navigate back
                    handleBackToRequests();
                    return null;
                });
    }

    private void populateRequestDetails(RequestResponseDto request) {
        // Populate Request Summary
        requestIdLabel.setText(String.valueOf(request.getId()));
        statusLabel.setText(request.getStatus());
        // For 'Submitted By', use the user_id for now as discussed,
        // or switch to request.getRequester().getFullName() if DTO changes.
        submittedByLabel.setText("User ID: " + request.getUser_id());
        submittedAtLabel.setText(formatTimestamp(request.getSubmittedAt()));

        // Populate Approval Section
        if (request.getApprovedAt() != null && request.getApprover() != null) {
            approvalSection.setVisible(true);
            approvalSection.setManaged(true);
            approvedByLabel.setText(request.getApprover().getFullName());
            approvedAtLabel.setText(formatTimestamp(request.getApprovedAt()));
        } else {
            approvalSection.setVisible(false);
            approvalSection.setManaged(false);
        }

        // Populate Fulfillment Section
        if (request.getFulfilledAt() != null && request.getFulfiller() != null) {
            fulfillmentSection.setVisible(true);
            fulfillmentSection.setManaged(true);
            fulfilledByLabel.setText(request.getFulfiller().getFullName());
            fulfilledAtLabel.setText(formatTimestamp(request.getFulfilledAt()));
        } else {
            fulfillmentSection.setVisible(false);
            fulfillmentSection.setManaged(false);
        }

        // Populate Requested Items Table
        if (request.getItems() != null) {
            itemsTable.getItems().setAll(request.getItems());
        }

        // Populate Status History Table
        if (request.getStatusHistory() != null) {
            historyTable.getItems().setAll(request.getStatusHistory());
        } else {
            historyTable.getItems().clear();
        }

        // Set up role-specific UI after all data is populated
        setupRoleSpecificUI(request);
    }

    private void setupRoleSpecificUI(RequestResponseDto request) {
        String role = userSession.getRole();
        String status = request.getStatus();
        int currentUserId = userSession.getId(); // Get current user's ID

        // Hide all action buttons by default
        if (approveButton != null) { approveButton.setVisible(false); approveButton.setManaged(false); }
        if (rejectButton != null) { rejectButton.setVisible(false); rejectButton.setManaged(false); }
        if (fulfillButton != null) { fulfillButton.setVisible(false); fulfillButton.setManaged(false); }

        // Logic for Storekeeper actions (Approve/Reject)
        if ("STOREKEEPER".equals(role)) {
            if ("PENDING".equals(status)) {
                if (approveButton != null) { approveButton.setVisible(true); approveButton.setManaged(true); }
                if (rejectButton != null) { rejectButton.setVisible(true); rejectButton.setManaged(true); }
            }
        }
        // Logic for Staff actions (Fulfill their own APPROVED requests)
        else if ("STAFF".equals(role)) {
            // Check if the request was submitted by the current staff user AND is APPROVED
            if (currentRequestDto.getUser_id() > 0 && currentRequestDto.getUser_id() == currentUserId && "APPROVED".equals(status)) {
                if (fulfillButton != null) { fulfillButton.setVisible(true); fulfillButton.setManaged(true); }
            }
        }
        // Admin role views details only, no action buttons here.
    }


    @FXML
    private void handleApproveRequest() {
        if (currentRequestDto == null) return;

        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle("Confirm Approval");
        alert.setHeaderText("Approve Request " + currentRequestDto.getId() + "?");
        alert.setContentText("Are you sure you want to approve this request?");

        Optional<ButtonType> result = alert.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            logger.info("Approving Request ID: {}", requestId);
            ApproveRequestDto approveDto = new ApproveRequestDto(requestId, "APPROVED", true);
            requestService.approveOrRejectRequest(approveDto)
                    .thenAccept(response -> Platform.runLater(() -> {
                        if (response != null) {
                            mainController.showInfoAlert("Success", "Request Approved Successfully.");
                            fetchRequestDetails(requestId); // Reload details to reflect new status/buttons
                        } else {
                            mainController.showErrorAlert("Approval Failed", "Could not approve request. Please try again.");
                        }
                    }))
                    .exceptionally(e -> {
                        logger.error("Exception while approving request {}: {}", requestId, e.getMessage(), e);
                        Platform.runLater(() -> mainController.showErrorAlert("Network Error", "Failed to approve request."));
                        return null;
                    });
        }
    }

    @FXML
    private void handleRejectRequest() {
        if (currentRequestDto == null) return;

        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle("Confirm Rejection");
        alert.setHeaderText("Reject Request " + currentRequestDto.getId() + "?");
        alert.setContentText("Are you sure you want to reject this request?");

        Optional<ButtonType> result = alert.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            logger.info("Rejecting Request ID: {}", requestId);
            ApproveRequestDto rejectDto = new ApproveRequestDto(requestId, "REJECTED", false);
            requestService.approveOrRejectRequest(rejectDto)
                    .thenAccept(response -> Platform.runLater(() -> {
                        if (response != null) {
                            mainController.showInfoAlert("Success", "Request Rejected Successfully.");
                            fetchRequestDetails(requestId); // Reload details
                        } else {
                            mainController.showErrorAlert("Rejection Failed", "Could not reject request. Please try again.");
                        }
                    }))
                    .exceptionally(e -> {
                        logger.error("Exception while rejecting request {}: {}", requestId, e.getMessage(), e);
                        Platform.runLater(() -> mainController.showErrorAlert("Network Error", "Failed to reject request."));
                        return null;
                    });
        }
    }

    @FXML
    private void handleFulfillRequest() {
        if (currentRequestDto == null) return;

        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle("Confirm Fulfillment");
        alert.setHeaderText("Fulfill Request " + currentRequestDto.getId() + "?");
        alert.setContentText("Are you sure you want to mark this request as fulfilled?");

        Optional<ButtonType> result = alert.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            logger.info("Fulfilling Request ID: {}", requestId);
            RequestFulfillmentDto fulfillDto = new RequestFulfillmentDto(requestId, "FULFILLED", true);
            requestService.fulfillRequest(fulfillDto)
                    .thenAccept(response -> Platform.runLater(() -> {
                        if (response != null) {
                            mainController.showInfoAlert("Success", "Request Fulfilled Successfully.");
                            fetchRequestDetails(requestId); // Reload details
                        } else {
                            mainController.showErrorAlert("Fulfillment Failed", "Could not fulfill request. Please try again.");
                        }
                    }))
                    .exceptionally(e -> {
                        logger.error("Exception while fulfilling request {}: {}", requestId, e.getMessage(), e);
                        Platform.runLater(() -> mainController.showErrorAlert("Network Error", "Failed to fulfill request."));
                        return null;
                    });
        }
    }

    @FXML
    private void handleBackToRequests() {
        logger.info("Navigating back to requests list based on user role.");
        String role = userSession.getRole();
        if ("STAFF".equals(role)) {
            mainController.loadView(StaffPages.REQUESTS);
        } else if ("STOREKEEPER".equals(role)) {
            mainController.loadView(StorekeeperPages.REQUESTS);
        } else {
            // Fallback or handle other roles if necessary
            logger.warn("Unknown role or no specific back-navigation for role: {}", role);
            mainController.loadView(StaffPages.REQUESTS); // Default to staff view if no specific path
        }
    }

    private String formatTimestamp(Timestamp timestamp) {
        if (timestamp == null) {
            return "N/A";
        }
        return dateTimeFormatter.format(timestamp.toInstant());
    }
}