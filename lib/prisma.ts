import 'dotenv/config';
import { PrismaClient } from '../prisma/client/client';
import path from 'path';
import fs from 'fs';

// Dynamically set PRISMA_QUERY_ENGINE_LIBRARY if not already set
if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  // Resolve the binary location relative to the generated client
  const enginePath = path.resolve(process.cwd(), 'prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node');

  // Check if it exists before setting
  if (fs.existsSync(enginePath)) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
    console.log('PRISMA_QUERY_ENGINE_LIBRARY set to:', enginePath);
  } else {
    console.warn('Prisma query engine binary not found. Make sure prisma generate ran successfully:', enginePath);
  }
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
