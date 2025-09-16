package com.leroy.inventorymanagementspringboot.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneralNotificationRequest {
    private String subject;
    private String message;
    private String recipientType; // ALL_USERS, DEPARTMENT_USERS, SPECIFIC_USERS
    private List<String> userEmails;
}