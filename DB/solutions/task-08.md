# Task 08: Implementing CRUD Operations with an ORM

CRUD operations implemented using **Prisma v6** with PostgreSQL.

The full implementation is available in [PR #2](https://github.com/DrArzter/node.js-pre-training-course/pull/2).

## Tasks

### Create a Todo

```javascript
const newTodo = await prisma.todo.create({
  data: {
    title: "Buy groceries",
    description: "Milk, Bread, Eggs",
    status: "active",
    userId: 1,
  },
});
```

### Read Todos

Select all todos:

```javascript
const todos = await prisma.todo.findMany();
```

Filter by status:

```javascript
const activeTodos = await prisma.todo.findMany({
  where: { status: "active" },
});
```

Filter by user:

```javascript
const userTodos = await prisma.todo.findMany({
  where: { userId: 1 },
  include: { user: true },
});
```

### Update a Todo

```javascript
const updated = await prisma.todo.update({
  where: { id: 1 },
  data: { status: "completed" },
});
```

### Delete a Todo

```javascript
await prisma.todo.delete({
  where: { id: 1 },
});
```

## Summary

- Used Prisma Client to perform CRUD operations on the `todos` table.
- `findMany` supports flexible filtering via `where` clause and relation loading via `include`.
- All operations use the primary key (`id`) to identify specific records, consistent with the raw SQL approach from task-02.
- No issues encountered.