package com.leroy.inventorymanagementspringboot.util;

import com.leroy.inventorymanagementspringboot.dto.report.InventorySummaryReportRequest;

import java.time.LocalDate;

public class DateRangeUtil {

    public static LocalDate[] resolveDateRange(InventorySummaryReportRequest request) {
        LocalDate startDate;
        LocalDate endDate;

        if (request.getStartDate() != null && request.getEndDate() != null) {
            // Custom date range
            startDate = request.getStartDate();
            endDate = request.getEndDate();
        } else if (request.getYear() != null) {
            // Single year
            startDate = LocalDate.of(request.getYear(), 1, 1);
            endDate = LocalDate.of(request.getYear(), 12, 31);
        } else if (request.getStartYear() != null && request.getEndYear() != null) {
            // Year range
            startDate = LocalDate.of(request.getStartYear(), 1, 1);
            endDate = LocalDate.of(request.getEndYear(), 12, 31);
        } else {
            throw new IllegalArgumentException("You must provide either a year, a year range, or a custom date range.");
        }

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        return new LocalDate[] { startDate, endDate };
    }
}

