SELECT status, COUNT(*) AS todo_count
FROM todos
GROUP BY status;

SELECT users.name, COUNT(todos.id) AS todo_count
FROM users
LEFT JOIN todos ON users.id = todos.user_id
GROUP BY users.name;

SELECT users.name
FROM users
LEFT JOIN todos ON users.id = todos.user_id
WHERE todos.id IS NULL;