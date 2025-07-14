package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePasswordRequest {
    @NotBlank(message = "Old password can't be empty")
    String oldPassword;
    @Min(value = 8, message = "New password must be at least 8 characters long!")
    String newPassword;
}
