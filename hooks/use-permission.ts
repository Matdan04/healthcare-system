import { useAuth } from '@/context/auth-context';
import { hasPermission, canAccessRole } from '@/lib/auth/permissions';
import { UserRole } from '@/types/auth';

export function usePermissions() {
  const { user } = useAuth();

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  const checkRoleAccess = (targetRole: UserRole): boolean => {
    if (!user) return false;
    return canAccessRole(user.role, targetRole);
  };

  return {
    user,
    hasPermission: checkPermission,
    canAccessRole: checkRoleAccess,
    isAdmin: user?.role === 'admin',
    isDoctor: user?.role === 'doctor',
    isNurse: user?.role === 'nurse',
    isPatient: user?.role === 'patient',
    isLabTech: user?.role === 'lab_tech',
    isReceptionist: user?.role === 'receptionist',
    isPharmacist: user?.role === 'pharmacist',
 };
}