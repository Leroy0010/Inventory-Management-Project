package com.leroy.inventorymanagementspringboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leroy.inventorymanagementspringboot.entity.RequestItem;

@Repository
public interface RequestItemRepository extends JpaRepository<RequestItem, Long> {

    // User Activity Report methods
    @Query("SELECT 'SUBMITTED' as status, COUNT(ri) as count FROM RequestItem ri " +
            "JOIN ri.request r " +
            "WHERE r.user.id = :userId " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.submittedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.submittedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'APPROVED' as status, COUNT(ri) as count FROM RequestItem ri " +
            "JOIN ri.request r " +
            "WHERE r.user.id = :userId " +
            "AND r.approvedAt IS NOT NULL " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.approvedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.approvedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'REJECTED' as status, COUNT(ri) as count FROM RequestItem ri " +
            "JOIN ri.request r " +
            "WHERE r.user.id = :userId " +
            "AND r.requestStatus.name = 'REJECTED' " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.submittedAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.submittedAt <= :endDate) " +
            "UNION ALL " +
            "SELECT 'FULFILLED' as status, COUNT(ri) as count FROM RequestItem ri " +
            "JOIN ri.request r " +
            "WHERE r.user.id = :userId " +
            "AND r.fulfilledAt IS NOT NULL " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR r.fulfilledAt >= :startDate) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR r.fulfilledAt <= :endDate)")
    List<Object[]> getItemCountsByUserAndDateRange(@Param("userId") Integer userId,
            @Param("startDate") java.sql.Timestamp startDate,
            @Param("endDate") java.sql.Timestamp endDate);
}
