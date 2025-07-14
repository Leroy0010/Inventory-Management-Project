package com.leroy.inventorymanagementspringboot.entity;
import jakarta.persistence.*;
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


    @ManyToOne
    @JoinColumn(name = "department_id",  nullable = false)
    private Department department;

    public Office(String name, Department department) {
        this.name=name;
        this.department=department;
    }

    public Office() {}

    @Override
    public String toString() {
        return "<Id: " + id + ", Name: " + name + ", Department: " + department + '>';

    }
}
