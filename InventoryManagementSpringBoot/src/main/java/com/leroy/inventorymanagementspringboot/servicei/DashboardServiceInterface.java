package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.dashboard.AdminDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.StaffDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.StorekeeperDashboardDto;
import com.leroy.inventorymanagementspringboot.entity.User;

public interface DashboardServiceInterface {
    AdminDashboardDto getAdminDashboard(User user);
    StorekeeperDashboardDto getStorekeeperDashboard(User user);
    StaffDashboardDto getStaffDashboard(User user);
}