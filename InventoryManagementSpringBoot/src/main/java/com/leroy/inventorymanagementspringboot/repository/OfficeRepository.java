package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.Office;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OfficeRepository extends JpaRepository<Office,Integer> {
    Optional<Office> findByName (String name);

    Optional<Office> findByNameAndDepartment(@NotBlank(message = "Office name cannot be empty") String officeName, Department department);

    Optional<List<Office>> findAllByDepartment(@NotBlank(message = "Department name cannot be empty") Department department);

    boolean existsByNameAndDepartment(@NotBlank(message = "Office name cannot be empty") String officeName, Department department);

    long countByDepartment(@Param("department") Department department);
}
