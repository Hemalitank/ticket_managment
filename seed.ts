import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: { name: 'MANAGER' },
  });

  const supportRole = await prisma.role.upsert({
    where: { name: 'SUPPORT' },
    update: {},
    create: { name: 'SUPPORT' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' },
  });

  // Create a manager user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      name: 'Manager User',
      email: 'manager@example.com',
      password: hashedPassword,
      role_id: managerRole.id,
    },
  });

  // Create a support user
  const support = await prisma.user.upsert({
    where: { email: 'support@example.com' },
    update: {},
    create: {
      name: 'Support User',
      email: 'support@example.com',
      password: hashedPassword,
      role_id: supportRole.id,
    },
  });

  // Create a regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      role_id: userRole.id,
    },
  });

  console.log('Seeded users:', { manager, support, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });