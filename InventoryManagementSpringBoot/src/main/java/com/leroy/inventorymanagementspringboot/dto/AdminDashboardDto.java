package com.leroy.inventorymanagementspringboot.dto;

import com.leroy.inventorymanagementspringboot.dto.dashboard.DashboardStatsDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.QuickActionDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.RecentRequestDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.SystemHealthDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private String welcomeMessage;
    private String role;
    private String lastLoginAt;
    private List<DashboardStatsDto> stats;
    private List<QuickActionDto> quickActions;
    private List<RecentRequestDto> recentActivity;
    private SystemHealthDto systemHealth;
}

