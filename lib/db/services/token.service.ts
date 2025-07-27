import { prisma } from '../prisma';
import { RefreshToken, User } from '@prisma/client';
import crypto from 'crypto';

export class TokenService {
  static async createRefreshToken(userId: string, token: string): Promise<RefreshToken> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Clean up old tokens for this user
    await this.cleanupExpiredTokens(userId);

    return await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  static async findValidToken(userId: string, token: string): Promise<(RefreshToken & { user: User }) | null> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    return await prisma.refreshToken.findFirst({
      where: {
        userId,
        tokenHash,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: {
            clinic: true,
          },
        },
      },
    });
  }

  static async deleteToken(userId: string, token: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        tokenHash,
      },
    });
  }

  static async deleteAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  static async cleanupExpiredTokens(userId?: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        ...(userId && { userId }),
        expiresAt: { lt: new Date() },
      },
    });
  }
}