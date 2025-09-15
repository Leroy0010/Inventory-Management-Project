package com.leroy.inventorymanagementspringboot.dto.response;

import lombok.Data;

@Data
public class StaffResponseDto {
    private Integer id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private boolean active;
    private String bio;
    private String officeName;
}
