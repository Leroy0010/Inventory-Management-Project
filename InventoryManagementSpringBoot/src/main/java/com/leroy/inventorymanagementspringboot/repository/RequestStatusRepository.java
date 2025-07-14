package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RequestStatusRepository extends JpaRepository<RequestStatus, Integer> {
    Optional<RequestStatus> findByName(String name);
}
