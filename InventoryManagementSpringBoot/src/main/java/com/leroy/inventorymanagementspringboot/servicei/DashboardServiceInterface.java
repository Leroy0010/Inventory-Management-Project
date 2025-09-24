package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.dashboard.AdminDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.StaffDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.StorekeeperDashboardDto;
import org.springframework.security.core.userdetails.UserDetails;

public interface DashboardServiceInterface {
    AdminDashboardDto getAdminDashboard(UserDetails userDetails);
    StorekeeperDashboardDto getStorekeeperDashboard(UserDetails userDetails);
    StaffDashboardDto getStaffDashboard(UserDetails userDetails);
}