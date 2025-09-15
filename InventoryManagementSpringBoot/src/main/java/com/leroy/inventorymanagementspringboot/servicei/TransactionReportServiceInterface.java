package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.TransactionReportRequest;
import com.leroy.inventorymanagementspringboot.dto.TransactionReportDto;
import org.springframework.security.core.userdetails.UserDetails;

public interface TransactionReportServiceInterface {
    TransactionReportDto generateReport(TransactionReportRequest request, UserDetails userDetails);
}
