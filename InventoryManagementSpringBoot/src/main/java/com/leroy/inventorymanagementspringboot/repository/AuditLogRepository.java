package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
