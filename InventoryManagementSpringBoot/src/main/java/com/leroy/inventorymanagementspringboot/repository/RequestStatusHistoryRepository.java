package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.RequestStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestStatusHistoryRepository extends JpaRepository<RequestStatusHistory, Long> {
}
