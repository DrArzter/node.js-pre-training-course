# Task 06: Indexes and Query Optimization (Raw SQL)

## Tasks

### Create Indexes

```sql
CREATE INDEX idx_status ON todos(status);
```

### Analyze Query Performance

```sql
EXPLAIN ANALYZE SELECT * FROM todos WHERE status = 'pending';
```

## Summary

- Created an index on the `status` column to improve query performance when filtering by status.
- Used `EXPLAIN ANALYZE` to analyze the execution plan of a query that selects todos by `status`, which showed that the index is being utilized effectively, resulting in faster query execution.
- No issues were encountered during this process.
- Documented all commands and queries in [task-06.sql](task-06.sql).