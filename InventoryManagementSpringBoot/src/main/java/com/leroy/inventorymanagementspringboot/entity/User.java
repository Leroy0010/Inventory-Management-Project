package com.leroy.inventorymanagementspringboot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp; // This should ideally be java.time.LocalDateTime for modern Java APIs

@Getter @Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Consider changing to Long for consistency and future-proofing

    @Email
    @NotBlank
    @Size(max = 100)
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    @Size(max = 75)
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Size(max = 75)
    @Column(name = "last_name")
    private String lastName;

    @ManyToOne
    @JoinColumn(name = "role_id")
    @Getter @Setter
    private Role role;

    @ManyToOne
    @JoinColumn(name = "office_id")
    @Getter @Setter
    private Office office;

    // These fields will now be used directly
    @Column(name = "password_reset_token")
    @Getter @Setter
    private String passwordResetToken;

    @Column(name = "reset_password_expires_at")
    @Getter @Setter
    private Timestamp resetPasswordExpiresAt; // Still recommend LocalDateTime

    @Getter @Setter
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Getter @Setter
    @Column(nullable = false)
    private boolean active;

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public User() {}

    public User(String email, String password, String firstName, String lastName,
                Role role, Office office) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.office = office;
        this.active = true;
    }

    public User(String email, String password, String firstName, String lastName,
                Role role, Department department ) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.department = department;
        this.active = true;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", role=" + (role != null ? role.getName() : null) +
                ", office=" + (office != null ? office.getName() : null) +
                ", active=" + active +
                ", department=" + (department != null ? department.getName() : null) +
                '}';
    }
}