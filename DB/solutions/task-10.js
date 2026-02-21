const { PrismaClient } = require("@prisma/client");
const { createClient } = require("redis");

const prisma = new PrismaClient();
const redis = createClient({ url: "redis://localhost:6379" });

const CACHE_TTL = 300; // 5 minutes in seconds

async function connect() {
  await redis.connect();
}

function userCacheKey(userId) {
  return `todos:user:${userId}`;
}

// Read — check cache first, then DB
async function getTodosByUser(userId) {
  const key = userCacheKey(userId);
  const cached = await redis.get(key);

  if (cached) {
    console.log(`[CACHE HIT]  Key: ${key}`);
    return JSON.parse(cached);
  }

  console.log(`[CACHE MISS] Key: ${key} — fetching from DB`);
  const todos = await prisma.todo.findMany({ where: { userId } });

  await redis.setEx(key, CACHE_TTL, JSON.stringify(todos));
  console.log(`[CACHE SET]  Key: ${key}, TTL: ${CACHE_TTL}s`);

  return todos;
}

// Create — invalidate cache after insert
async function createTodo(userId, data) {
  const todo = await prisma.todo.create({
    data: { ...data, userId },
  });
  await redis.del(userCacheKey(userId));
  console.log(`[CACHE DEL]  Key: ${userCacheKey(userId)}`);
  return todo;
}

// Update — invalidate cache after update
async function updateTodo(userId, todoId, data) {
  const todo = await prisma.todo.update({
    where: { id: todoId },
    data,
  });
  await redis.del(userCacheKey(userId));
  console.log(`[CACHE DEL]  Key: ${userCacheKey(userId)}`);
  return todo;
}

// Delete — invalidate cache after delete
async function deleteTodo(userId, todoId) {
  await prisma.todo.delete({ where: { id: todoId } });
  await redis.del(userCacheKey(userId));
  console.log(`[CACHE DEL]  Key: ${userCacheKey(userId)}`);
}

// Demonstrate TTL
async function demonstrateTTL(userId) {
  const ttl = await redis.ttl(userCacheKey(userId));
  console.log(`[TTL CHECK]  Key: ${userCacheKey(userId)}, expires in: ${ttl}s`);
}

async function main() {
  await connect();
  const userId = 1;

  console.log("\n--- 1. First request (cache miss) ---");
  const todos = await getTodosByUser(userId);
  console.log(`   Got ${todos.length} todos`);

  console.log("\n--- 2. Second request (cache hit) ---");
  await getTodosByUser(userId);

  console.log("\n--- 3. TTL check ---");
  await demonstrateTTL(userId);

  console.log("\n--- 4. Create todo (invalidates cache) ---");
  const newTodo = await createTodo(userId, { title: "Walk the dog", status: "active" });
  console.log(`   Created todo id: ${newTodo.id}`);

  console.log("\n--- 5. Request after create (cache miss) ---");
  await getTodosByUser(userId);

  console.log("\n--- 6. Update todo (invalidates cache) ---");
  await updateTodo(userId, newTodo.id, { status: "completed" });

  console.log("\n--- 7. Delete todo (invalidates cache) ---");
  await deleteTodo(userId, newTodo.id);

  console.log("\n--- 8. Final request (cache miss, fresh data) ---");
  const finalTodos = await getTodosByUser(userId);
  console.log(`   Got ${finalTodos.length} todos`);

  await redis.quit();
  await prisma.$disconnect();
}

main().catch(console.error);