package com.leroy.inventorymanagementfx.enums;

import com.leroy.inventorymanagementfx.interfaces.FxmlPage;

public enum AdminPages implements FxmlPage {
    DASHBOARD("/fxml/admin/dashboard.fxml", "admin-dashboard"),
    TOPBAR("/fxml/admin/topbar.fxml", "admin-topbar"),
    SIDEBAR("/fxml/admin/sidebar.fxml", "admin-sidebar"),
    CREATE_DEPARTMENT("/fxml/admin/create-department.fxml", "admin-create-department"),
    CREATE_STOREKEEPER("/fxml/admin/create-storekeeper.fxml", "admin-create-storekeeper");

    private final String path;
    private final String fxmlName;
    AdminPages(String path, String fxmlName) { 
        this.path = path;
        this.fxmlName = fxmlName;
    }

    @Override public String getPath() { return path; }

    @Override
    public String getFxmlName() { // <-- New method
        return fxmlName;
    }
}
