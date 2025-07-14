package com.leroy.inventorymanagementfx.controller.staff;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.leroy.inventorymanagementfx.controller.MainController;
import com.leroy.inventorymanagementfx.dto.request.RequestFulfillmentDto; // Import for fulfillment DTO
import com.leroy.inventorymanagementfx.enums.CommonPages;
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController;
import com.leroy.inventorymanagementfx.dto.response.RequestResponseDto;
import com.leroy.inventorymanagementfx.dto.response.User;
import com.leroy.inventorymanagementfx.service.RequestService;
import javafx.application.Platform;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.fxml.FXML;
import javafx.scene.control.Alert; // For confirmation dialog
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType; // For confirmation dialog
import javafx.scene.control.Label;
import javafx.scene.control.TableCell;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.HBox; // To arrange multiple buttons
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Timestamp;
import java.util.Optional;


public class MyRequestsController implements NeedsMainController {

    private static final Logger logger = LogManager.getLogger(MyRequestsController.class);
    private MainController mainController;
    private final RequestService requestService = new RequestService();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @FXML private TableView<RequestResponseDto> requestTable;
    @FXML private TableColumn<RequestResponseDto, Long> idColumn;
    @FXML private TableColumn<RequestResponseDto, Timestamp> submittedAtColumn;
    @FXML private TableColumn<RequestResponseDto, String> statusColumn;
    @FXML private TableColumn<RequestResponseDto, Integer> itemCountColumn;
    @FXML private TableColumn<RequestResponseDto, String> approverColumn;
    @FXML private TableColumn<RequestResponseDto, Void> actionsColumn;

    public MyRequestsController() {
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void setMainController(MainController mainController) {
        this.mainController = mainController;
        if (mainController != null) {
            loadRequests();
        }
    }

    @FXML
    public void initialize() {
        // Initialize columns
        idColumn.setCellValueFactory(new PropertyValueFactory<>("id"));
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

        actionsColumn.setCellFactory(param -> new TableCell<>() {
            private final Button viewDetailsButton = new Button("View Details");
            private final Button fulfillButton = new Button("Fulfill"); // New fulfill button for staff

            {
                viewDetailsButton.getStyleClass().add("table-action-button");
                fulfillButton.getStyleClass().addAll("table-action-button", "success-button"); // Style for fulfill button

                // Hide buttons initially for dynamic management
                viewDetailsButton.managedProperty().bind(viewDetailsButton.visibleProperty());
                fulfillButton.managedProperty().bind(fulfillButton.visibleProperty());

                // Set actions
                viewDetailsButton.setOnAction(event -> {
                    RequestResponseDto request = getTableView().getItems().get(getIndex());
                    if (request != null) {
                        logger.info("Staff: View Details clicked for Request ID: {}", request.getId());
                        mainController.loadView(CommonPages.REQUEST_DETAILS, request.getId());
                    }
                });

                fulfillButton.setOnAction(event -> handleFulfill(getTableView().getItems().get(getIndex())));
            }

            @Override
            protected void updateItem(Void item, boolean empty) {
                super.updateItem(item, empty);
                if (empty) {
                    setGraphic(null);
                } else {
                    RequestResponseDto request = getTableView().getItems().get(getIndex());
                    HBox buttons = new HBox(5); // Spacing between buttons for multiple buttons
                    buttons.getChildren().add(viewDetailsButton);

                    if (request != null) {
                        // Staff can fulfill only if the request is APPROVED
                        if ("APPROVED".equalsIgnoreCase(request.getStatus())) {
                            fulfillButton.setVisible(true);
                            buttons.getChildren().add(fulfillButton);
                        } else {
                            fulfillButton.setVisible(false);
                        }
                    } else {
                        // If for some reason the request is null (e.g., in an empty row that's being rendered)
                        fulfillButton.setVisible(false);
                    }
                    setGraphic(buttons);
                }
            }
        });

        requestTable.setPlaceholder(new Label("No requests found."));
    }

    private void loadRequests() {
        requestService.getUserRequests()
                .thenAccept(response -> Platform.runLater(() -> {
                    requestTable.getItems().setAll(response);
                    logger.info("Successfully loaded {} requests for current user.", response.size());
                }))
                .exceptionally(e -> {
                    logger.error("Exception while loading requests: {}", e.getMessage(), e);
                    Platform.runLater(() -> mainController.showErrorAlert("Network Error", "Could not load requests."));
                    return null;
                });
    }

    private void handleFulfill(RequestResponseDto request) {
        if (request == null) return;

        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle("Confirm Fulfillment");
        alert.setHeaderText("Fulfill Request " + request.getId() + "?");
        alert.setContentText("Are you sure you want to mark this request as fulfilled?");

        Optional<ButtonType> result = alert.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            logger.info("Staff: Fulfill Request ID: {}", request.getId());
            requestService.fulfillRequest(new RequestFulfillmentDto(request.getId(), "FULFILLED", true))
                    .thenAccept(response -> Platform.runLater(() -> {
                        if (response != null) {
                            mainController.showInfoAlert("Success", "Request Fulfilled Successfully.");
                            loadRequests(); // Reload data to update table status
                        } else {
                            mainController.showErrorAlert("Fulfillment Failed", "Could not fulfill request. Please try again.");
                        }
                    }))
                    .exceptionally(e -> {
                        logger.error("Exception while fulfilling request {}: {}", request.getId(), e.getMessage(), e);
                        Platform.runLater(() -> mainController.showErrorAlert("Network Error", "Failed to fulfill request."));
                        return null;
                    });
        }
    }
}