package com.leroy.inventorymanagementfx.controller.staff;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.controller.MainController;
import com.leroy.inventorymanagementfx.dto.response.CartItemResponse;
import com.leroy.inventorymanagementfx.dto.response.CartResponse;
import com.leroy.inventorymanagementfx.interfaces.NeedsMainController;
import com.leroy.inventorymanagementfx.service.RequestService; // Use this for submitting request
import com.leroy.inventorymanagementfx.service.staff.CartService; // Use this for cart operations
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.control.cell.PropertyValueFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

public class CartController implements Initializable, NeedsMainController {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Logger logger = LogManager.getLogger(CartController.class);
    private final CartService cartService = new CartService();
    private final RequestService requestService = new RequestService(); // Inject RequestService for submission

    @FXML
    private TableView<CartItemResponse> cartTableView;
    @FXML
    private TableColumn<CartItemResponse, Integer> idColumn;
    @FXML
    private TableColumn<CartItemResponse, Integer> itemIdColumn;
    @FXML
    private TableColumn<CartItemResponse, String> itemNameColumn;
    @FXML
    private TableColumn<CartItemResponse, Integer> quantityColumn;
    @FXML
    private TextField itemIdField;
    @FXML
    private TextField quantityField;
    @FXML
    private Label statusLabel;

    private ObservableList<CartItemResponse> cartItems;
    private MainController mainController;


    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Initialize table columns
        idColumn.setCellValueFactory(new PropertyValueFactory<>("id"));
        itemIdColumn.setCellValueFactory(new PropertyValueFactory<>("itemId"));
        itemNameColumn.setCellValueFactory(new PropertyValueFactory<>("itemName"));
        quantityColumn.setCellValueFactory(new PropertyValueFactory<>("quantity"));

        // Initialize the ObservableList for the TableView
        cartItems = FXCollections.observableArrayList();
        cartTableView.setItems(cartItems);

