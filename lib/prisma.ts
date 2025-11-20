import 'dotenv/config';
import { PrismaClient } from '../prisma/client/client';

const enginePath = process.env.PRISMA_QUERY_ENGINE_LIBRARY;
if (enginePath) {
  console.log('Using custom Prisma query engine path:', enginePath);
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
