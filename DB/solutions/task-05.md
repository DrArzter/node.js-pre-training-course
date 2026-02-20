# Task 05: Aggregation and Grouping in SQL (Raw SQL)

## Tasks

### Count Todos by Status

```sql
SELECT status, COUNT(*) AS todo_count
FROM todos
GROUP BY status;
```

### Count Todos per User

```sql
SELECT users.name, COUNT(todos.id) AS todo_count
FROM users
LEFT JOIN todos ON users.id = todos.user_id
GROUP BY users.name;
```

### Find Users with No Todos

```sql
SELECT users.name
FROM users
LEFT JOIN todos ON users.id = todos.user_id
WHERE todos.id IS NULL;
```

## Summary

- Counted the number of todos for each status using `GROUP BY`.
- Counted the number of todos for each user by joining the `users` and `todos` tables and grouping by user name.
- Found users with no todos by performing a left join and filtering for null values in the `todos` table.
- No issues were encountered during the execution of these queries.
- All quries are documented in [task-05.sql](task-05.sql).
