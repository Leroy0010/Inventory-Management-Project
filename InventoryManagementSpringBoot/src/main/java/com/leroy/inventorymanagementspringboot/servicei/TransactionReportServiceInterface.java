package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.report.TransactionReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.TransactionReportDto;
import com.leroy.inventorymanagementspringboot.entity.User;

public interface TransactionReportServiceInterface {
    TransactionReportDto generateReport(TransactionReportRequest request, User storekeeper);
}
