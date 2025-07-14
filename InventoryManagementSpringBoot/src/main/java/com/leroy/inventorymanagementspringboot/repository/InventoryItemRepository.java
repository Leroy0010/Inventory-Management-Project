package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;


public interface InventoryItemRepository extends JpaRepository<InventoryItem, Integer> {
    boolean existsByNameAndDepartment(String itemName, Department department);

    boolean existsByNameAndDepartmentAndIdNot(String name, Department department, Integer id);

    Optional<List<InventoryItem>> findAllByDepartment(Department department);

    boolean existsByIdAndDepartment(Integer id, Department department);

    List<InventoryItem> findAllByIdIn(List<Integer> ids);

    Optional<InventoryItem> findByIdAndDepartment(Integer id, Department department);

    Optional<InventoryItem> findByName(String itemName);
}
