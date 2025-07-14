package com.leroy.inventorymanagementfx.util;


import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;
import javafx.scene.control.ButtonBar.ButtonData;

import java.util.Objects;
import java.util.Optional;

public class CloseAppDialogUtil {
    public enum CloseAction {
        CANCEL, LOGOUT, CLOSE
    }

    public static Optional<CloseAction> showCloseConfirmation(boolean isAuthenticated) {
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle("Confirm Exit");
        alert.getDialogPane().getStylesheets().add(
                Objects.requireNonNull(CloseAppDialogUtil.class.getResource("/styles/close-app-dialog.css")).toExternalForm()
        );

        if (isAuthenticated) {
            alert.setHeaderText("You're about to exit the application");
            alert.setContentText("Choose your action:");

            ButtonType logoutButton = new ButtonType("Logout and Close", ButtonData.OTHER);
            ButtonType closeButton = new ButtonType("Close Without Logging Out", ButtonData.OTHER);
            ButtonType cancelButton = new ButtonType("Cancel", ButtonData.CANCEL_CLOSE);

            alert.getButtonTypes().setAll(logoutButton, closeButton, cancelButton);

            Optional<ButtonType> result = alert.showAndWait();
            if (result.isPresent()) {
                if (result.get() == logoutButton) {
                    return Optional.of(CloseAction.LOGOUT);
                } else if (result.get() == closeButton) {
                    return Optional.of(CloseAction.CLOSE);
                }
            }
            return Optional.of(CloseAction.CANCEL);
        } else {
            alert.setHeaderText("Are you sure you want to exit?");
            ButtonType closeButton = new ButtonType("Close", ButtonData.OK_DONE);
            ButtonType cancelButton = new ButtonType("Cancel", ButtonData.CANCEL_CLOSE);

            alert.getButtonTypes().setAll(closeButton, cancelButton);

            return alert.showAndWait()
                    .map(button -> button == closeButton ? CloseAction.CLOSE : CloseAction.CANCEL);
        }
    }
}
