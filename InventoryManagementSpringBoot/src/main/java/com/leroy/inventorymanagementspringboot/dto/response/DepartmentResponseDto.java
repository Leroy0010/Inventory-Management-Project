package com.leroy.inventorymanagementspringboot.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentResponseDto {
    private Integer id;
    private String name;
    private String headOfDepartment;
    private Integer staffCount;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private boolean active;
    private String description;
}
