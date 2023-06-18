import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Get all users
 */
export const getUsers = async () => {
  return await prisma.user.findMany();
};
