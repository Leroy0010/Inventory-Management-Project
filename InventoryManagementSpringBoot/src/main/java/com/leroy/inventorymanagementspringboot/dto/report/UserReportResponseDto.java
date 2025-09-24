package com.leroy.inventorymanagementspringboot.dto.report;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserReportResponseDto {
    private List<UserReportItemDto> items;
    private UserDetailsDto userDetails;
    private Integer totalItems;
    private Integer totalQuantity;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserDetailsDto {
        private Integer id;
        private String fullName;
        private String email;
        private String phone;
        private String officeName;
    }
}
