-- Critical Performance Indexes for Inventory Summary Report
-- Add these indexes immediately to improve performance

-- Index for brought forward calculations (most critical)
CREATE INDEX IF NOT EXISTS idx_stock_transactions_item_date 
ON stock_transactions (item_id, transaction_date);

-- Index for transaction type filtering
CREATE INDEX IF NOT EXISTS idx_stock_transactions_type_date 
ON stock_transactions (transaction_type, transaction_date);

-- Index for inventory balances snapshots
CREATE INDEX IF NOT EXISTS idx_inventory_balances_item_date 
ON inventory_balances (item_id, snapshot_date);

-- Index for department-based queries
CREATE INDEX IF NOT EXISTS idx_inventory_balances_dept_date 
ON inventory_balances (department_id, snapshot_date);

-- Composite index for complex queries
CREATE INDEX IF NOT EXISTS idx_stock_transactions_item_type_date 
ON stock_transactions (item_id, transaction_type, transaction_date);

-- Index for FIFO calculations
CREATE INDEX IF NOT EXISTS idx_inventory_issuance_item_date 
ON inventory_issuance (issued_at);

-- Index for batch lookups
CREATE INDEX IF NOT EXISTS idx_inventory_batches_item_date 
ON inventory_batches (item_id, batch_date);

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('stock_transactions', 'inventory_balances', 'inventory_issuance', 'inventory_batches')
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
