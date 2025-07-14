package com.leroy.inventorymanagementspringboot.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ApproveRequestDto {
    @NotBlank(message = "Request Id can't be empty")
    private long id;
    @NotBlank
    private String requestStatus;
    private boolean approve;
}
