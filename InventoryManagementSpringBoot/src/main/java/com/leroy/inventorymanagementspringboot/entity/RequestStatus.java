package com.leroy.inventorymanagementspringboot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
@Entity
@Table(name = "request_status")
public class RequestStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    public RequestStatus() {}

    @Override
    public String toString() {
        return "RequestStatus{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
