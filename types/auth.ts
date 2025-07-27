import { UserRole as PrismaUserRole } from '@prisma/client';

export interface User {
  id: string;
  clinicId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  licenseNumber?: string;
  specialization?: string;
  isActive: boolean;
  emailVerified: boolean;
}

// Convert Prisma enum to lowercase for frontend use
export type UserRole = 
  | 'admin' 
  | 'doctor' 
  | 'nurse' 
  | 'lab_tech' 
  | 'patient' 
  | 'receptionist' 
  | 'pharmacist';

// Helper to convert between Prisma and frontend enums
export const convertRoleToFrontend = (prismaRole: PrismaUserRole): UserRole => {
  return prismaRole.toLowerCase() as UserRole;
};

export const convertRoleToPrisma = (frontendRole: UserRole): PrismaUserRole => {
  return frontendRole.toUpperCase() as PrismaUserRole;
};

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  clinicId: string;
  iat: number;
  exp: number;
}

export interface Session {
  user: User;
  accessToken: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}