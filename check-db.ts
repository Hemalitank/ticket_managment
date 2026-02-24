import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  const roles = await prisma.role.findMany();
  console.log('Roles:', roles);

  const users = await prisma.user.findMany({ include: { role: true } });
  console.log('Users:', users.map(u => ({ id: u.id, email: u.email, role: u.role.name })));
}

checkData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());