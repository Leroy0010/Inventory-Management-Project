package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ApproveRequestDto {
    @NotNull(message = "Request Id is required")
    private Long id;

    @NotBlank
    private String status;
    private boolean approve;
}
