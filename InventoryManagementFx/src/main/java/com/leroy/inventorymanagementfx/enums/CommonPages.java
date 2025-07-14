package com.leroy.inventorymanagementfx.enums;

import com.leroy.inventorymanagementfx.interfaces.FxmlPage;

public enum CommonPages implements FxmlPage {
    LOGIN("/fxml/common/login.fxml", "common-login"),
    NOTIFICATION("/fxml/common/notification.fxml", "common-notification"),
    REQUEST_DETAILS("/fxml/common/request-details-view.fxml", "request-details-view"),
    INVENTORY_ITEM_DETAILS("/fxml/common/inventory-item-details.fxml", "inventory-item-details"),
    RESET_PASSWORD("/fxml/common/reset-password-dialog.fxml", "reset-password-dialog"),
    REQUEST_RESET_PASSWORD("/fxml/common/forgot-password-email-dialog.fxml", "request-reset-password"),
    GENERAL_NOTIFICATION("/fxml/common/general-notification-form.fxml", ""),
    PROFILE("/fxml/common/profile.fxml", "profile" );
    

    private final String path;
    private final String fxmlName;
    CommonPages(String path, String fxmlName) { this.path = path;
        this.fxmlName = fxmlName;
    }

    @Override public String getPath() { return path; }

    @Override
    public String getFxmlName() { // <-- New method
        return fxmlName;
    }
}