        // Fetch the cart on initialization
        handleGetCart();
    }
    
    private void clearForm(){
        quantityField.setText("");
        itemIdField.setText("");
    }

    /**
     * Handles the action of adding an item to the cart.
     * Retrieves item ID and quantity from input fields,
     * calls the CartService to add the item, and updates the UI using the response.
     */
    @FXML
    private void handleAddItem() {
        try {
            int itemId = Integer.parseInt(itemIdField.getText());
            int quantity = Integer.parseInt(quantityField.getText());

            if (quantity <= 0) {
                displayMessage("Quantity must be positive.", "error");
                return;
            }

            logger.info("Attempting to add item: ID={}, Quantity={}", itemId, quantity);
            displayMessage("Adding item...", "");

            cartService.addItem(itemId, quantity)
                    .thenAccept(response -> Platform.runLater(() -> {
                        if (response.statusCode() == 200 || response.statusCode() == 202) {
                            try {
                                CartResponse cartResponse = objectMapper.readValue(response.body(), CartResponse.class);
                                cartItems.setAll(cartResponse.getItems());
                                displayMessage("Item added successfully!", "success");
                                notifyTopbarItemCount(cartResponse.getItems().size());
                                clearForm();
                            } catch (JsonProcessingException e) {
                                displayMessage("Error parsing add item response: " + e.getMessage(), "error");
                                logger.error("Error parsing add item response: {}", e.getMessage(), e);
                            }
                        } else {
                            try {
                                displayMessage("Failed to add item: " + objectMapper.readTree(response.body()).findValue("message").asText(), "error");
                            } catch (JsonProcessingException e) {
                                throw new RuntimeException(e); // Re-throw to be caught by exceptionally
                            }
                            // Fallback if the message not found in JSON
                            logger.error("Failed to add item. Status: {}, Body: {}", response.statusCode(), response.body());
                        }
                    }))
                    .exceptionally(ex -> {
                        Platform.runLater(() -> {
                            String errorMsg = ex.getCause() != null ? ex.getCause().getMessage() : ex.getMessage();
                            displayMessage("Error adding item: " + errorMsg, "error");
                            logger.error("Exception during add item: {}", ex.getMessage(), ex);
                        });
                        return null;
                    });

        } catch (NumberFormatException e) {
            displayMessage("Please enter valid numbers for Item ID and Quantity.", "error");
            logger.error("Invalid number format for item ID or quantity: {}", e.getMessage());
        } catch (Exception e) {
            displayMessage("An unexpected error occurred: " + e.getMessage(), "error");
            logger.error("Unexpected error in handleAddItem: {}", e.getMessage(), e);
        }
    }

    /**
     * Handles the action of removing an item from the cart.
     * Retrieves item ID and quantity from input fields,
     * calls the CartService to remove the item, and updates the UI using the response.
     */
    @FXML
    private void handleRemoveItem() {
        try {
            int itemId = Integer.parseInt(itemIdField.getText());
            int quantity = quantityField.getText().isEmpty() ? 1 : Integer.parseInt(quantityField.getText());


            displayMessage("Removing item...", "");

            cartService.removeItem(itemId, quantity)
                    .thenAccept(response -> Platform.runLater(() -> {
                        if (response.statusCode() == 200) {
                            try {
                                CartResponse cartResponse = objectMapper.readValue(response.body(), CartResponse.class);
                                cartItems.setAll(cartResponse.getItems());
                                displayMessage("Item removed successfully!", "success");
                                notifyTopbarItemCount(cartResponse.getItems().size());
                                clearForm();
                            } catch (JsonProcessingException e) {
                                displayMessage("Error parsing remove item response: " + e.getMessage(), "error");
                                logger.error("Error parsing remove item response: {}", e.getMessage(), e);
                            }
                        } else {
                            try {
                                displayMessage("Failed to remove item: " + objectMapper.readTree(response.body()).findValue("message").asText(), "error");
                            } catch (JsonProcessingException e) {
                                throw new RuntimeException(e);
                            }
                            logger.error("Failed to remove item. Status: {}, Body: {}", response.statusCode(), response.body());
                        }
                    }))
                    .exceptionally(ex -> {
                        Platform.runLater(() -> {
                            String errorMsg = ex.getCause() != null ? ex.getCause().getMessage() : ex.getMessage();
                            displayMessage("Error removing item: " + errorMsg, "error");
                            logger.error("Exception during remove item: {}", ex.getMessage(), ex);
                        });
                        return null;
                    });

        } catch (NumberFormatException e) {
            displayMessage("Please enter valid numbers for Item ID and Quantity.", "error");
            logger.error("Invalid number format for item ID or quantity: {}", e.getMessage());
        } catch (Exception e) {
            displayMessage("An unexpected error occurred: " + e.getMessage(), "error");
            logger.error("Unexpected error in handleRemoveItem: {}", e.getMessage(), e);
        }
    }

    /**
     * Handles the action of updating an item's quantity in the cart.
     * Retrieves item ID and quantity from input fields,
     * calls the CartService to update the item, and updates the UI using the response.
     */
    @FXML
    private void handleUpdateItem() {
        try {
            int itemId = Integer.parseInt(itemIdField.getText());
            int quantity = Integer.parseInt(quantityField.getText());

            if (quantity < 0) {
                displayMessage("Quantity cannot be negative.", "error");
                return;
            }

            logger.info("Attempting to update item: ID={}, Quantity={}", itemId, quantity);
            displayMessage("Updating item...", "");

            cartService.updateItem(itemId, quantity)
                    .thenAccept(response -> Platform.runLater(() -> {
                        if (response.statusCode() == 200) {
                            try {
                                CartResponse cartResponse = objectMapper.readValue(response.body(), CartResponse.class);
                                cartItems.setAll(cartResponse.getItems());
                                displayMessage("Item updated successfully!", "success");
                                notifyTopbarItemCount(cartResponse.getItems().size());
                                clearForm();
                            } catch (JsonProcessingException e) {
                                displayMessage("Error parsing update item response: " + e.getMessage(), "error");
                                logger.error("Error parsing update item response: {}", e.getMessage(), e);
                            }
                        } else {
                            try {
                                displayMessage("Failed to update item: " + objectMapper.readTree(response.body()).findValue("message").asText(), "error");
                            } catch (JsonProcessingException e) {
                                throw new RuntimeException(e);
                            }
                            logger.error("Failed to update item. Status: {}, Body: {}", response.statusCode(), response.body());
                        }
                    }))
                    .exceptionally(ex -> {
                        Platform.runLater(() -> {
                            String errorMsg = ex.getCause() != null ? ex.getCause().getMessage() : ex.getMessage();
                            displayMessage("Network error or service unavailable. Please try again: " + errorMsg, "error");
                            logger.error("Exception during update item: {}", ex.getMessage(), ex);
                        });
                        return null;
                    });

        } catch (NumberFormatException e) {
            displayMessage("Please enter valid numbers for Item ID and Quantity.", "error");
            logger.error("Invalid number format for item ID or quantity: {}", e.getMessage());
        } catch (Exception e) {
            displayMessage("An unexpected error occurred: " + e.getMessage(), "error");
            logger.error("Unexpected error in handleUpdateItem: {}", e.getMessage(), e);
        }
    }

    /**
     * Handles the action of clearing the entire cart.
     * Calls the CartService to clear the cart and updates the UI.
     */
    @FXML
    private void handleClearCart() {
        logger.info("Attempting to clear cart.");
        displayMessage("Clearing cart...", "");

        cartService.clearCart()
                .thenAccept(response -> Platform.runLater(() -> {
                    if (response.statusCode() == 200) {
                        try {
                            CartResponse cartResponse = objectMapper.readValue(response.body(), CartResponse.class);
                            cartItems.setAll(cartResponse.getItems());
                            displayMessage("Cart cleared successfully!", "success");
                            notifyTopbarItemCount(cartResponse.getItems().size());
                            clearForm();
                        } catch (JsonProcessingException e) {
                            displayMessage("Error parsing clear cart response: " + e.getMessage(), "error");
                            logger.error("Error parsing clear cart response: {}", e.getMessage(), e);
                        }
                    } else {
                        try {
                            displayMessage("Failed to clear cart: " + objectMapper.readTree(response.body()).findValue("message").asText(), "error");
                        } catch (JsonProcessingException e) {
                            throw new RuntimeException(e);
                        }
                        logger.error("Failed to clear cart. Status: {}, Body: {}", response.statusCode(), response.body());
                    }
                }))
                .exceptionally(ex -> {
                    Platform.runLater(() -> {
                        String errorMsg = ex.getCause() != null ? ex.getCause().getMessage() : ex.getMessage();
                        displayMessage("Network error or service unavailable. Please try again: " + errorMsg, "error");
                        logger.error("Exception during clear cart: {}", ex.getMessage(), ex);
                    });
                    return null;
                });
    }

    /**
     * Handles the action of fetching the current cart contents.
     * Calls the CartService to get the cart and populates the TableView.
     */
    @FXML
    private void handleGetCart() {
        logger.info("Attempting to fetch cart.");
        displayMessage("Fetching cart...", "");

        cartService.getCart()
                .thenAccept(response -> Platform.runLater(() -> {
                    if (response.statusCode() == 200) {
                        try {
                            CartResponse cartResponse = objectMapper.readValue(response.body(), CartResponse.class);
                            List<CartItemResponse> items = cartResponse.getItems();
                            cartItems.setAll(items);
                            displayMessage("Cart refreshed successfully!", "success");
                            notifyTopbarItemCount(items.size());
                            clearForm();
                        } catch (Exception e) {
                            displayMessage("Error parsing cart data: " + e.getMessage(), "error");
                            logger.error("Error parsing cart data: {}", e.getMessage(), e);
                        }
                    } else {
                        try {
                            displayMessage("Failed to fetch cart: " + objectMapper.readTree(response.body()).findValue("message").asText(), "error");
                        } catch (JsonProcessingException e) {
                            throw new RuntimeException(e);
                        }
                        logger.error("Failed to fetch cart. Status: {}, Body: {}", response.statusCode(), response.body());
                    }
                }))
                .exceptionally(ex -> {
                    Platform.runLater(() -> {
                        String errorMsg = ex.getCause() != null ? ex.getCause().getMessage() : ex.getMessage();
                        displayMessage("Network error or service unavailable. Please try again: " + errorMsg, "error");
                        logger.error("Exception during get cart: {}", ex.getMessage(), ex);
                    });
                    return null;
                });
    }

    /**
     * Handles the action of submitting the cart as a request.
     * Calls the RequestService to submit the request and updates the UI.
     */
    @FXML
    private void handleSubmitRequest() {
        logger.info("Attempting to submit cart as request.");
        displayMessage("Submitting request...", "");

        // Call the new submitCartAsRequest method in RequestService
        requestService.submitCartAsRequest()
                .thenAccept(requestResponseDto -> Platform.runLater(() -> {
                    if (requestResponseDto != null) {
                        // Backend clears the cart upon successful request submission
                        cartItems.clear(); // Clear the TableView
                        displayMessage("Request submitted successfully! Your cart has been cleared.", "success");
                        notifyTopbarItemCount(0); // Update topbar to reflect empty cart
                        clearForm();
                    } else {
                        // This case might be hit if the service returns null (e.g., parsing error within service)
                        displayMessage("Request submission failed due to an unexpected response format.", "error");
                        logger.error("Request submission failed: requestResponseDto was null.");
                    }
                }))
                .exceptionally(ex -> {
                    Platform.runLater(() -> {
                        // The exception's cause usually contains the original message thrown from the service
                        String errorMessage = ex.getCause() != null ? ex.getCause().getMessage() : ex.getMessage();
                        displayMessage("Error submitting request: " + errorMessage, "error");
                        logger.error("Exception during submit request: {}", ex.getMessage(), ex);
                    });
                    return null;
                });
    }

    /**
     * Displays a message to the user in the status label.
     *
     * @param message The message to display.
     * @param type    The type of message ("success", "error", or empty for default).
     */
    private void displayMessage(String message, String type) {
        statusLabel.setText(message);
        statusLabel.getStyleClass().removeAll("success", "error"); // Clear previous styles
        if (!type.isEmpty()) {
            statusLabel.getStyleClass().add(type);
        }
    }

    private void notifyTopbarItemCount(int count) {
        if (mainController != null) {
            mainController.updateTopbarItemCount(count);
        }
    }

    @Override
    public void setMainController(MainController mainController){
        this.mainController = mainController;
    }
}