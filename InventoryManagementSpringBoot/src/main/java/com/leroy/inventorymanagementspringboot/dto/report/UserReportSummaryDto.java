package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserReportSummaryDto {
    private Integer userId;
    private String userName;
    private String userEmail;
    private String officeName; // Changed from departmentName to officeName
    private Integer totalItemsReceived;
    private Integer totalQuantityReceived;
    private List<UserReportItemDto> items;

    // Constructor for repository query results
    public UserReportSummaryDto(Integer userId, String userName, String userEmail, 
                               String officeName, Long totalItemsReceived, Long totalQuantityReceived) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.officeName = officeName;
        this.totalItemsReceived = totalItemsReceived != null ? totalItemsReceived.intValue() : 0;
        this.totalQuantityReceived = totalQuantityReceived != null ? totalQuantityReceived.intValue() : 0;
    }
}
