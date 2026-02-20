# Task 07: Connecting Your Todo Project to a Database Using an ORM

## Tasks

### Choose and Install an ORM

I chose to use Prisma as the ORM for my Node.js project.

> **Note:** When initially installing Prisma, the latest version (v7.4.1) was installed. However, Prisma v7 introduced a breaking change — the `url` property in `datasource` block of `schema.prisma` is no longer supported and must be moved to a separate `prisma.config.ts` file. Since this approach adds unnecessary complexity for a learning project, I downgraded to **Prisma v6** which still uses the familiar `schema.prisma` configuration.

I installed Prisma v6 and the required database drivers using the following commands:

```bash
npm install @prisma/client@6
npm install prisma@6 --save-dev
```

### Configure the ORM

I set up Prisma to connect to my existing PostgreSQL database. I created a `.env` file in the root of my project and added the following connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"
```

### Define Models and Run Migrations

I defined the models for the `users` and `todos` tables in the `prisma/schema.prisma` file as follows:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id         Int      @id @default(autoincrement())
  name       String
  email      String   @unique
  createdAt  DateTime @default(now()) @map("created_at")
  todos      Todo[]
}

model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String   @default("active")
  createdAt   DateTime @default(now()) @map("created_at")
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

I then ran the following command to create the tables in my database:

```bash
npx prisma migrate dev --name init
```

### Write a Seed Script

I created a seed script in `prisma/seed.js` to populate the database with initial data:

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      name: "drarzter",
      email: "drarzter@gmail.com",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: "drarzera",
      email: "drarzera@gmail.com",
    },
  });

  await prisma.todo.createMany({
    data: [
      { title: "Buy groceries", status: "pending", userId: user1.id },
      { title: "Clean the house", status: "completed", userId: user1.id },
      { title: "Finish project", status: "pending", userId: user1.id },
      { title: "Go for a run", status: "pending", userId: user2.id },
      { title: "Read a book", status: "completed", userId: user2.id },
      { title: "Cook dinner", status: "pending", userId: user2.id },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

I ran the seed script using the following command:

```bash
node prisma/seed.js
```

## Pull Request

The full implementation (Prisma schema, migration, and seed script) is available in the pull request:

> PR link will be added after creation

## Summary

- I successfully connected my todo project to a PostgreSQL database using Prisma as the ORM.
- I defined the models for `users` and `todos` with all fields matching the raw SQL schema (`description`, `createdAt`, `onDelete: Cascade`), ran migrations to create the tables, and wrote a seed script to populate the database with initial data.
- The actual Prisma files (`schema.prisma`, `seed.js`) are committed in the dedicated branch and linked via the pull request above.
- **Issue encountered:** Prisma v7 was installed initially but it introduced a breaking change — `url` in `datasource` is no longer supported in `schema.prisma`. Downgraded to Prisma v6 to use the standard configuration approach.
- Additionally, the database already contained tables created via raw SQL from previous tasks, which caused a migration drift error. The `todo_app` schema was reset (`prisma migrate reset`) to let Prisma fully manage it from scratch.
