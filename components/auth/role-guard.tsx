'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, User } from '@/types/auth';
import { hasPermission } from '@/lib/auth/permissions';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  requiredPermission,
  fallback = <div>Access Denied</div>,
  redirectTo = '/login'
}: RoleGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push(redirectTo);
          return;
        }
      } catch (error) {
        router.push(redirectTo);
        return;
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, redirectTo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return fallback;
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return fallback;
  }

  return <>{children}</>;
}