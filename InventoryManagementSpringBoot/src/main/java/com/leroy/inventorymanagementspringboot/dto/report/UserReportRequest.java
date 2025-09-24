package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class UserReportRequest {
    private Integer userId;
    private Integer year;
    private LocalDate startDate;
    private LocalDate endDate;
}
