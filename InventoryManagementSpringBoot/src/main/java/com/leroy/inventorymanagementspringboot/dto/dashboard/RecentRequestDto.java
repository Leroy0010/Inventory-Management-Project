package com.leroy.inventorymanagementspringboot.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentRequestDto {
    private Long id;
    private String staffName;
    private String itemName;
    private String status;
    private LocalDateTime createdAt;
    private String timeAgo;
    private Integer quantity;
}
