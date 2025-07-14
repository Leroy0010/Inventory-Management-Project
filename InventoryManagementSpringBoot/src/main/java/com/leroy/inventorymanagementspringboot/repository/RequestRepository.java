package com.leroy.inventorymanagementspringboot.repository;

import com.leroy.inventorymanagementspringboot.entity.Department; // Import Department
import com.leroy.inventorymanagementspringboot.entity.Request;
import com.leroy.inventorymanagementspringboot.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Import Query
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    /**
     * Fetches a list of requests submitted by a specific user.
     * Eagerly loads associated items, request status, user, approver, fulfiller,
     * and status history for comprehensive detail.
     * Crucially, it also eagerly loads nested properties of User entities (role, department, office.department)
     * to prevent LazyInitializationException during DTO serialization.
     *
     * @param user The user who submitted the requests.
     * @return A list of Request entities.
     */
    @EntityGraph(attributePaths = {
            "items.item",
            "requestStatus",
            "user", "user.role", "user.department", "user.office.department", // Eagerly load user's nested properties
            "approver", "approver.role", "approver.department", "approver.office.department", // Eagerly load approver's nested properties
            "fulfiller", "fulfiller.role", "fulfiller.department", "fulfiller.office.department", // Eagerly load fulfiller's nested properties
            "statusHistory.status",
            "statusHistory.changedBy"
    })
    List<Request> findByUser(User user);

    /**
     * Fetches a single request by its ID.
     * Eagerly loads all related entities for a complete view of the request.
     * Crucially, it also eagerly loads nested properties of User entities (role, department, office.department)
     * to prevent LazyInitializationException during DTO serialization.
     *
     * @param id The ID of the request.
     * @return An Optional containing the Request if found, otherwise empty.
     */
    @EntityGraph(attributePaths = {
            "items.item",
            "requestStatus",
            "user", "user.role", "user.department", "user.office.department", // Eagerly load user's nested properties
            "approver", "approver.role", "approver.department", "approver.office.department", // Eagerly load approver's nested properties
            "fulfiller", "fulfiller.role", "fulfiller.department", "fulfiller.office.department", // Eagerly load fulfiller's nested properties
            "statusHistory.status",
            "statusHistory.changedBy"
    })
    Optional<Request> findById(Long id);

    /**
     * Fetches requests where the submitting user's department matches the given department.
     * This query handles users whose department is directly linked (e.g., Storekeepers)
     * AND users whose department is linked via their office (e.g., Staff).
     * Eagerly loads all related entities for comprehensive detail, including nested user properties.
     *
     * @param department The Department to filter requests by.
     * @return A list of Request entities belonging to the specified department.
     */
    @EntityGraph(attributePaths = {
            "items.item",
            "requestStatus",
            "user", "user.role", "user.department", "user.office.department", // Eagerly load user's nested properties
            "approver", "approver.role", "approver.department", "approver.office.department", // Eagerly load approver's nested properties
            "fulfiller", "fulfiller.role", "fulfiller.department", "fulfiller.office.department", // Eagerly load fulfiller's nested properties
            "statusHistory.status",
            "statusHistory.changedBy"
    })
    @Query("SELECT r FROM Request r JOIN r.user u WHERE " +
            "(u.department = :department OR (u.office IS NOT NULL AND u.office.department = :department))")
    List<Request> findRequestsForDepartment(Department department);
}
