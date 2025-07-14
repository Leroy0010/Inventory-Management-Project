package com.leroy.inventorymanagementspringboot.dto.request;

import com.leroy.inventorymanagementspringboot.enums.RecipientType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class GeneralNotificationRequest {
    @NotBlank(message = "Subject cannot be blank")
    private String subject;

    @NotBlank(message = "Message content cannot be blank")
    private String message;

    @NotNull(message = "Recipient list type must be specified")
    private RecipientType recipientType; // ALL_USERS, DEPARTMENT_USERS, SPECIFIC_USERS

    private List<String> userEmails; // Required if recipientType is SPECIFIC_USERS

}