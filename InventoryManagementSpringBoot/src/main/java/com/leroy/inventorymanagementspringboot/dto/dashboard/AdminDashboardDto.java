package com.leroy.inventorymanagementspringboot.dto.dashboard;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private String welcomeMessage;
    private String role;
    private List<DashboardStatsDto> stats;
    private List<QuickActionDto> quickActions;
    private SystemHealthDto systemHealth;
    private Long unreadNotifications;
}
