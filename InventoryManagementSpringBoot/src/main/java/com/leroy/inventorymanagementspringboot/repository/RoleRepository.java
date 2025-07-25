package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository  extends JpaRepository<Role,Integer> {
    Optional<Role> findByName(String name);
}
