package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserReportRequest {
    private Integer userId;
    private Integer year;
}

