CREATE TABLE departments (
                             id SERIAL PRIMARY KEY,
                             name TEXT NOT NULL UNIQUE
);


CREATE TABLE offices (
                         id SERIAL PRIMARY KEY,
                         department_id INT REFERENCES departments(id) ON DELETE CASCADE,
                         name TEXT NOT NULL,
                         UNIQUE (department_id, name)
);


CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'ADMIN', 'STAFF', 'STOREKEEPER'
    CONSTRAINT role_enum CHECK ( name IN ('ADMIN', 'STAFF', 'STOREKEEPER') )
);


CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       first_name VARCHAR(75) NOT NULL,
                       last_name VARCHAR(75),
                       email TEXT NOT NULL UNIQUE,
                       role_id INT REFERENCES roles(id),
                       password TEXT,
                       office_id INT REFERENCES offices(id),
                       department_id INT REFERENCES departments(id),
                       password_reset_token TEXT,
                       reset_password_expires_at TIMESTAMP
--                        created_by INT REFERENCES users(id), -- Track who created this user
--                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE inventory_items (
                                 id SERIAL PRIMARY KEY,
                                 name TEXT NOT NULL,
                                 description TEXT,
                                 unit TEXT,
                                 image_path TEXT,
                                 reorder_level INT DEFAULT 0,
                                 department_id INT REFERENCES departments(id),
                                 UNIQUE (name, department_id)
);


CREATE TABLE inventory_batches (
                                   id SERIAL PRIMARY KEY,
                                   item_id INT REFERENCES inventory_items(id) ON DELETE CASCADE,
                                   quantity INT NOT NULL,
                                   remaining_quantity INT NOT NULL,
                                   unit_price NUMERIC(12, 2) NOT NULL,
                                   batch_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE inventory_issuance (
                                     id SERIAL PRIMARY KEY,
                                     request_item_id INT REFERENCES request_items(id) ON DELETE CASCADE,
                                     batch_id INT REFERENCES inventory_batches(id) ON DELETE CASCADE,
                                     quantity INT NOT NULL,
                                     issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE request_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    CONSTRAINT status_enum CHECK ( name IN ('PENDING', 'APPROVED', 'REJECTED', 'FULFILLED' ) )

);

CREATE TABLE requests (
                          id SERIAL PRIMARY KEY,
                          user_id INT REFERENCES users(id),
                          status_id INT REFERENCES request_status(id),
                          submitted_at TIMESTAMP,
                          approved_by INT REFERENCES users(id),
                          approved_at TIMESTAMP
                          );


CREATE TABLE request_items (
                               id SERIAL PRIMARY KEY,
                               request_id INT REFERENCES requests(id) ON DELETE CASCADE,
                               item_id INT REFERENCES inventory_items(id),
                               quantity INT NOT NULL
);


CREATE TABLE request_status_history (
                                        id SERIAL PRIMARY KEY,
                                        request_id INT REFERENCES requests(id) ON DELETE CASCADE,
                                        status_id INT REFERENCES request_status(id),
                                        changed_by INT REFERENCES users(id),
                                        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE stock_transactions (
                                    id SERIAL PRIMARY KEY,
                                    item_id INT REFERENCES inventory_items(id),
                                    transaction_type VARCHAR(10) CHECK (transaction_type IN ('IN', 'OUT')),
                                    quantity INT NOT NULL,
                                    unit_price NUMERIC(12,2),
                                    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    related_request_id INT REFERENCES requests(id),
                                    supplier TEXT,
                                    invoice_id VARCHAR(20),
                                    created_by INT REFERENCES users(id),
                                    department_id INT REFERENCES departments(id),
                                    batch_id INT REFERENCES inventory_batches(id)
);


CREATE TABLE notifications (
                               id SERIAL PRIMARY KEY,
                               user_id INT REFERENCES users(id),
                               title TEXT NOT NULL,
                               message TEXT NOT NULL,
                               is_read BOOLEAN DEFAULT FALSE,
                               type VARCHAR(50) NOT NULL,
                               related_request_id INT REFERENCES requests(id),
                               related_item_id INT REFERENCES inventory_items(id),
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES carts(id),
    item_id INT REFERENCES inventory_items(id),
    quantity INT CHECK (quantity > 0)
);


CREATE TABLE inventory_balances (
                                    id SERIAL PRIMARY KEY,
                                    item_id INT REFERENCES inventory_items(id),
                                    snapshot_date DATE NOT NULL, -- e.g., '2024-12-31'
                                    quantity INT NOT NULL,       -- total quantity as of this date
                                    total_value NUMERIC(12,2) NOT NULL, -- total value as of this date
                                    department_id INT REFERENCES departments(id),
                                    method VARCHAR(20) NOT NULL CHECK (method IN ('FIFO', 'AVG')), -- cost flow assumption
                                    UNIQUE(item_id, snapshot_date, method, department_id)
);


CREATE TABLE audit_log (
                           id SERIAL PRIMARY KEY,
                           user_id INT REFERENCES users(id),
                           action TEXT NOT NULL, -- e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'APPROVED_REQUEST'
                           entity_type TEXT NOT NULL, -- e.g., 'inventory_item', 'request', 'batch'
                           entity_id INT, -- the actual primary key of the affected entity
                           old_data JSONB, -- state before change (optional for DELETE/UPDATE)
                           new_data JSONB, -- state after change (optional for CREATE/UPDATE)
                           context TEXT, -- optional description/context of the change
                           ip_address TEXT,
                           user_agent TEXT,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




SELECT
    i.id AS item_id,
    u.office_id,
    o.department_id,
    SUM(CASE WHEN s.transaction_type = 'IN' THEN s.quantity ELSE -s.quantity END) AS total_quantity,
    SUM(CASE WHEN s.transaction_type = 'IN' THEN s.quantity * s.unit_price
             WHEN s.transaction_type = 'OUT' THEN -s.quantity * s.unit_price
             ELSE 0 END) AS total_value
FROM stock_transactions s
         JOIN inventory_items i ON s.item_id = i.id
         JOIN requests r ON s.related_request_id = r.id
         JOIN users u ON r.user_id = u.id
         JOIN offices o ON u.office_id = o.id
WHERE o.department_id = :departmentId
  AND s.transaction_date < :snapshotDate
GROUP BY i.id, u.office_id, o.department_id;

