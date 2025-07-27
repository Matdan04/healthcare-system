import { prisma } from '../prisma';
import { UserSession } from '@prisma/client';

export interface CreateSessionData {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

export class SessionService {
  static async createSession(data: CreateSessionData): Promise<UserSession> {
    return await prisma.userSession.create({
      data,
    });
  }

  static async endSession(userId: string): Promise<void> {
    await prisma.userSession.updateMany({
      where: {
        userId,
        logoutAt: null,
      },
      data: {
        logoutAt: new Date(),
      },
    });
  }

  static async getUserSessions(userId: string, limit = 10): Promise<UserSession[]> {
    return await prisma.userSession.findMany({
      where: { userId },
      orderBy: { loginAt: 'desc' },
      take: limit,
    });
  }

  static async getActiveSessions(userId: string): Promise<UserSession[]> {
    return await prisma.userSession.findMany({
      where: {
        userId,
        logoutAt: null,
      },
      orderBy: { loginAt: 'desc' },
    });
  }

  static async cleanupOldSessions(olderThanDays = 90): Promise<void> {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

    await prisma.userSession.deleteMany({
      where: {
        loginAt: { lt: cutoffDate },
      },
    });
  }
}