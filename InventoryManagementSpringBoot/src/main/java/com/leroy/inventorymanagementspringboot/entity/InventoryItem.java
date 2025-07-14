package com.leroy.inventorymanagementspringboot.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@Entity
@Table(name = "inventory_items")
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @Column(unique = true,  nullable = false)
    private String name;

    private String description;

    private String unit;

    @Column(name ="reorder_level")
    private int reorderLevel;


    private String imagePath;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @JsonManagedReference
    @OneToMany(mappedBy = "inventoryItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InventoryBatch> batches = new ArrayList<>();


    public InventoryItem() {}

    public InventoryItem(String name, String description, String unit, int reorderLevel, String imagePath, Department department) {
        this.name = name;
        this.description = description;
        this.unit = unit;
        this.reorderLevel = reorderLevel;
        this.imagePath = imagePath;
        this.department = department;
    }

    public InventoryItem(String name, String description, String unit, String imagePath,  Department department) {
        this.name = name;
        this.description = description;
        this.unit = unit;
        this.imagePath = imagePath;
        reorderLevel = 0;
        this.department = department;
    }

    @Override
    public String toString() {
        return "< Name: " + name +
                ", Description: " + description + ", Unit: " +
                unit + ", Reorder Level: " + reorderLevel +
                ", Department: " + department +
                ", ImagePath: " + imagePath + " >";
    }
}
