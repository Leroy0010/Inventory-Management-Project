package com.leroy.inventorymanagementspringboot.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.leroy.inventorymanagementspringboot.entity.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leroy.inventorymanagementspringboot.dto.dashboard.AdminDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.CartItemDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.DashboardStatsDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.DepartmentOverviewDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.QuickActionDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.RecentRequestDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.StaffDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.StorekeeperDashboardDto;
import com.leroy.inventorymanagementspringboot.dto.dashboard.SystemHealthDto;
import com.leroy.inventorymanagementspringboot.repository.CartItemRepository;
import com.leroy.inventorymanagementspringboot.repository.CartRepository;
import com.leroy.inventorymanagementspringboot.repository.DepartmentRepository;
import com.leroy.inventorymanagementspringboot.repository.InventoryItemRepository;
import com.leroy.inventorymanagementspringboot.repository.NotificationRepository;
import com.leroy.inventorymanagementspringboot.repository.RequestRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.servicei.DashboardServiceInterface;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class DashboardService implements DashboardServiceInterface {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final RequestRepository requestRepository;
    private final NotificationRepository notificationRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;


    @Override
    public AdminDashboardDto getAdminDashboard(User user) {
        // Get basic counts
        long totalDepartments = departmentRepository.count();
        long totalStorekeepers = userRepository.countByRoleName("STOREKEEPER");
        long unreadNotifications = notificationRepository.countByUserAndIsReadFalse(user);

        // Admin dashboard doesn't need recent requests - they have AdminRecentActivity component

        // Build stats
        List<DashboardStatsDto> stats = List.of(
            DashboardStatsDto.builder()
                .title("Total Departments")
                .value(String.valueOf(totalDepartments))
                .change("+0 this month")
                .icon("Building2")
                .color("text-blue-600")
                .build(),
            DashboardStatsDto.builder()
                .title("Active Storekeepers")
                .value(String.valueOf(totalStorekeepers))
                .change("+0 this week")
                .icon("Shield")
                .color("text-green-600")
                .build(),
            DashboardStatsDto.builder()
                .title("System Health")
                .value("99.9%")
                .change("All systems operational")
                .icon("Activity")
                .color("text-green-600")
                .build(),
            DashboardStatsDto.builder()
                .title("Pending Notifications")
                .value(String.valueOf(unreadNotifications))
                .change("Unread messages")
                .icon("Bell")
                .color("text-orange-600")
                .build()
        );

        // Build quick actions
        List<QuickActionDto> quickActions = List.of(
            QuickActionDto.builder()
                .title("Manage Departments")
                .description("Create and manage departments")
                .icon("Building2")
                .color("bg-blue-500")
                .href("/departments/add")
                .build(),
            QuickActionDto.builder()
                .title("Add Storekeeper")
                .description("Register new storekeepers")
                .icon("Shield")
                .color("bg-green-500")
                .href("/storekeeper/add")
                .build(),
            QuickActionDto.builder()
                .title("System Settings")
                .description("Configure system settings")
                .icon("Settings")
                .color("bg-purple-500")
                .href("/settings")
                .build(),
            QuickActionDto.builder()
                .title("Send Notification")
                .description("Send system-wide notifications")
                .icon("Bell")
                .color("bg-orange-500")
                .href("/notifications?tab=send")
                .build()
        );

        // System health
        SystemHealthDto systemHealth = SystemHealthDto.builder()
            .databaseStatus("Healthy")
            .apiStatus("Running")
            .authStatus("Active")
            .overallHealth("99.9%")
            .build();

        return AdminDashboardDto.builder()
            .welcomeMessage("Welcome back, " + user.getFirstName() + "!")
            .role("Administrator")
            .stats(stats)
            .quickActions(quickActions)
            .systemHealth(systemHealth)
            .unreadNotifications(unreadNotifications)
            .build(); 
    }

    @Override
    public StorekeeperDashboardDto getStorekeeperDashboard(User user) {
        // Get real data from database
        long unreadNotifications = notificationRepository.countByUserAndIsReadFalse(user);
        
        // Get department-specific data
        Department department = user.getOffice() != null ? user.getOffice().getDepartment() : null;
        long departmentInventoryItems = department != null ? inventoryItemRepository.countByDepartment(department) : 0;
        long lowStockItems = department != null ? inventoryItemRepository.countByDepartmentAndQuantityLessThanReorderLevel(department) : 0;
        
        // Get pending requests for this storekeeper
        long pendingRequests = requestRepository.countByStatusNameAndApprover("PENDING", user);
        
        // Get department staff count (users in same department)
        long departmentStaff = department != null ? userRepository.countByDepartmentIncludingOffice(department) : 0;

        // Get recent requests for storekeeper dashboard (department-specific requests)
        List<Request> recentRequests = new ArrayList<>();
        if (department != null) {
            recentRequests = requestRepository.findRequestsForDepartment(department).stream()
                .limit(5)
                .toList();
        }
        List<RecentRequestDto> recentRequestsDto = recentRequests.stream()
            .map(this::mapToRecentRequestDto)
            .collect(Collectors.toList());

        // Build stats
        List<DashboardStatsDto> stats = List.of(
            DashboardStatsDto.builder()
                .title("Total Inventory Items")
                .value(String.valueOf(departmentInventoryItems))
                .change("In your department")
                .icon("Package")
                .color("text-blue-600")
                .build(),
            DashboardStatsDto.builder()
                .title("Pending Requests")
                .value(String.valueOf(pendingRequests))
                .change("Awaiting approval")
                .icon("Clock")
                .color("text-orange-600")
                .build(),
            DashboardStatsDto.builder()
                .title("Department Staff")
                .value(String.valueOf(departmentStaff))
                .change("In your department")
                .icon("Users")
                .color("text-green-600")
                .build(),
            DashboardStatsDto.builder()
                .title("Low Stock Items")
                .value(String.valueOf(lowStockItems))
                .change("Need restocking")
                .icon("AlertTriangle")
                .color("text-red-600")
                .build()
        );

        // Build quick actions
        List<QuickActionDto> quickActions = List.of(
            QuickActionDto.builder()
                .title("Manage Inventory")
                .description("Add and manage inventory items")
                .icon("Package")
                .color("bg-blue-500")
                .href("/inventory/add")
                .build(),
            QuickActionDto.builder()
                .title("Manage Staff")
                .description("Add and manage department staff")
                .icon("Users")
                .color("bg-green-500")
                .href("/staff/add")
                .build(),
            QuickActionDto.builder()
                .title("Manage Offices")
                .description("Create and manage offices")
                .icon("Building2")
                .color("bg-purple-500")
                .href("/office/add")
                .build(),
            QuickActionDto.builder()
                .title("Send Notification")
                .description("Send messages to all department staff or specific staff")
                .icon("Bell")
                .color("bg-orange-500")
                .href("/notifications?tab=send")
                .build()
        );

        // Department overview
        DepartmentOverviewDto departmentOverview = DepartmentOverviewDto.builder()
            .totalStaff(departmentStaff)
            .inventoryItems(departmentInventoryItems)
            .pendingRequests(pendingRequests)
            .lowStockItems(lowStockItems)
            .build();

        return StorekeeperDashboardDto.builder()
            .welcomeMessage("Welcome back, " + user.getFirstName() + "!")
            .role("Storekeeper")
            .departmentName(department != null ? department.getName() : "Department")
            .stats(stats)
            .quickActions(quickActions)
            .recentRequests(recentRequestsDto)
            .departmentOverview(departmentOverview)
            .unreadNotifications(unreadNotifications)
            .build();
    }

    @Override
    public StaffDashboardDto getStaffDashboard(User user) {
        // Get real data from database
        long totalInventoryItems = inventoryItemRepository.count();
        long unreadNotifications = notificationRepository.countByUserAndIsReadFalse(user);
        
        // Get user's cart data
        Cart userCart = cartRepository.findByUser(user).orElse(null);
        List<CartItem> cartItems = userCart != null ? cartItemRepository.findByCart(userCart) : new ArrayList<>();
        int cartTotal = cartItems.stream().mapToInt(CartItem::getQuantity).sum();
        
        // Get user's request counts
        long pendingRequests = requestRepository.countByUserAndStatusName(user, "PENDING");
        long approvedRequests = requestRepository.countByUserAndStatusName(user, "APPROVED");

        // Get recent requests for staff dashboard (user's own requests)
        List<Request> recentRequests = requestRepository.findTop5ByUserOrderBySubmittedAtDesc(user);
        List<RecentRequestDto> recentRequestsDto = recentRequests.stream()
            .map(this::mapToRecentRequestDto)
            .collect(Collectors.toList());

        // Build stats
        List<DashboardStatsDto> stats = List.of(
            DashboardStatsDto.builder()
                .title("Items in Cart")
                .value(String.valueOf(cartTotal))
                .change("Ready for checkout")
                .icon("ShoppingCart")
                .color("text-blue-600")
                .build(),
            DashboardStatsDto.builder()
                .title("Pending Requests")
                .value(String.valueOf(pendingRequests))
                .change("Awaiting approval")
                .icon("Clock")
                .color("text-orange-600")
                .build(),
            DashboardStatsDto.builder()
                .title("Approved Requests")
                .value(String.valueOf(approvedRequests))
                .change("This month")
                .icon("CheckCircle")
                .color("text-green-600")
                .build(),
            DashboardStatsDto.builder()
                .title("Available Items")
                .value(String.valueOf(totalInventoryItems))
                .change("In inventory")
                .icon("Package")
                .color("text-purple-600")
                .build()
        );

        // Build quick actions
        List<QuickActionDto> quickActions = List.of(
            QuickActionDto.builder()
                .title("Browse Inventory")
                .description("Search and view available items")
                .icon("Package")
                .color("bg-blue-500")
                .href("/inventory-items")
                .build(),
            QuickActionDto.builder()
                .title("My Cart")
                .description("View and manage your cart")
                .icon("ShoppingCart")
                .color("bg-green-500")
                .href("/cart")
                .build(),
            QuickActionDto.builder()
                .title("My Requests")
                .description("View your submitted requests")
                .icon("FileText")
                .color("bg-purple-500")
                .href("/staff-requests")
                .build(),
            QuickActionDto.builder()
                .title("Notifications")
                .description("View your notifications")
                .icon("Bell")
                .color("bg-orange-500")
                .href("/notifications")
                .build()
        );

        // Map cart items to DTOs
        List<CartItemDto> cartItemsDto = cartItems.stream()
            .map(this::mapToCartItemDto)
            .collect(Collectors.toList());

        return StaffDashboardDto.builder()
            .welcomeMessage("Welcome back, " + user.getFirstName() + "!")
            .role("Staff Member")
            .officeName(user.getOffice() != null ? user.getOffice().getName() : "Office")
            .stats(stats)
            .quickActions(quickActions)
            .recentRequests(recentRequestsDto)
            .cartItems(cartItemsDto)
            .cartTotal(cartTotal)
            .unreadNotifications(unreadNotifications)
            .build();
    }

    private CartItemDto mapToCartItemDto(CartItem cartItem) {
        return CartItemDto.builder()
            .id((long) cartItem.getId())
            .name(cartItem.getInventoryItem().getName())
            .quantity(cartItem.getQuantity())
            .build();
    }

    private RecentRequestDto mapToRecentRequestDto(Request request) {
        // Get the first item from the request (for display purposes)
        String itemName = "Multiple Items";
        int quantity = 0;
        
        if (!request.getItems().isEmpty()) {
            var firstItem = request.getItems().iterator().next();
            itemName = firstItem.getItem().getName();
            quantity = firstItem.getQuantity();
            
            // If there are multiple items, show count
            if (request.getItems().size() > 1) {
                itemName += " (+" + (request.getItems().size() - 1) + " more)";
            }
        }

        // Convert Timestamp to LocalDateTime
        LocalDateTime createdAt = request.getSubmittedAt() != null 
            ? request.getSubmittedAt().toLocalDateTime() 
            : LocalDateTime.now();

        // Calculate time ago (simplified - you might want to use a proper time library)
        String timeAgo = calculateTimeAgo(createdAt);

        return RecentRequestDto.builder()
            .id(request.getId())
            .staffName(request.getUser().getFirstName() + " " + request.getUser().getLastName())
            .itemName(itemName)
            .status(request.getRequestStatus() != null ? request.getRequestStatus().getName() : "Unknown")
            .createdAt(createdAt)
            .timeAgo(timeAgo)
            .quantity(quantity)
            .build();
    }

    private String calculateTimeAgo(LocalDateTime dateTime) {
        LocalDateTime now = LocalDateTime.now();
        long days = java.time.Duration.between(dateTime, now).toDays();
        long hours = java.time.Duration.between(dateTime, now).toHours();
        long minutes = java.time.Duration.between(dateTime, now).toMinutes();

        if (days > 0) {
            return days + " day" + (days > 1 ? "s" : "") + " ago";
        } else if (hours > 0) {
            return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        } else if (minutes > 0) {
            return minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
        } else {
            return "Just now";
        }
    }
}