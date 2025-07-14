package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.InventoryIssuance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryIssuanceRepository extends JpaRepository<InventoryIssuance, Long> {
}
