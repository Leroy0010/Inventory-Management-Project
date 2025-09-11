package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.dto.report.UserReportItemDto;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportRequest;
import com.leroy.inventorymanagementspringboot.dto.report.UserReportResponseDto;
import com.leroy.inventorymanagementspringboot.entity.User;

import java.util.List;

public interface UserReportServiceInterface {
    List<UserReportItemDto> generateUserReport(UserReportRequest request);
    
    UserReportResponseDto getDepartmentUserReport(
            Integer departmentId, 
            Integer year, 
            String search, 
            String sortBy, 
            String sortOrder
    );
    
    UserReportResponseDto getAllUsersReport(
            User currentUser,
            Integer year, 
            String search, 
            String sortBy, 
            String sortOrder
    );
}
