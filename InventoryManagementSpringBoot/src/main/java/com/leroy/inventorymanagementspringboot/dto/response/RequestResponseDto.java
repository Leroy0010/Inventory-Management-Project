package com.leroy.inventorymanagementspringboot.dto.response;


import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

@Getter @Setter
public class RequestResponseDto {
    private long id;
    private int user_id; // ID of the requester
    private List<RequestItemResponseDto> items;
    private String status; // Current status name
    private Timestamp submittedAt;
    private Timestamp approvedAt;
    private UserResponseDto approver; // Approver User entity (can be mapped to UserResponseDto if preferred)
    private Timestamp fulfilledAt; // New field
    private UserResponseDto fulfiller; // New field
    private List<RequestStatusHistoryDto> statusHistory; // New field for history
}