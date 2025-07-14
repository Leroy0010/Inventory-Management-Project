package com.leroy.inventorymanagementspringboot.job;

import com.leroy.inventorymanagementspringboot.entity.*;
import com.leroy.inventorymanagementspringboot.enums.CostFlowMethod;
import com.leroy.inventorymanagementspringboot.repository.InventoryBalanceRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
public class InventorySnapshotJob {

    private final EntityManager entityManager;
    private final InventoryBalanceRepository inventoryBalanceRepository;
    private static final Logger logger = LogManager.getLogger(InventorySnapshotJob.class);


    public InventorySnapshotJob(EntityManager entityManager, InventoryBalanceRepository inventoryBalanceRepository) {
        this.entityManager = entityManager;
        this.inventoryBalanceRepository = inventoryBalanceRepository;
    }

    // Scheduled to run on the first day of every month at 12:10 AM
    @Scheduled(cron = "0 10 0 1 * *")
    @Transactional
    public void generateMonthlySnapshots() {
        LocalDate snapshotDate = LocalDate.now().minusMonths(1).withDayOfMonth(1);
        Date sqlDate = Date.valueOf(snapshotDate);

        logger.info("Generating inventory snapshots for date: {}", sqlDate);

        String nativeQuery = """
                SELECT
                    i.id AS item_id,
                    o.department_id,
                    SUM(CASE WHEN s.transaction_type = 'RECEIVED' THEN s.quantity ELSE -s.quantity END) AS total_quantity,
                    SUM(CASE WHEN s.transaction_type = 'RECEIVED' THEN s.quantity * s.unit_price
                             WHEN s.transaction_type = 'ISSUED' THEN -s.quantity * s.unit_price
                             ELSE 0 END) AS total_value
                FROM stock_transactions s
                         JOIN inventory_items i ON s.item_id = i.id
                         JOIN requests r ON s.related_request_id = r.id
                         JOIN users u ON r.user_id = u.id
                         JOIN offices o ON u.office_id = o.id
                WHERE s.transaction_date < :snapshotDate
                GROUP BY i.id, o.department_id
            """;

        Query query = entityManager.createNativeQuery(nativeQuery);
        query.setParameter("snapshotDate", sqlDate);

        List<Object[]> results = query.getResultList();

        for (Object[] row : results) {
            int itemId = ((Number) row[0]).intValue();
            int departmentId = ((Number) row[1]).intValue();
            int quantity = ((Number) row[2]).intValue();
            BigDecimal totalValue = (BigDecimal) row[3];

            InventoryItem item = entityManager.getReference(InventoryItem.class, itemId);
            Department dept = entityManager.getReference(Department.class, departmentId);

            InventoryBalance balanceFIFO = new InventoryBalance(item, dept, sqlDate, quantity, totalValue, CostFlowMethod.FIFO);
            InventoryBalance balanceAvg = new InventoryBalance(item, dept, sqlDate, quantity, totalValue, CostFlowMethod.AVG);

            inventoryBalanceRepository.save(balanceFIFO);
            inventoryBalanceRepository.save(balanceAvg);
        }

        logger.info("Inventory snapshot generation completed for {} entries.", results.size());
    }
}
