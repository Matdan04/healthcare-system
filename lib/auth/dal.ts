import { User, UserRole } from '@/types/auth';
import { UserService } from '@/lib/db/services/user.service';
import { verifySession } from './session';
import { convertRoleToFrontend } from '@/types/auth';

export async function verifyAuth() {
  const session = await verifySession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getUserData(userId: string): Promise<User | null> {
  const session = await verifyAuth();
  
  // Ensure user can only access their own data or has admin privileges
  if (session.user.id !== userId && session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  const prismaUser = await UserService.findById(userId);
  
  if (!prismaUser || prismaUser.clinicId !== session.user.clinicId) {
    return null;
  }

  // Convert Prisma user to frontend user type
  return {
    id: prismaUser.id,
    clinicId: prismaUser.clinicId,
    email: prismaUser.email,
    firstName: prismaUser.firstName,
    lastName: prismaUser.lastName,
    role: convertRoleToFrontend(prismaUser.role),
    phone: prismaUser.phone || undefined,
    licenseNumber: prismaUser.licenseNumber || undefined,
    specialization: prismaUser.specialization || undefined,
    isActive: prismaUser.isActive,
    emailVerified: prismaUser.emailVerified,
  };
}

export async function getClinicUsers(roles?: UserRole[]): Promise<User[]> {
  const session = await verifyAuth();
  
  // Only admins and doctors can view clinic users
  if (!['admin', 'doctor'].includes(session.user.role)) {
    throw new Error('Forbidden');
  }

  const filters: any = {};
  
  if (roles && roles.length > 0) {
    // Convert frontend roles to Prisma roles
    filters.role = roles.map(role => role.toUpperCase())[0]; // Prisma filter takes single role
  }

  const prismaUsers = await UserService.findByClinic(session.user.clinicId, filters);

  // Convert Prisma users to frontend user types
  return prismaUsers.map(user => ({
    id: user.id,
    clinicId: user.clinicId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: convertRoleToFrontend(user.role),
    phone: user.phone || undefined,
    licenseNumber: user.licenseNumber || undefined,
    specialization: user.specialization || undefined,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
  }));
}

export async function getCurrentUserSessions() {
  const session = await verifyAuth();
  const { SessionService } = await import('@/lib/db/services/session.service');
  
  return await SessionService.getUserSessions(session.user.id, 5);
}

export async function updateUserProfile(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  specialization?: string;
}) {
  const session = await verifyAuth();
  
  const updatedUser = await UserService.updateProfile(session.user.id, data);
  
  return {
    id: updatedUser.id,
    clinicId: updatedUser.clinicId,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    role: convertRoleToFrontend(updatedUser.role),
    phone: updatedUser.phone || undefined,
    licenseNumber: updatedUser.licenseNumber || undefined,
    specialization: updatedUser.specialization || undefined,
    isActive: updatedUser.isActive,
    emailVerified: updatedUser.emailVerified,
  };
}