package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.entity.Request;
import com.leroy.inventorymanagementspringboot.entity.RequestStatus;
import com.leroy.inventorymanagementspringboot.entity.RequestStatusHistory;
import com.leroy.inventorymanagementspringboot.entity.User;
import com.leroy.inventorymanagementspringboot.repository.RequestStatusHistoryRepository;
import com.leroy.inventorymanagementspringboot.servicei.RequestStatusHistoryServiceInterface;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@Service
@Transactional
public class RequestStatusHistoryService implements RequestStatusHistoryServiceInterface {
    private final RequestStatusHistoryRepository repository;


    @Override
    public void saveStatusChange(Request request, RequestStatus status, User user, LocalDateTime timestamp) {
        RequestStatusHistory history = new RequestStatusHistory(request, status, user, timestamp);
        repository.save(history);
    }
}