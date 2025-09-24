package com.leroy.inventorymanagementspringboot.service;

import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.strategy.CostCalculatorStrategy;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Component
public class FifoCostCalculator implements CostCalculatorStrategy {

    private final EntityManager entityManager;

    public FifoCostCalculator(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public BigDecimal calculateIssuedValue(InventoryItem item, Department department, LocalDate start, LocalDate end) {
        Timestamp startDate = Timestamp.valueOf(start.atStartOfDay());
        Timestamp endDate = Timestamp.valueOf(end.plusDays(1).atStartOfDay());
        String query = """
    SELECT ii.quantity, b.unit_price
    FROM inventory_issuance ii
    JOIN request_items ri ON ii.requested_item_id = ri.id
    JOIN requests r ON ri.request_id = r.id
    JOIN users u ON r.user_id = u.id
    JOIN offices o ON u.office_id = o.id
    JOIN departments d ON o.department_id = d.id
    JOIN inventory_batches b ON ii.batch_id = b.id
    WHERE ri.item_id = :itemId
      AND d.id = :deptId
      AND ii.issued_at BETWEEN :startDate AND :endDate
""";


        List<Object[]> results = entityManager.createNativeQuery(query)
                .setParameter("itemId", item.getId())
                .setParameter("deptId", department.getId())
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultList();

        BigDecimal total = BigDecimal.ZERO;
        for (Object[] row : results) {
            int qty = ((Number) row[0]).intValue();
            BigDecimal price = (BigDecimal) row[1];
            total = total.add(price.multiply(BigDecimal.valueOf(qty)));
        }

        return total;
    }
}
