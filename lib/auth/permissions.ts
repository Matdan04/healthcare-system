import { UserRole } from '@/types/auth';

export const ROLE_PERMISSIONS = {
  admin: [
    'user.create',
    'user.read',
    'user.update',
    'user.delete',
    'clinic.manage',
    'reports.view',
    'settings.manage',
  ],
  doctor: [
    'patient.read',
    'patient.update',
    'appointment.manage',
    'prescription.create',
    'medical_record.create',
    'medical_record.read',
    'lab_result.read',
  ],
  nurse: [
    'patient.read',
    'patient.update',
    'appointment.read',
    'medical_record.read',
    'medication.administer',
  ],
  lab_tech: [
    'lab_test.create',
    'lab_test.update',
    'lab_result.create',
    'patient.read',
  ],
  patient: [
    'appointment.create',
    'appointment.read',
    'medical_record.read',
    'prescription.read',
    'profile.update',
  ],
  receptionist: [
    'appointment.create',
    'appointment.read',
    'appointment.update',
    'patient.create',
    'patient.read',
  ],
  pharmacist: [
    'prescription.read',
    'prescription.fulfill',
    'medication.manage',
    'patient.read',
  ],
} as const;

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission as never) || false;
}

export function requirePermission(userRole: UserRole, permission: string) {
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Insufficient permissions. Required: ${permission}`);
  }
}

export function canAccessRole(currentRole: UserRole, targetRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    patient: 1,
    receptionist: 2,
    lab_tech: 3,
    pharmacist: 3,
    nurse: 4,
    doctor: 5,
    admin: 6,
  };

  return roleHierarchy[currentRole] >= roleHierarchy[targetRole];
}