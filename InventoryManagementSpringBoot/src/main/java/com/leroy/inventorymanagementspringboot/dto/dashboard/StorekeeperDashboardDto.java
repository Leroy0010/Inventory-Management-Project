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
public class StorekeeperDashboardDto {
    private String welcomeMessage;
    private String role;
    private String departmentName;
    private List<DashboardStatsDto> stats;
    private List<QuickActionDto> quickActions;
    private List<RecentRequestDto> recentRequests;
    private DepartmentOverviewDto departmentOverview;
    private Long unreadNotifications;
}
