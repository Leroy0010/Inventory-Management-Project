package com.leroy.inventorymanagementfx.enums;

import com.leroy.inventorymanagementfx.interfaces.FxmlPage;

public enum StaffPages implements FxmlPage {
    DASHBOARD("/fxml/staff/dashboard.fxml", "staff-dashboard"),
    TOPBAR("/fxml/staff/topbar.fxml", "staff-topbar"),
    SIDEBAR("/fxml/staff/sidebar.fxml", "staff-sidebar"),
    INVENTORY_ITEMS("/fxml/storekeeper/inventory-items.fxml", "staff-inventory-items"),
    CART("/fxml/staff/cart.fxml", "staff-cart"),
    REQUESTS("/fxml/staff/staff-requests-view.fxml", "staff-requests");



    private final String path;
    private final String fxmlName;

    StaffPages(String path, String fxmlName) { this.path = path;
        this.fxmlName = fxmlName;
    }

    @Override public String getPath() { return path; }
    @Override
    public String getFxmlName() { // <-- New method
        return fxmlName;
    }
}
