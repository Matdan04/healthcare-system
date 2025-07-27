import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'unhealthy', error: (error as Error).message, timestamp: new Date().toISOString() };
  }
}

export async function getDatabaseStats() {
  try {
    const [clinics, users, sessions, tokens] = await Promise.all([
      prisma.clinic.count(),
      prisma.user.count(),
      prisma.userSession.count(),
      prisma.refreshToken.count(),
    ]);

    return {
      clinics,
      users,
      sessions,
      tokens,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to get database stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function cleanupExpiredData() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [expiredTokens, oldSessions] = await Promise.all([
      // Clean expired refresh tokens
      prisma.refreshToken.deleteMany({
        where: {
          expiresAt: { lt: new Date() },
        },
      }),
      // Clean old logged-out sessions
      prisma.userSession.deleteMany({
        where: {
          loginAt: { lt: thirtyDaysAgo },
          logoutAt: { not: null },
        },
      }),
    ]);

    return {
      expiredTokensRemoved: expiredTokens.count,
      oldSessionsRemoved: oldSessions.count,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new Error(`Failed to cleanup expired data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Type-safe query builder helpers
export const createUserInclude = {
  clinic: true,
  refreshTokens: true,
  sessions: {
    orderBy: { loginAt: 'desc' as const },
    take: 5,
  },
} satisfies Prisma.UserInclude;

export const createClinicInclude = {
  users: {
    where: { isActive: true },
    orderBy: [
      { role: 'asc' as const },
      { lastName: 'asc' as const },
    ],
  },
} satisfies Prisma.ClinicInclude;

// Pagination helper
export function createPaginationArgs(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  return {
    skip,
    take: limit,
  };
}

// Search helper
export function createUserSearchWhere(searchTerm: string, clinicId: string) {
  return {
    AND: [
      { clinicId },
      {
        OR: [
          { firstName: { contains: searchTerm } },
          { lastName: { contains: searchTerm } },
          { email: { contains: searchTerm } },
          { phone: { contains: searchTerm } },
          { licenseNumber: { contains: searchTerm } },
        ],
      },
    ],
  } satisfies Prisma.UserWhereInput;
}