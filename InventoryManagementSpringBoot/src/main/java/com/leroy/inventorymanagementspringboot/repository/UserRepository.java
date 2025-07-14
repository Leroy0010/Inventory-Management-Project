package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.Role;
import com.leroy.inventorymanagementspringboot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {

    Optional<User> findByEmail(String email);


    Optional<List<User>> findAllByOffice_Department(Department department);

    Optional<User> findByDepartmentAndRole(Department department, Role role);

    Optional<User> findByPasswordResetToken(String token);

    @Modifying
    @Query("UPDATE User u SET u.passwordResetToken = NULL, u.resetPasswordExpiresAt = NULL WHERE u.resetPasswordExpiresAt < :currentTime")
    void clearExpiredPasswordResetTokens(Timestamp now);

    Optional<List<User>> findAllByRoleName(String storekeeper);

    List<User> findAllByEmailIn(List<String> userEmails);

    Optional<List<User>> findAllByIdNot(int id);

    Optional<List<User>> findAllByOffice_DepartmentAndIdNot(Department department, int id);
}
