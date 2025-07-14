package com.leroy.inventorymanagementfx.controller;

import com.dlsc.formsfx.model.structure.*;
import com.dlsc.formsfx.view.controls.SimpleRadioButtonControl; // Needed for specific control type
import com.dlsc.formsfx.view.renderer.FormRenderer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leroy.inventorymanagementfx.customcontrols.FilteredComboBox; // Custom control
import com.leroy.inventorymanagementfx.dto.request.GeneralNotificationRequest;
import com.leroy.inventorymanagementfx.enums.RecipientType;
import com.leroy.inventorymanagementfx.security.UserSession;
import com.leroy.inventorymanagementfx.service.GeneralNotificationService; // Renamed from NotificationService
import com.leroy.inventorymanagementfx.service.admin.UserService;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.geometry.Insets;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.RadioButton;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class GeneralNotificationController {

    @FXML
    private VBox formContainer;
    @FXML
    private Label errorMessageLabel;
    @FXML
    private Label successMessageLabel;
    @FXML
    private Button sendNotificationButton;

    private final GeneralNotificationService notificationService; // Renamed
    private final UserService userService;
    private final ObjectMapper objectMapper;
    private Form form;

    // FormsFX fields
    private StringField subjectField;
    private StringField messageField;
    private SingleSelectionField<RecipientType> recipientTypeField;

    // Custom control for user emails
    private FilteredComboBox<String> userEmailSelection; // Now works with String directly
    private ObservableList<String> availableEmails = FXCollections.observableArrayList();

    private static final Logger logger = LogManager.getLogger(GeneralNotificationController.class);

    public GeneralNotificationController() {
        this.notificationService = new GeneralNotificationService(); // Renamed
        this.userService = new UserService();
        this.objectMapper = new ObjectMapper();
    }

    @FXML
    public void initialize() {
        errorMessageLabel.setText("");
        successMessageLabel.setText("");
        setupForm();
        loadEmailsForSpecificUsers();
    }

    private void setupForm() {
        subjectField = Field.ofStringType("")
                .label("Subject")
                .placeholder("Enter message subject")
                .required("Subject is required");

        messageField = Field.ofStringType("")
                .label("Message")
                .placeholder("Enter your message here")
                .multiline(true)
                .required("Message is required");

        // Determine available recipient types based on user role
        String userRole = UserSession.getInstance().getRole();
        List<RecipientType> availableRecipientTypes = new ArrayList<>();
        List<String> availableRecipientLabels = new ArrayList<>();
        

        if ("ADMIN".equals(userRole)) {
            availableRecipientTypes.add(RecipientType.ALL_USERS);
            availableRecipientLabels.add("All Users (Excluding yourself)");
            availableRecipientTypes.add(RecipientType.DEPARTMENT_USERS); // Admin can send to all storekeepers
            availableRecipientLabels.add("All Storekeepers");
            availableRecipientTypes.add(RecipientType.SPECIFIC_USERS);
            availableRecipientLabels.add("Specific Users (Email Selection)");
        } else if ("STOREKEEPER".equals(userRole)) {
            availableRecipientTypes.add(RecipientType.DEPARTMENT_USERS);
            availableRecipientLabels.add("All Users in your Department");
            availableRecipientTypes.add(RecipientType.SPECIFIC_USERS);
            availableRecipientLabels.add("Specific Users (Email Selection)");
        } else {
            // For other roles, perhaps only specific users, or no mass notification
            availableRecipientTypes.add(RecipientType.SPECIFIC_USERS);
            availableRecipientLabels.add("Specific Users (Email Selection)");
            // If no mass notification is allowed, you might want to show a message or disable the feature
            logger.warn("User role {} is not typically allowed to send general notifications. Showing only 'Specific Users'.", userRole);
        }

        recipientTypeField = Field.ofSingleSelectionType(availableRecipientTypes, -1)
                .label("Send To:")
                .required("Recipient Type is required")
                .render(new SimpleRadioButtonControl<>()); // Render as radio buttons

        // Manually set the labels for the radio buttons
        // FormsFX often uses toString() of enum for labels. We need to override this.
        // A more robust way might involve a custom renderer or a Map for labels.
        // For now, we rely on the order in availableRecipientLabels matching the enum order.
        recipientTypeField.getRenderer().getStyleClass().add("recipient-radio-group"); // Custom CSS for radios

        // Custom control for multi-selection emails
        userEmailSelection = new FilteredComboBox<>();
        userEmailSelection.setPromptText("Select specific user emails (start typing to search)");
        userEmailSelection.setAllItems(availableEmails); // Bind to availableEmails ObservableList
        userEmailSelection.getStyleClass().add("form-field"); // Apply CSS styling

        form = Form.of(
                Group.of(subjectField, messageField, recipientTypeField)
        ).title("General Notification");

        FormRenderer formRenderer = new FormRenderer(form);
        formContainer.getChildren().add(formRenderer);

        // Add custom ComboBox below the FormsFX renderer
        VBox emailSelectionWrapper = new VBox(5); // Small spacing for label and combo
        Label emailSelectionLabel = new Label("Select Specific Emails:");
        emailSelectionLabel.getStyleClass().add("formsfx-label");
        emailSelectionWrapper.getChildren().addAll(emailSelectionLabel, userEmailSelection);

        formContainer.getChildren().add(emailSelectionWrapper);
        VBox.setMargin(emailSelectionWrapper, new Insets(10, 0, 0, 10)); // Adjust margin for alignment

        // Listener for Recipient Type change to show/hide user email selection
        recipientTypeField.selectionProperty().addListener((obs, oldVal, newVal) -> {
            boolean isSpecificUsers = newVal == RecipientType.SPECIFIC_USERS;
            emailSelectionWrapper.setVisible(isSpecificUsers);
            emailSelectionWrapper.setManaged(isSpecificUsers);
            if (isSpecificUsers) {
                userEmailSelection.requestFocus(); // Focus on the custom control when visible
            }
        });

        // Initialize visibility based on default selection
        boolean isSpecificUsersInitially = recipientTypeField.getSelection() == RecipientType.SPECIFIC_USERS;
        emailSelectionWrapper.setVisible(isSpecificUsersInitially);
        emailSelectionWrapper.setManaged(isSpecificUsersInitially);


        // Workaround for FormsFX radio button labels if they don't map automatically
        Platform.runLater(() -> formRenderer.lookupAll(".formsfx-control").forEach(controlNode -> {
            if (controlNode instanceof HBox) { // Assuming HBox for radio group
                HBox radioGroup = (HBox) controlNode;
                radioGroup.getChildren().forEach(child -> {
                    if (child instanceof RadioButton) {
                        RadioButton rb = (RadioButton) child;
                        RecipientType rt = (RecipientType) rb.getUserData(); // FormsFX stores value as user data
                        if (rt != null) {
                            int index = availableRecipientTypes.indexOf(rt);
                            if (index != -1 && index < availableRecipientLabels.size()) {
                                rb.setText(availableRecipientLabels.get(index));
                            }
                        }
                    }
                });
            }
        }));

        formRenderer.setStyle("-fx-border-color: transparent; -fx-border-width: 0;");
        formRenderer.getStyleClass().add("form-renderer");
    }

    private void loadEmailsForSpecificUsers() {
        userService.getGeneralNotificationServiceEmails()
                .thenAccept(emails -> Platform.runLater(() -> {
                    availableEmails.setAll(emails); // Update the ObservableList
                }))
                .exceptionally(e -> {
                    Platform.runLater(() -> errorMessageLabel.setText("Failed to load user emails for specific recipients: " + e.getMessage()));
                    logger.error("Error loading user emails: {}", e.getMessage(), e);
                    return null;
                });
    }

    @FXML
    private void sendNotification() {
        errorMessageLabel.setText("");
        successMessageLabel.setText("");

        if (!form.isValid()) {
            errorMessageLabel.setText("Please correct the errors in the form.");
            return;
        }

        RecipientType selectedRecipientType = recipientTypeField.getSelection();
        List<String> selectedUserEmails = null;

        if (selectedRecipientType == RecipientType.SPECIFIC_USERS) {
            Set<String> selectedEmailsSet = userEmailSelection.getSelectedItems();
            if (selectedEmailsSet.isEmpty()) {
                errorMessageLabel.setText("Please select at least one email for specific recipients.");
                return;
            }
            selectedUserEmails = new ArrayList<>(selectedEmailsSet); // Convert Set to List
        }

        GeneralNotificationRequest request = new GeneralNotificationRequest(
                subjectField.getValue(),
                messageField.getValue(),
                selectedRecipientType,
                selectedUserEmails
        );

        sendNotificationButton.setText("Sending...");
        sendNotificationButton.setDisable(true);

        notificationService.sendNotification(request)
                .thenAccept(response -> Platform.runLater(() -> {
                    if (response == null) {
                        errorMessageLabel.setText("Network error. Please try again.");
                        return;
                    }

                    if (response.statusCode() == 200) {
                        successMessageLabel.setText("Notification sent successfully!");
                        // Clear form or reset fields if needed
                        form.reset();
                        userEmailSelection.clearSelection();
                        // Reset recipient type to default and hide custom selector if it was visible
                        recipientTypeField.select(0); // Select the first available option
                        userEmailSelection.setVisible(false);
                        userEmailSelection.setManaged(false);
                        errorMessageLabel.setText(""); // Clear any previous error
                    } else {
                        String errorMessage = notificationService.parseErrorMessage(response);
                        errorMessageLabel.setText(errorMessage);
                    }
                    sendNotificationButton.setText("Send Notification");
                    sendNotificationButton.setDisable(false);
                }))
                .exceptionally(e -> {
                    Platform.runLater(() -> {
                        errorMessageLabel.setText("An unexpected error occurred: " + e.getMessage());
                        sendNotificationButton.setText("Send Notification");
                        sendNotificationButton.setDisable(false);
                    });
                    logger.error("Error sending notification: {}", e.getMessage(), e);
                    return null;
                });
    }
}