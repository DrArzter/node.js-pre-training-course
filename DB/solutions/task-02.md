# Task 02: Basic CRUD Operations on the "todos" Table with Raw SQL

## Tasks

### Creating a new todo

```sql
INSERT INTO todos (title, description, status, user_id)
VALUES ('Buy groceries', 'Milk, Bread, Eggs', 'pending', 1);
```

### Selecting all todos

```sql
SELECT * FROM todos;
```

### Updating the status of a todo

```sql
UPDATE todos
SET status = 'completed'
WHERE id = 1;
```

### Deleting a todo

```sql
DELETE FROM todos
WHERE id = 1;
```

## Summary

- Inserted a new todo item into the `todos` table with the title "Buy groceries".
- Selected all todos to verify the insertion.
- Updated the status of the todo with `id = 1` to "completed".
- Deleted the todo with `id = 1` from the table.
- Encountered no issues during the execution of the SQL statements.
- SQL queries are documented in this [solution file](task-02.sql).
