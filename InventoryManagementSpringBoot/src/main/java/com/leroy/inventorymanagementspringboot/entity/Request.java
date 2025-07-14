package com.leroy.inventorymanagementspringboot.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference; // Import this
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Getter @Setter
@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // This is the requester

    @ManyToOne
    @JoinColumn(name = "status_id")
    private RequestStatus requestStatus;

    @Column(name = "submitted_at")
    private Timestamp submittedAt;

    @Column(name = "approved_at")
    private Timestamp approvedAt;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approver;

    @Column(name = "fulfilled_at") // New field for fulfillment timestamp
    private Timestamp fulfilledAt;

    @ManyToOne // New field for the user who fulfilled it
    @JoinColumn(name = "fulfilled_by")
    private User fulfiller;

    // Add @JsonManagedReference here. This side is serialized normally.
    @JsonManagedReference
    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RequestItem> items = new HashSet<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    // Add this to link request to its status history
    private Set<RequestStatusHistory> statusHistory = new HashSet<>();


    public Request() {}

    @Override
    public String toString() {
        return "Request{" +
                "id=" + id +
                ", user=" + user +
                ", requestStatus=" + requestStatus +
                ", submittedAt=" + submittedAt +
                ", approvedAt=" + approvedAt +
                ", approvedBy=" + approver +
                ", fulfilledAt=" + fulfilledAt + // Include in toString
                ", fulfiller=" + fulfiller +     // Include in toString
                '}';
    }
}
