package com.leroy.inventorymanagementspringboot.repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.Office;
import com.leroy.inventorymanagementspringboot.entity.Role;
import com.leroy.inventorymanagementspringboot.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

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

    @Query("SELECT COUNT(u) FROM User u WHERE u.office.department = :department")
    long countByDepartment(@Param("department") Department department);

    @Query("SELECT COUNT(u) FROM User u WHERE (u.department = :department OR (u.office IS NOT NULL AND u.office.department = :department))")
    long countByDepartmentIncludingOffice(@Param("department") Department department);

    // User Activity Report methods
    List<User> findByDepartmentId(Integer departmentId);

    @Query("SELECT u FROM User u WHERE u.department.id = :departmentId AND u.office.id = :officeId")
    List<User> findByDepartmentIdAndOfficeId(@Param("departmentId") Integer departmentId,
            @Param("officeId") Integer officeId);

    /**
     * Find users whose office belongs to the given department.
     * This is used for User Activity Reports where we need staff users
     * whose office.department matches the storekeeper's department.
     */
    @Query("SELECT u FROM User u WHERE u.office.department.id = :departmentId")
    List<User> findUsersByOfficeDepartment(@Param("departmentId") Integer departmentId);

    // Dashboard methods
    long countByRoleName(String roleName);

    // Office staff count methods
    long countByOffice(Office office);

    @Query("SELECT COUNT(u) FROM User u WHERE u.office.id = :officeId")
    long countByOfficeId(@Param("officeId") int officeId);

    /**
     * Counts all users whose office belongs to the given department.
     * This method directly maps to the `office.department` condition you specified.
     */
    long countByOffice_Department(Department department);

    Optional<User> findByDepartmentAndRoleName(Department department, String storekeeperRole);
}
