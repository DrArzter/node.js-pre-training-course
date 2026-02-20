# Task 04: Creating a Users Table and Linking Todos to Users with a Foreign Key (Raw SQL)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Since the `todos` table already has a `user_id` column, (created in [task-01](../tasks/task-01.md)) we need to add a foreign key constraint to link it to the `users` table. This will ensure that each todo is associated with a valid user.

```sql
ALTER TABLE todos
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;
```

## Summary

- Created a new `users` table with the specified columns and constraints.
- Altered the `todos` table to add a foreign key constraint linking `user_id` to `users(id)`.
- No issues were encountered during the execution of the SQL statements.
- SQL queries are documented in this [solution file](task-04.sql).
