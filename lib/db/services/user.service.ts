import { prisma } from '../prisma';
import { UserRole, User, Clinic } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  clinicId: string;
  phone?: string;
  licenseNumber?: string;
  specialization?: string;
}

export interface UserWithClinic extends User {
  clinic: Clinic;
}

export class UserService {
  static async findById(id: string): Promise<UserWithClinic | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: { clinic: true },
    });
  }

  static async findByEmail(email: string): Promise<UserWithClinic | null> {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { clinic: true },
    });
  }

  static async findByClinic(clinicId: string, filters?: {
    role?: UserRole;
    isActive?: boolean;
  }): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        clinicId,
        ...(filters?.role && { role: filters.role }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      },
      orderBy: [
        { role: 'asc' },
        { lastName: 'asc' },
        { firstName: 'asc' },
      ],
    });
  }

  static async create(data: CreateUserData): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 12);

    return await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        clinicId: data.clinicId,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        specialization: data.specialization,
      },
    });
  }

  static async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  static async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    specialization?: string;
  }): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  static async toggleActiveStatus(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });
  }

  static async delete(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.passwordHash);
  }

  static async changePassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}