-- Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
    id         SERIAL PRIMARY KEY,
    todo_id    INTEGER NOT NULL,
    action     TEXT    NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function for UPDATE
CREATE OR REPLACE FUNCTION log_todo_update()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (todo_id, action)
    VALUES (NEW.id, 'UPDATE');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for DELETE
CREATE OR REPLACE FUNCTION log_todo_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (todo_id, action)
    VALUES (OLD.id, 'DELETE');
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Attach UPDATE trigger to todos table
CREATE TRIGGER todos_update_trigger
AFTER UPDATE ON todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_update();

-- Attach DELETE trigger to todos table
CREATE TRIGGER todos_delete_trigger
AFTER DELETE ON todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_delete();

-- Verify triggers exist
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_table = 'todos';