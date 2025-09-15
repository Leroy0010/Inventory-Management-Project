package com.leroy.inventorymanagementspringboot.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuickActionDto {
    private String title;
    private String description;
    private String icon;
    private String color;
    private String href;
}
