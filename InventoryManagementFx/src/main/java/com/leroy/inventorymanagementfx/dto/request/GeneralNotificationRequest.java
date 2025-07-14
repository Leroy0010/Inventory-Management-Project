package com.leroy.inventorymanagementfx.dto.request;

import com.leroy.inventorymanagementfx.enums.RecipientType; // Import the frontend enum
import java.util.List;

public class GeneralNotificationRequest {
    private String subject;
    private String message;
    private RecipientType recipientType;
    private List<String> userEmails; // Assuming Integer for IDs

    public GeneralNotificationRequest() {}

    public GeneralNotificationRequest(String subject, String message, RecipientType recipientType, List<String> userEmails) {
        this.subject = subject;
        this.message = message;
        this.recipientType = recipientType;
        this.userEmails = userEmails;
    }

    // Getters and Setters
    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public RecipientType getRecipientType() {
        return recipientType;
    }

    public void setRecipientType(RecipientType recipientType) {
        this.recipientType = recipientType;
    }


    public List<String> getUserEmails() {
        return userEmails;
    }

    public void setUserEmails(List<String> userEmails) {
        this.userEmails = userEmails;
    }
}