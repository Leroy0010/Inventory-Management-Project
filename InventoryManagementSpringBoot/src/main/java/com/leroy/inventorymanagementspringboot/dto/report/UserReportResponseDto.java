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
public class UserReportResponseDto {
    private List<UserReportSummaryDto> summaries;
    private Integer totalUsers;
    private Integer totalItems;
    private Integer totalQuantity;
}
