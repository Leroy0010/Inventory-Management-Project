package com.leroy.inventorymanagementspringboot.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemHealthDto {
    private String databaseStatus;
    private String apiStatus;
    private String authStatus;
    private String overallHealth;
}
