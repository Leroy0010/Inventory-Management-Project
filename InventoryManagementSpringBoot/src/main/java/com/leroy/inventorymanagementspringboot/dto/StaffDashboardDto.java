package com.leroy.inventorymanagementspringboot.dto;

import com.leroy.inventorymanagementspringboot.dto.dashboard.CartItemDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.DashboardStatsDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.QuickActionDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.RecentRequestDto;
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
