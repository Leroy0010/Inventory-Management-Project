package com.leroy.inventorymanagementspringboot.entity;

import com.leroy.inventorymanagementspringboot.converter.JsonbConverter;
import com.leroy.inventorymanagementspringboot.enums.AuditAction;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Getter @Setter
@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AuditAction action;

    @Column(nullable = false, name = "entity_type")
    private String entityType;

    @Column(nullable = false, name = "entity_id")
    private long entityId;

    private String context;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "old_data", columnDefinition = "jsonb")
    private Map<String, Object> oldData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "new_data", columnDefinition = "jsonb")
    private Map<String, Object> newData;

    public AuditLog() {}

    @Override
    public String toString() {
        return "Id: " + id + " User: " + user +
                " Action: " + action + " EntityType: " +
                entityType + " EntityId: " + entityId;
    }
}
