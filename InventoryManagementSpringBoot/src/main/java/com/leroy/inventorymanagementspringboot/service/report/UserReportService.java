package com.leroy.inventorymanagementspringboot.service.report;

import java.util.List;

import org.springframework.stereotype.Service;

import com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportResponseDto;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportSummaryDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.servicei.UserReportServiceInterface;

@Service
public class UserReportService implements UserReportServiceInterface {

    private final StockTransactionRepository stockTransactionRepository;
    private final UserRepository userRepository;

    public UserReportService(StockTransactionRepository stockTransactionRepository,
                             UserRepository userRepository) {
        this.stockTransactionRepository = stockTransactionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<UserReportItemDto> generateUserReport(UserReportRequest request) {
        if (request.getUserId() == null || request.getYear() <= 0) {
            throw new IllegalArgumentException("User ID and year are required");
        }

        // Optional: validate user exists
        if (!userRepository.existsById(request.getUserId())) {
            throw new IllegalArgumentException("User not found");
        }

        return stockTransactionRepository.getUserReportItems(request.getUserId(), request.getYear());
    }

    @Override
    public UserReportResponseDto getDepartmentUserReport(
            Integer departmentId, 
            Integer year, 
            String search, 
            String sortBy, 
            String sortOrder
    ) {
        // Get user summaries
        List<UserReportSummaryDto> summaries = stockTransactionRepository
                .getUserReportSummariesByDepartment(departmentId, year, search, sortBy, sortOrder);
        
        // Get individual items for each user
        for (UserReportSummaryDto summary : summaries) {
            List<UserReportItemDto> items = stockTransactionRepository
                    .getUserReportItemsForUser(summary.getUserId(), year);
            summary.setItems(items);
        }
        
        // Calculate totals
        int totalUsers = summaries.size();
        int totalItems = summaries.stream().mapToInt(UserReportSummaryDto::getTotalItemsReceived).sum();
        int totalQuantity = summaries.stream().mapToInt(UserReportSummaryDto::getTotalQuantityReceived).sum();
        
        return new UserReportResponseDto(summaries, totalUsers, totalItems, totalQuantity);
    }

    @Override
    public UserReportResponseDto getAllUsersReport(
            User currentUser,
            Integer year, 
            String search, 
            String sortBy, 
            String sortOrder
    ) {
        // Get current user's department
        Integer departmentId = currentUser.getDepartment().getId();
        
        return getDepartmentUserReport(departmentId, year, search, sortBy, sortOrder);
    }
}

