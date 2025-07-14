package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportRequest;

import java.util.List;

public interface UserReportServiceInterface {
    List<UserReportItemDto> generateUserReport(UserReportRequest request);

}
