import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FileText, 
  Heart,
  Pill,
  TestTube,
  Activity,
  Settings,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react';

interface QuickActionsProps {
  userRole: string;
}

const ROLE_ACTIONS = {
  doctor: [
    { icon: Users, label: 'View Patient List' },
    { icon: Calendar, label: 'Schedule Appointment' },
    { icon: FileText, label: 'Create Prescription' },
  ],
  nurse: [
    { icon: Heart, label: 'Record Vital Signs' },
    { icon: Pill, label: 'Administer Medication' },
    { icon: Users, label: 'Patient Check-in' },
  ],
  patient: [
    { icon: Calendar, label: 'Book Appointment' },
    { icon: FileText, label: 'View Medical Records' },
    { icon: TestTube, label: 'Lab Results' },
  ],
  admin: [
    { icon: Users, label: 'Manage Users' },
    { icon: Settings, label: 'System Settings' },
    { icon: TrendingUp, label: 'View Reports' },
  ],
  receptionist: [
    { icon: Users, label: 'Patient Check-in' },
    { icon: Calendar, label: 'Schedule Appointments' },
    { icon: FileText, label: 'Update Records' },
  ],
  pharmacist: [
    { icon: Pill, label: 'Process Prescriptions' },
    { icon: AlertCircle, label: 'Check Inventory' },
    { icon: FileText, label: 'Drug Information' },
  ],
  lab_tech: [
    { icon: TestTube, label: 'Process Samples' },
    { icon: Clock, label: 'Update Results' },
    { icon: FileText, label: 'Generate Reports' },
  ],
};

export function QuickActions({ userRole }: QuickActionsProps) {
  const actions = ROLE_ACTIONS[userRole as keyof typeof ROLE_ACTIONS] || [];

  if (actions.length === 0) return null;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          Quick Actions
        </CardTitle>
        <CardDescription className="text-gray-600">Common tasks for your role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button key={index} className="w-full justify-start h-11 font-medium" variant="outline">
              <Icon className="mr-3 h-4 w-4" />
              {action.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
} 