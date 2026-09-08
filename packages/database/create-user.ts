import { prisma } from "./src";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: "test123",
      username: "testuser",
    },
  });

  console.log("User created:");
  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });