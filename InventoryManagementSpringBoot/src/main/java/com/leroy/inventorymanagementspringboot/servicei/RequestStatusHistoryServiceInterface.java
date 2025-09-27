package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.entity.Request;
import com.leroy.inventorymanagementspringboot.entity.RequestStatus;
import com.leroy.inventorymanagementspringboot.entity.User;

import java.time.LocalDateTime;


public interface RequestStatusHistoryServiceInterface {
    void saveStatusChange(Request request, RequestStatus status, User user, LocalDateTime timestamp);
}
