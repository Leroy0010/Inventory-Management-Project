package com.leroy.inventorymanagementspringboot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.InventoryItem;

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
    // then groups by item and filters using HAVING to check the sum of
    // remainingQuantity
    // against the reorderLevel.
    @Query("""
            SELECT COUNT(i)
            FROM InventoryItem i
            WHERE i.department = :department
              AND i.reorderLevel > 0
              AND (SELECT COALESCE(SUM(b.remainingQuantity), 0)
                   FROM InventoryBatch b
                   WHERE b.inventoryItem = i) < i.reorderLevel
            """)
    Long countByDepartmentAndQuantityLessThanReorderLevel(@Param("department") Department department);

    @Query("""
            SELECT COUNT(i)
            FROM InventoryItem i
            WHERE i.department = :department
              AND i.reorderLevel > 0
              AND (SELECT COALESCE(SUM(b.remainingQuantity), 0)
                   FROM InventoryBatch b
                   WHERE b.inventoryItem = i) != 0
            """)
    Long countByDepartmentAndQuantityNotEqualToZero(@Param("department") Department department);

    List<InventoryItem> id(int id);
}
