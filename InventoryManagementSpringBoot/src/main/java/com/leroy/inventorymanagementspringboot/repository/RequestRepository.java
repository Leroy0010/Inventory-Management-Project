package com.leroy.inventorymanagementspringboot.repository;

import java.util.List; // Import Department
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Import Query
import org.springframework.stereotype.Repository;

import com.leroy.inventorymanagementspringboot.entity.Department;
import com.leroy.inventorymanagementspringboot.entity.Request;
import com.leroy.inventorymanagementspringboot.entity.User;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    /**
     * Fetches a list of requests submitted by a specific user.
     * Eagerly loads associated items, request status, user, approver, fulfiller,
     * and status history for comprehensive detail.
     * Crucially, it also eagerly loads nested properties of User entities (role,
     * department, office.department)
     * to prevent LazyInitializationException during DTO serialization.
     *
     * @param user The user who submitted the requests.
     * @return A list of Request entities.
     */
    @EntityGraph(attributePaths = {
            "items.item",
            "requestStatus",
            "user", "user.role", "user.department", "user.office.department", // Eagerly load user's nested properties
            "approver", "approver.role", "approver.department", "approver.office.department", // Eagerly load approver's
                                                                                              // nested properties
            "fulfiller", "fulfiller.role", "fulfiller.department", "fulfiller.office.department", // Eagerly load
                                                                                                  // fulfiller's nested
                                                                                                  // properties
            "statusHistory.status",
            "statusHistory.changedBy"
    })
    List<Request> findByUserOrderBySubmittedAtDesc(User user);

    /**
     * Fetches a single request by its ID.
     * Eagerly loads all related entities for a complete view of the request.
     * Crucially, it also eagerly loads nested properties of User entities (role,
     * department, office.department)
     * to prevent LazyInitializationException during DTO serialization.
     *
     * @param id The ID of the request.
     * @return An Optional containing the Request if found, otherwise empty.
     */
    @EntityGraph(attributePaths = {
            "items.item",
            "requestStatus",
            "user", "user.role", "user.department", "user.office.department", // Eagerly load user's nested properties
            "approver", "approver.role", "approver.department", "approver.office.department", // Eagerly load approver's
                                                                                              // nested properties
            "fulfiller", "fulfiller.role", "fulfiller.department", "fulfiller.office.department", // Eagerly load
                                                                                                  // fulfiller's nested
                                                                                                  // properties
            "statusHistory.status",
            "statusHistory.changedBy"
    })
    Optional<Request> findById(Integer id);

    /**
     * Fetches requests where the submitting user's department matches the given
     * department.
     * This query handles users whose department is directly linked (e.g.,
     * Storekeepers)
     * AND users whose department is linked via their office (e.g., Staff).
     * Eagerly loads all related entities for comprehensive detail, including nested
     * user properties.
     *
     * @param department The Department to filter requests by.
     * @return A list of Request entities belonging to the specified department.
     */
    @EntityGraph(attributePaths = {
            "items.item",
            "requestStatus",
            "user", "user.role", "user.department", "user.office.department", // Eagerly load user's nested properties
            "approver", "approver.role", "approver.department", "approver.office.department", // Eagerly load approver's
                                                                                              // nested properties
            "fulfiller", "fulfiller.role", "fulfiller.department", "fulfiller.office.department", // Eagerly load
                                                                                                  // fulfiller's nested
                                                                                                  // properties
            "statusHistory.status",
            "statusHistory.changedBy"
    })
    @Query("SELECT r FROM Request r JOIN r.user u WHERE " +
            "(u.department = :department OR (u.office IS NOT NULL AND u.office.department = :department)) ORDER BY r.submittedAt DESC")
    List<Request> findRequestsForDepartment(Department department);

    @Query("SELECT r FROM Request r JOIN r.user u WHERE " +
            "(u.department = :department OR (u.office IS NOT NULL AND u.office.department = :department)) ORDER BY r.submittedAt DESC LIMIT 5")
    List<Request> findRecentRequestsForDepartment(Department department);

    // Dashboard methods
    @Query("SELECT r FROM Request r ORDER BY r.submittedAt DESC LIMIT 5")
    List<Request> findTop5ByOrderBySubmittedAtDesc();

    @Query("SELECT r FROM Request r WHERE r.user = :user ORDER BY r.submittedAt DESC LIMIT 5")
    List<Request> findTop5ByUserOrderBySubmittedAtDesc(@Param("user") User user);

    @Query("SELECT r FROM Request r WHERE r.approver = :approver ORDER BY r.submittedAt DESC LIMIT 5")
    List<Request> findTop5ByApproverOrderBySubmittedAtDesc(@Param("approver") User approver);

    @Query("SELECT COUNT(r) FROM Request r JOIN r.requestStatus rs WHERE rs.name = :statusName AND r.approver = :approver")
    long countByStatusNameAndApprover(@Param("statusName") String statusName, @Param("approver") User approver);

    @Query("""
            SELECT COUNT(DISTINCT r)
            FROM RequestStatusHistory h
            JOIN h.request r
            JOIN h.status rs
            WHERE r.user = :user AND rs.name = :statusName
            """)
    long countByUserAndStatusName(@Param("user") User user, @Param("statusName") String statusName);

    @Query("""
            SELECT COUNT(r)
            FROM Request r
            JOIN r.requestStatus rs
            WHERE r.user = :user AND rs.name = :statusName
            """)
    long countByUserAndCurrentStatus(@Param("user") User user,
            @Param("statusName") String statusName);

    @Query("""
            SELECT COUNT(r)
            FROM Request r
            JOIN r.requestStatus rs
            WHERE r.user.office.department = :department AND rs.name = :statusName
            """)
    long countByDepartmentAndCurrentStatus(@Param("department") Department department,
            @Param("statusName") String statusName);

    // User Activity Report methods
    @Query("SELECT 'SUBMITTED' as status, COUNT(r) as count FROM Request r " +
            "WHERE r.user.id = :userId " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.submittedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.submittedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'APPROVED' as status, COUNT(r) as count FROM Request r " +
            "WHERE r.user.id = :userId " +
            "AND r.approvedAt IS NOT NULL " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.approvedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.approvedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'REJECTED' as status, COUNT(r) as count FROM Request r " +
            "WHERE r.user.id = :userId " +
            "AND r.requestStatus.name = 'REJECTED' " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.submittedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.submittedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'FULFILLED' as status, COUNT(r) as count FROM Request r " +
            "WHERE r.user.id = :userId " +
            "AND r.fulfilledAt IS NOT NULL " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.fulfilledAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.fulfilledAt <= :endDate)")
    List<Object[]> getRequestCountsByUserAndDateRange(@Param("userId") Integer userId,
            @Param("startDate") java.sql.Timestamp startDate,
            @Param("endDate") java.sql.Timestamp endDate);

    @Query("SELECT 'SUBMITTED' as status, COALESCE(SUM(ri.quantity * ib.unitPrice), 0) as totalValue FROM Request r " +
            "JOIN r.items ri " +
            "JOIN ri.item.batches ib " +
            "WHERE r.user.id = :userId " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.submittedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.submittedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'APPROVED' as status, COALESCE(SUM(ri.quantity * ib.unitPrice), 0) as totalValue FROM Request r " +
            "JOIN r.items ri " +
            "JOIN ri.item.batches ib " +
            "WHERE r.user.id = :userId " +
            "AND r.approvedAt IS NOT NULL " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.approvedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.approvedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'REJECTED' as status, COALESCE(SUM(ri.quantity * ib.unitPrice), 0) as totalValue FROM Request r " +
            "JOIN r.items ri " +
            "JOIN ri.item.batches ib " +
            "WHERE r.user.id = :userId " +
            "AND r.requestStatus.name = 'REJECTED' " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.submittedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.submittedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'FULFILLED' as status, COALESCE(SUM(ri.quantity * ib.unitPrice), 0) as totalValue FROM Request r " +
            "JOIN r.items ri " +
            "JOIN ri.item.batches ib " +
            "WHERE r.user.id = :userId " +
            "AND r.fulfilledAt IS NOT NULL " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.fulfilledAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.fulfilledAt <= :endDate)")
    List<Object[]> getValueTotalsByUserAndDateRange(@Param("userId") Integer userId,
            @Param("startDate") java.sql.Timestamp startDate,
            @Param("endDate") java.sql.Timestamp endDate);

    @Query("SELECT 'SUBMITTED' as status, MAX(r.submittedAt) as lastActivity FROM Request r " +
            "WHERE r.user.id = :userId " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.submittedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.submittedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'APPROVED' as status, MAX(r.approvedAt) as lastActivity FROM Request r " +
            "WHERE r.user.id = :userId " +
            "AND r.approvedAt IS NOT NULL " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.approvedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.approvedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'REJECTED' as status, MAX(r.submittedAt) as lastActivity FROM Request r " +
            "WHERE r.user.id = :userId " +
            "AND r.requestStatus.name = 'REJECTED' " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.submittedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.submittedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'FULFILLED' as status, MAX(r.fulfilledAt) as lastActivity FROM Request r " +
            "WHERE r.user.id = :userId " +
            "AND r.fulfilledAt IS NOT NULL " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.fulfilledAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.fulfilledAt <= :endDate)")
    List<Object[]> getLastActivityTimestampsByUser(@Param("userId") Integer userId,
            @Param("startDate") java.sql.Timestamp startDate,
            @Param("endDate") java.sql.Timestamp endDate);
}
