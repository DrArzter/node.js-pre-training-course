# Task 09: Implementing an Audit Log Trigger (Raw SQL)

## Tasks

### Create the `audit_log` Table

```sql
CREATE TABLE IF NOT EXISTS audit_log (
    id         SERIAL PRIMARY KEY,
    todo_id    INTEGER NOT NULL,
    action     TEXT    NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Create a Trigger for Updates

In PostgreSQL, a trigger requires a **trigger function** returning `TRIGGER`, and a separate `CREATE TRIGGER` statement that binds it to a table event.

```sql
CREATE OR REPLACE FUNCTION log_todo_update()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (todo_id, action)
    VALUES (NEW.id, 'UPDATE');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER todos_update_trigger
AFTER UPDATE ON todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_update();
```

- `NEW` refers to the row after the update.
- `AFTER UPDATE` means the trigger fires after the row is already changed.

### Create a Trigger for Deletes

```sql
CREATE OR REPLACE FUNCTION log_todo_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (todo_id, action)
    VALUES (OLD.id, 'DELETE');
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER todos_delete_trigger
AFTER DELETE ON todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_delete();
```

- `OLD` refers to the row before deletion (since `NEW` does not exist for DELETE).

### Verify Triggers

```sql
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_table = 'todos';
```

### Test the Triggers

```sql
-- Trigger an UPDATE
UPDATE todos SET status = 'completed' WHERE id = 1;

-- Trigger a DELETE
DELETE FROM todos WHERE id = 2;

-- Check audit log
SELECT * FROM audit_log;
```

## Summary

- Created `audit_log` table to record changes to `todos`.
- Implemented two separate trigger functions (`log_todo_update`, `log_todo_delete`) using PL/pgSQL.
- Used `NEW.id` in the UPDATE trigger and `OLD.id` in the DELETE trigger to capture the correct row reference.
- Both triggers fire `AFTER` the operation, ensuring the action has already completed before logging.
- All SQL queries are documented in [task-09.sql](task-09.sql).