package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


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

    // New: Count inventory items by department
    long countByDepartment(Department department);

    // FIXED: Count items below reorder level for a specific department
    // This query uses a LEFT JOIN to include items even if they have no batches,
    // then groups by item and filters using HAVING to check the sum of remainingQuantity
    // against the reorderLevel.
    @Query("SELECT COUNT(i) FROM InventoryItem i LEFT JOIN i.batches b " +
            "WHERE i.department = :department AND i.reorderLevel > 0 " +
            "GROUP BY i " +
            "HAVING COALESCE(SUM(b.remainingQuantity), 0) < i.reorderLevel")
    Long countByDepartmentAndQuantityLessThanReorderLevel(@Param("department") Department department);

}
