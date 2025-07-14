package com.leroy.inventorymanagementspringboot.servicei;

import com.leroy.inventorymanagementspringboot.entity.Request;
import com.leroy.inventorymanagementspringboot.entity.RequestStatus;
import com.leroy.inventorymanagementspringboot.entity.User;

import java.sql.Timestamp;

public interface RequestStatusHistoryServiceInterface {
    void saveStatusChange(Request request, RequestStatus status, User user, Timestamp timestamp);
}
