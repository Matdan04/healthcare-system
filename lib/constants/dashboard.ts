import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Heart,
  Activity,
  Pill,
  TestTube
} from 'lucide-react';

export interface DashboardCard {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: string;
}

export const COMMON_CARDS: DashboardCard[] = [
  {
    title: 'Today\'s Appointments',
    value: '12',
    description: '3 upcoming, 9 completed',
    icon: Calendar,
    trend: { value: '+2 from yesterday', isPositive: true },
    color: 'text-blue-600',
  },
];

export const ROLE_SPECIFIC_CARDS: Record<string, DashboardCard[]> = {
  doctor: [
    {
      title: 'Active Patients',
      value: '127',
      description: '8 new this week',
      icon: Users,
      trend: { value: '+12%', isPositive: true },
      color: 'text-green-600',
    },
    {
      title: 'Pending Reviews',
      value: '5',
      description: 'Lab results awaiting review',
      icon: FileText,
      color: 'text-orange-600',
    },
    {
      title: 'Prescriptions',
      value: '23',
      description: 'Issued today',
      icon: Pill,
      color: 'text-purple-600',
    },
  ],
  nurse: [
    {
      title: 'Patients Assigned',
      value: '45',
      description: '12 requiring immediate attention',
      icon: Heart,
      color: 'text-pink-600',
    },
    {
      title: 'Medications Due',
      value: '8',
      description: 'Next 2 hours',
      icon: Clock,
      color: 'text-red-600',
    },
    {
      title: 'Vital Signs',
      value: '15',
      description: 'Recorded today',
      icon: Activity,
      color: 'text-blue-600',
    },
  ],
  lab_tech: [
    {
      title: 'Pending Tests',
      value: '18',
      description: '5 urgent priority',
      icon: TestTube,
      color: 'text-orange-600',
    },
    {
      title: 'Completed Today',
      value: '32',
      description: 'Results ready',
      icon: TrendingUp,
      trend: { value: '+15%', isPositive: true },
      color: 'text-green-600',
    },
  ],
  patient: [
    {
      title: 'Next Appointment',
      value: 'Tomorrow',
      description: 'Dr. Smith at 2:00 PM',
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'Medications',
      value: '3 Active',
      description: '1 refill needed',
      icon: Pill,
      color: 'text-purple-600',
    },
    {
      title: 'Test Results',
      value: '2 New',
      description: 'Available for review',
      icon: TestTube,
      color: 'text-green-600',
    },
  ],
  admin: [
    {
      title: 'Total Staff',
      value: '48',
      description: '2 new hires this month',
      icon: Users,
      trend: { value: '+4%', isPositive: true },
      color: 'text-green-600',
    },
    {
      title: 'System Alerts',
      value: '3',
      description: '1 requiring attention',
      icon: AlertCircle,
      color: 'text-red-600',
    },
    {
      title: 'Daily Revenue',
      value: '$12,450',
      description: 'Target: $15,000',
      icon: TrendingUp,
      color: 'text-green-600',
    },
  ],
  receptionist: [
    {
      title: 'Today\'s Check-ins',
      value: '28',
      description: '15 completed, 13 pending',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Appointment Requests',
      value: '7',
      description: 'Awaiting scheduling',
      icon: Calendar,
      color: 'text-orange-600',
    },
  ],
  pharmacist: [
    {
      title: 'Pending Orders',
      value: '15',
      description: '3 requiring verification',
      icon: Pill,
      color: 'text-purple-600',
    },
    {
      title: 'Inventory Alerts',
      value: '4',
      description: 'Low stock items',
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ],
};

export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  admin: 'Administrator',
  doctor: 'Doctor',
  nurse: 'Nurse',
  lab_tech: 'Lab Technician',
  patient: 'Patient',
  receptionist: 'Receptionist',
  pharmacist: 'Pharmacist',
};

export const getDashboardData = (role: string): DashboardCard[] => {
  return [...COMMON_CARDS, ...(ROLE_SPECIFIC_CARDS[role] || [])];
}; 