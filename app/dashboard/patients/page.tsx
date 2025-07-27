// src/app/dashboard/patients/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { UserManagement } from '@/components/admin/user-management';
import { PatientDashboard } from '@/components/patient/patient-dashboard';
import { useAuth } from '@/context/auth-context';

export default function PatientsPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-muted-foreground">
              Manage patient information and medical records
            </p>
          </div>
        </div>

        {user?.role === 'admin' && <UserManagement />}
        {user?.role === 'patient' && <PatientDashboard />}
        
        {/* Add other role-specific components */}
      </div>
    </ProtectedRoute>
  );
}