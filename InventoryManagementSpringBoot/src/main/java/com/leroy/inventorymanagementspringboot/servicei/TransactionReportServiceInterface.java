package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.report.TransactionReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.TransactionReportDto;
import com.leroy.inventorymanagementspringboot.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface TransactionReportServiceInterface {
    TransactionReportDto generateReport(TransactionReportRequest request, UserDetails userDetails);
}
