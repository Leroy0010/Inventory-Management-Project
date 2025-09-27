package com.leroy.inventorymanagementspringboot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    private String description;

    public Department(String name) {
        this.name = name;
        createdAt = LocalDateTime.now();
        active = true;
        updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Department{" + "id=" + id + ", name=" + name + '}';
    }
}
