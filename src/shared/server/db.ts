import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'node:path';

import { PrismaClient } from '../../generated/prisma/client.js';

// Get database URL from environment or construct from path
// In production: DATABASE_URL is set in PM2 ecosystem config
// In development: Use specLens.db in project root
const getDbUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const dbPath = path.resolve(process.cwd(), 'specLens.db');
  return `file://${dbPath}`;
};

const dbUrl = getDbUrl();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaLibSql({ url: dbUrl });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
