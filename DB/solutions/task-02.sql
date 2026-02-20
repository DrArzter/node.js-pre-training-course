INSERT INTO todos (title, description, status, user_id)
VALUES ('Buy groceries', 'Milk, Bread, Eggs', 'pending', 1);

SELECT * FROM todos;

UPDATE todos
SET status = 'completed'
WHERE id = 1;

DELETE FROM todos
WHERE id = 1;