package com.leroy.inventorymanagementspringboot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Consider changing to Long for consistency and future-proofing

    @Email
    @NotBlank
    @Size(max = 100)
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @NotBlank
    private String password;

    // Explicit getter methods to ensure they exist
    @NotBlank
    @Size(max = 75)
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Size(max = 75)
    @Column(name = "last_name")
    private String lastName;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @ManyToOne
    @JoinColumn(name = "office_id")
    private Office office;

    // These fields will now be used directly
    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "reset_password_expires_at")
    private LocalDateTime resetPasswordExpiresAt;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(nullable = false)
    private boolean active;

    private String phone;

    private String bio;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public User(String email, String password, String firstName, String lastName,
            Role role, Office office) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.office = office;
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    public User(String email, String password, String firstName, String lastName,
            Role role, Department department) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.department = department;
        this.active = true;
        this.createdAt = LocalDateTime.now();
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