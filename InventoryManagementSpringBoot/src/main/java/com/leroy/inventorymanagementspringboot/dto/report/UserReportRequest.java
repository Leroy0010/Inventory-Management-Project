package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserReportRequest {
    private Integer userId;
    private Integer year;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
