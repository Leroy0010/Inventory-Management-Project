package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterStoreKeeperDto { // For Admin to register ADMIN or STOREKEEPER

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be empty")
    @Size(max = 100, message = "Email must be less than or equal to 100 characters")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "First name cannot be empty")
    @Size(max = 75, message = "First name must be less than or equal to 75 characters")
    private String firstName;

    @Size(max = 75, message = "Last name must be less than or equal to 75 characters")
    private String lastName;

    @NotBlank(message = "Role name cannot be empty")
    private String roleName; // Expected: "ADMIN", "STOREKEEPER"

    // Optional for ADMIN/STOREKEEPER roles. Mandatory if "role" is STOREKEEPER.
    private String departmentName;
}