# Task 10: Caching the User's Todo List with Redis

## Tasks

### Set Up Redis

I run Redis locally using Docker:

```bash
docker run -d --name redis -p 6379:6379 redis:7
```

I installed the official Redis client for Node.js:

```bash
npm install redis
```

### Implement Caching for the User's Todo List

The caching strategy uses the key pattern `todos:user:{userId}` with a TTL of 5 minutes.

```javascript
const CACHE_TTL = 300; // 5 minutes in seconds

async function getTodosByUser(userId) {
  const key = `todos:user:${userId}`;
  const cached = await redis.get(key);

  if (cached) {
    console.log(`[CACHE HIT] Key: ${key}`);
    return JSON.parse(cached);
  }

  console.log(`[CACHE MISS] Key: ${key} — fetching from DB`);
  const todos = await prisma.todo.findMany({ where: { userId } });

  await redis.setEx(key, CACHE_TTL, JSON.stringify(todos));
  return todos;
}
```

### Manual Cache Invalidation

Whenever a todo is created, updated, or deleted — the cache for that user is deleted:

```javascript
async function createTodo(userId, data) {
  const todo = await prisma.todo.create({ data: { ...data, userId } });
  await redis.del(`todos:user:${userId}`); // invalidate
  return todo;
}
```

The same pattern applies to `updateTodo` and `deleteTodo`.

### Demonstrate TTL Functionality

```javascript
async function demonstrateTTL(userId) {
  const ttl = await redis.ttl(`todos:user:${userId}`);
  console.log(`Expires in: ${ttl}s`);
}
```

After the TTL expires, the next `getTodosByUser` call results in a cache miss and re-fetches from the database automatically.

## Pull Request

The full implementation (`task-10.js`, Redis setup, `npm install redis`) is available in the pull request:

> [PR #3 — DB-task-10: Redis caching for user todos](https://github.com/DrArzter/node.js-pre-training-course/pull/3)

## Summary

- Set up Redis v7 via Docker on port `6379`.
- Installed the official `redis` npm package for Node.js.
- Implemented a `getTodosByUser` function that checks Redis before querying the database.
- On cache miss, fetches from Prisma and stores the result in Redis with `setEx` (TTL: 5 minutes).
- Cache is manually invalidated on every `create`, `update`, and `delete` operation to keep data consistent.
- TTL ensures stale cache is automatically cleared even without explicit invalidation.
- Full implementation is committed in the dedicated branch and linked via the pull request above.
- **Issue encountered:** Branch `feature/DB-task-10-redis` was created from `main` instead of `feature/DB-task-07-prisma`. As a result, Prisma schema and client were not present and had to be copied manually (`prisma/schema.prisma`) with `npx prisma generate` re-run. Ideally this branch should have been based on the Prisma branch to inherit the existing setup.
