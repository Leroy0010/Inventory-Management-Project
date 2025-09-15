package com.leroy.inventorymanagementspringboot.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffDashboardDto {
    private String welcomeMessage;
    private String role;
    private String officeName;
    private List<DashboardStatsDto> stats;
    private List<QuickActionDto> quickActions;
    private List<RecentRequestDto> recentRequests;
    private List<CartItemDto> cartItems;
    private Integer cartTotal;
    private Long unreadNotifications;
}
