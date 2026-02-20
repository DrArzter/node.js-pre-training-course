# Task 03: Filtering and Sorting Todos with Raw SQL

## Tasks

### Filter by Status

Select all active todos:

```sql
SELECT * FROM todos 
WHERE status = 'active';
```

Select all completed todos:

```sql
SELECT * FROM todos 
WHERE status = 'completed';
```

### Sort by Creation Date

Select all todos sorted by creation date in ascending order:

```sql
SELECT * FROM todos 
ORDER BY created_at ASC;
```

Select all todos sorted by creation date in descending order:

```sql
SELECT * FROM todos 
ORDER BY created_at DESC;
```

### Search by Keyword

Select all todos where the title or description contains the keyword 'meeting':

```sql
SELECT * FROM todos 
WHERE title LIKE '%meeting%' 
OR description LIKE '%meeting%';
```

## Summary

- Filtered todos based on their status (active and completed).
- Sorted todos by their creation date in both ascending and descending order.
- Searched for todos containing a specific keyword in their title or description.
- No issues were encountered during the execution of these queries.
- All SQL queries are documented in [this file](task-03.sql).
