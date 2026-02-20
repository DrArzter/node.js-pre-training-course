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
      { title: "Buy groceries", description: "Milk, Bread, Eggs", status: "pending", userId: user1.id },
      { title: "Clean the house", status: "completed", userId: user1.id },
      { title: "Finish project", description: "Complete the Node.js pre-training course", status: "pending", userId: user1.id },
      { title: "Go for a run", status: "pending", userId: user2.id },
      { title: "Read a book", status: "completed", userId: user2.id },
      { title: "Cook dinner", status: "pending", userId: user2.id },
    ],
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });