'use client';

import { usePermissions } from '@/hooks/use-permission';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function PatientList() {
  const { hasPermission, canAccessRole } = usePermissions();

  return (
    <div className="space-y-4">
      {/* Only show create button if user has permission */}
      {hasPermission('patient.create') && (
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      )}

      {/* Patient list with conditional action buttons */}
      <div className="space-y-2">
        {/* Your patient list mapping */}
        <div className="flex items-center justify-between p-4 border rounded">
          <div>Patient Name</div>
          <div className="space-x-2">
            {hasPermission('patient.update') && (
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {hasPermission('patient.delete') && (
              <Button size="sm" variant="outline">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}