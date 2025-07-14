package com.leroy.inventorymanagementspringboot.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter @Setter
@Entity
@Table(name = "request_status_history")
public class RequestStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "request_id")
    private Request request;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private RequestStatus status;

    @ManyToOne
    @JoinColumn(name = "changed_by")
    private User changedBy;


    @Column(name = "changed_at")
    private Timestamp changedAt;

    public RequestStatusHistory() {}

    public RequestStatusHistory(Request request, RequestStatus status,  User changedBy, Timestamp changedAt) {
        this.request = request;
        this.status = status;
        this.changedBy = changedBy;
        this.changedAt = changedAt;
    }

    @Override
    public String toString() {
        return "RequestStatusHistory{" +
                "id=" + id +
                ", request=" + request +
                ", status=" + status +
                ", changedBy=" + changedBy +
                ", changedAt=" + changedAt +
                '}';
    }
}
