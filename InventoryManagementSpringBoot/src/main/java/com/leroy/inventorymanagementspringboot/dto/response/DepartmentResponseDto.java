package com.leroy.inventorymanagementspringboot.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentResponseDto {
    private Integer id;
    private String name;
    private String headOfDepartment;
    private Integer staffCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active;
    private String description;
}
