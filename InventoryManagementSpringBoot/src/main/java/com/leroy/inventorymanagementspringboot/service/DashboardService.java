package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.dto.dashboard.InventorySummaryDto;
import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.enums.StockTransactionType;
import com.leroy.inventorymanagementspringboot.repository.InventoryItemRepository;
import com.leroy.inventorymanagementspringboot.repository.OfficeRepository;
import com.leroy.inventorymanagementspringboot.repository.StockTransactionRepository;
import com.leroy.inventorymanagementspringboot.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class DashboardService {

    private final InventoryItemRepository inventoryItemRepository;
    private final UserRepository userRepository;
    private final OfficeRepository officeRepository;
    private final StockTransactionRepository stockTransactionRepository;

    public DashboardService(InventoryItemRepository inventoryItemRepository,
                            UserRepository userRepository,
                            OfficeRepository officeRepository,
                            StockTransactionRepository stockTransactionRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.userRepository = userRepository;
        this.officeRepository = officeRepository;
        this.stockTransactionRepository = stockTransactionRepository;
    }

    /**
     * Retrieves the inventory summary for the authenticated user's department.
     *
     * @return InventorySummaryDto containing various aggregated metrics.
     * @throws EntityNotFoundException if the user or his/her department is not found
     */
    public InventorySummaryDto getInventorySummary(UserDetails userDetails) {
        // Get the authenticated user's department
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new  EntityNotFoundException("User not found"));

        Department userDepartment = currentUser.getDepartment();
        if (userDepartment == null) throw new EntityNotFoundException("Department not found");

        // 1. Total Items in Stock for the department
        long totalItemsInStock = inventoryItemRepository.countByDepartment(userDepartment);

        // 2. Items Below Reorder Level for the department
        Long itemsBelowReorderLevelOptional = inventoryItemRepository.countByDepartmentAndQuantityLessThanReorderLevel(userDepartment);
        long itemsBelowReorderLevel = itemsBelowReorderLevelOptional != null ? itemsBelowReorderLevelOptional : 0L;


        // 3. Issued Today / This Month for the department
        LocalDate today = LocalDate.now();
        Timestamp startOfToday = Timestamp.valueOf(today.atStartOfDay());
        Timestamp endOfToday = Timestamp.valueOf(today.atTime(LocalTime.MAX));

        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        Timestamp startOfMonth = Timestamp.valueOf(firstDayOfMonth.atStartOfDay());
        Timestamp endOfMonth = Timestamp.valueOf(today.withDayOfMonth(today.lengthOfMonth()).atTime(LocalTime.MAX));

        long issuedToday = stockTransactionRepository.countTransactionsBetweenAndDepartment(StockTransactionType.ISSUED, startOfToday, endOfToday, userDepartment);
        long receivedToday = stockTransactionRepository.countTransactionsBetweenAndDepartment(StockTransactionType.RECEIVED, startOfToday, endOfToday, userDepartment);

        long issuedThisMonth = stockTransactionRepository.countTransactionsBetweenAndDepartment(StockTransactionType.ISSUED, startOfMonth, endOfMonth, userDepartment);
        long receivedThisMonth = stockTransactionRepository.countTransactionsBetweenAndDepartment(StockTransactionType.RECEIVED, startOfMonth, endOfMonth, userDepartment);

        // 4. Total Staff in the Department
        long totalStaffInDepartment = userRepository.countByDepartment(userDepartment);

        // 5. Total Offices in the Department
        long totalOfficesInDepartment = officeRepository.countByDepartment(userDepartment);

        return new InventorySummaryDto(
                totalItemsInStock,
                itemsBelowReorderLevel,
                issuedToday,
                issuedThisMonth,
                receivedToday,
                receivedThisMonth,
                totalStaffInDepartment,
                totalOfficesInDepartment
        );
    }

}
