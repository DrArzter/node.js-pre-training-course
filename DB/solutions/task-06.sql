CREATE INDEX idx_status ON todos(status);

EXPLAIN ANALYZE SELECT * FROM todos WHERE status = 'pending';