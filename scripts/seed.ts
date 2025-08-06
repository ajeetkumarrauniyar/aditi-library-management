import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.tenant.create({
    data: {
      name: "Tenant Three",
      slug: "tenant3",
      users: {
        create: [
          {
            username: "user3",
            email: "user3@tenant3.com",
            password: "hashedpassword",
            verifyCode: "123456",
            verifyCodeExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
            isVerified: true,
            isAdmin: true,
          },
        ],
      },
    },
  });
}

main().finally(() => prisma.$disconnect());
