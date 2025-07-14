package com.leroy.inventorymanagementspringboot.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter @Setter
public class RequestStatusHistoryDto {
    private Long id;
    private String statusName;
    private UserResponseDto changedBy; // Use UserResponseDto for nested user
    private Timestamp timestamp; // Matches frontend's field name
}