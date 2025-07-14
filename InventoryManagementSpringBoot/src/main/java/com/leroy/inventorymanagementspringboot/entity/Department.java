package com.leroy.inventorymanagementspringboot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable=false, unique=true)
    private String name;

    public Department(String name) {this.name = name;}

    public Department() {}

    @Override
    public String toString() {
        return  "Department{" + "id=" + id + ", name=" + name + '}';
    }
}
