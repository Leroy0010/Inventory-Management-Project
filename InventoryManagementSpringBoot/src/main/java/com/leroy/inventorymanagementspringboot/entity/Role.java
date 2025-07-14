package com.leroy.inventorymanagementspringboot.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "roles")
public class Role {

    @Getter @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @Getter @Setter
    @Column(nullable = false, unique = true)
    private String name;

    public Role(String name) {this.name=name;}

    public Role() {}

    @Override
    public String toString() {
        return '<' + "Id: " + id + ", Name: " + name + '>';
    }
}
