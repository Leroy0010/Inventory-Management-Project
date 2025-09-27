package com.leroy.inventorymanagementspringboot.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportResponseDto;
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
    public UserReportResponseDto generateUserReport(UserReportRequest request, String sortBy, String sortOrder) {
        // Validate that at least userId and either year or date range is provided
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        if (request.getYear() == null && (request.getStartDate() == null || request.getEndDate() == null)) {
            throw new IllegalArgumentException("Either year or date range (startDate and endDate) is required");
        }

        // Validate user exists and get user details
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Get report items based on year or date range
        List<UserReportItemDto> items;
        if (request.getYear() != null) {
            items = stockTransactionRepository.getUserReportItems(request.getUserId(), request.getYear(), sortBy,
                    sortOrder);
        } else {
            items = stockTransactionRepository.getUserReportItemsByDateRange(
                    request.getUserId(),
                    request.getStartDate().toLocalDate(),
                    request.getEndDate().toLocalDate(),
                    sortBy,
                    sortOrder);
        }

        // Calculate totals
        int totalItems = items.size();
        int totalQuantity = items.stream().mapToInt(UserReportItemDto::getQuantityReceived).sum();

        // Create user details
        UserReportResponseDto.UserDetailsDto userDetails = new UserReportResponseDto.UserDetailsDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getOffice() != null ? user.getOffice().getName() : null);

        return new UserReportResponseDto(items, userDetails, totalItems, totalQuantity);
    }

}
