package com.leroy.inventorymanagementspringboot.service.report;

import com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportRequest;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import com.leroy.inventorymanagementspringboot.servicei.UserReportServiceInterface;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserReportService implements UserReportServiceInterface {

    private final StockTransactionRepository stockTransactionRepository;
    private final UserRepository userRepository;

    public UserReportService(StockTransactionRepository stockTransactionRepository,
                             UserRepository userRepository) {
        this.stockTransactionRepository = stockTransactionRepository;
        this.userRepository = userRepository;
    }

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
}

