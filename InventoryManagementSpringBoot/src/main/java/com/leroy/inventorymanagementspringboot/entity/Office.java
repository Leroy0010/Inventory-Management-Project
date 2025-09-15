package com.leroy.inventorymanagementspringboot.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "offices")
public class Office {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "department_id",  nullable = false)
    private Department department;

    public Office(String name, Department department) {
        this.name=name;
        this.department=department;
    }

    public Office(String name, String location, String description, Department department) {
        this.name=name;
        this.location=location;
        this.description=description;
        this.department=department;
    }

    public Office() {}

    @Override
    public String toString() {
        return "<Id: " + id + ", Name: " + name + ", Department: " + department + '>';

    }
}
