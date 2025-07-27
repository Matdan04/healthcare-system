import { prisma } from '../prisma';
import { Clinic, SubscriptionPlan } from '@prisma/client';

export interface CreateClinicData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  subscriptionPlan?: SubscriptionPlan;
}

export class ClinicService {
  static async findById(id: string): Promise<Clinic | null> {
    return await prisma.clinic.findUnique({
      where: { id, isActive: true },
    });
  }

  static async findByEmail(email: string): Promise<Clinic | null> {
    return await prisma.clinic.findUnique({
      where: { email: email.toLowerCase(), isActive: true },
    });
  }

  static async findAll(): Promise<Clinic[]> {
    return await prisma.clinic.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  static async create(data: CreateClinicData): Promise<Clinic> {
    return await prisma.clinic.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });
  }

  static async update(id: string, data: Partial<CreateClinicData>): Promise<Clinic> {
    return await prisma.clinic.update({
      where: { id },
      data: {
        ...data,
        ...(data.email && { email: data.email.toLowerCase() }),
      },
    });
  }

  static async getStats(clinicId: string) {
    const [
      totalUsers,
      activeUsers,
      usersByRole,
      recentRegistrations,
    ] = await Promise.all([
      prisma.user.count({
        where: { clinicId },
      }),
      prisma.user.count({
        where: { clinicId, isActive: true },
      }),
      prisma.user.groupBy({
        by: ['role'],
        where: { clinicId, isActive: true },
        _count: { role: true },
      }),
      prisma.user.count({
        where: {
          clinicId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      usersByRole,
      recentRegistrations,
    };
  }
}