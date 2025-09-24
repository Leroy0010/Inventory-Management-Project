package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.report.UserReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportResponseDto;

public interface UserReportServiceInterface {
    UserReportResponseDto generateUserReport(UserReportRequest request, String sortBy, String sortOrder);
}
