package com.leroy.inventorymanagementspringboot.dto.response;


import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserResponseDto {
    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String bio;
    private boolean active;
    private String officeName;
    private String departmentName;
    private String roleName;
    private java.sql.Timestamp createdAt;
    private java.sql.Timestamp lastLoginAt;
}
