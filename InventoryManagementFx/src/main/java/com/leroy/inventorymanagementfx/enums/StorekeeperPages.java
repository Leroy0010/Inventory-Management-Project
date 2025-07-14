package com.leroy.inventorymanagementfx.enums;

import com.leroy.inventorymanagementfx.interfaces.FxmlPage;

public enum StorekeeperPages implements FxmlPage {
    DASHBOARD("/fxml/storekeeper/dashboard.fxml", "storekeeper-dashboard"),
    TOPBAR("/fxml/storekeeper/topbar.fxml", "storekeeper-topbar"),
    SIDEBAR("/fxml/storekeeper/sidebar.fxml", "storekeeper-sidebar"),
    ADD_INVENTORY("/fxml/storekeeper/add-inventory.fxml", "storekeeper-add-inventory"),
    ADD_OFFICE("/fxml/storekeeper/add-office.fxml", "storekeeper-add-office"),
    ADD_STAFF("/fxml/storekeeper/add-staff.fxml", "storekeeper-add-staff"),
    INVENTORY_ITEMS("/fxml/storekeeper/inventory-items.fxml", "storekeeper-inventory-items"),
    ADD_BATCH("/fxml/storekeeper/add-batch.fxml", "storekeeper-add-batch"),
    REQUESTS("/fxml/storekeeper/storekeeper-requests-view.fxml", "storekeeper-requests-view"),
    TRANSACTION_REPORT("/fxml/storekeeper/transaction-report.fxml", "transaction-report"),
    USER_REPORT("/fxml/storekeeper/user-report.fxml", "user-report");


    private final String path;
    private final String fxmlName;

    StorekeeperPages(String path, String fxmlName) { this.path = path;
        this.fxmlName = fxmlName;
    }

    @Override public String getPath() { return path; }
    @Override
    public String getFxmlName() { // <-- New method
        return fxmlName;
    }
}

