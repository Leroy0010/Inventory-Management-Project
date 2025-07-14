package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.entity.Request;
import com.leroy.inventorymanagementspringboot.entity.RequestStatus;
import com.leroy.inventorymanagementspringboot.entity.RequestStatusHistory;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.RequestStatusHistoryRepository;
import com.leroy.inventorymanagementspringboot.servicei.RequestStatusHistoryServiceInterface;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
@Transactional
public class RequestStatusHistoryService implements RequestStatusHistoryServiceInterface {
    private final RequestStatusHistoryRepository repository;

    public RequestStatusHistoryService(RequestStatusHistoryRepository repository) {
        this.repository = repository;
    }

    public void saveStatusChange(Request request, RequestStatus status, User user, Timestamp timestamp) {
        RequestStatusHistory history = new RequestStatusHistory(request, status, user, timestamp);
        repository.save(history);
    }
}