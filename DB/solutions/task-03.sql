SELECT * FROM todos 
WHERE status = 'active';

SELECT * FROM todos 
WHERE status = 'completed';

SELECT * FROM todos 
ORDER BY created_at ASC;

SELECT * FROM todos 
ORDER BY created_at DESC;

SELECT * FROM todos 
WHERE title LIKE '%meeting%' 
OR description LIKE '%meeting%';