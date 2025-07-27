'use client';

import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface DashboardCard {
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

const getDashboardData = (role: string): DashboardCard[] => {
  const commonCards = [
    {
      title: 'Today\'s Appointments',
      value: '12',
      description: '3 upcoming, 9 completed',
      icon: Calendar,
      trend: { value: '+2 from yesterday', isPositive: true },
      color: 'text-blue-600',
    },
  ];

  const roleSpecificCards: Record<string, DashboardCard[]> = {
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

  return [...commonCards, ...(roleSpecificCards[role] || [])];
};

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const dashboardCards = getDashboardData(user.role);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      admin: 'Administrator',
      doctor: 'Doctor',
      nurse: 'Nurse',
      lab_tech: 'Lab Technician',
      patient: 'Patient',
      receptionist: 'Receptionist',
      pharmacist: 'Pharmacist',
    };
    return roleNames[role] || role;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[var(--color-healthcare-primary)] to-[var(--color-healthcare-secondary)] rounded-xl p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, Dr. {user.firstName}!
            </h1>
            <p className="text-blue-100 text-lg">
              Welcome back to your {getRoleDisplayName(user.role).toLowerCase()} dashboard
            </p>
          </div>
          <div className="sm:text-right">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{card.value}</div>
                  <p className="text-sm text-gray-600 mb-3">
                    {card.description}
                  </p>
                  {card.trend && (
                    <div className={`text-sm flex items-center font-medium ${
                      card.trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-4 w-4 mr-2 ${card.trend.isPositive ? '' : 'rotate-180'}`} />
                      {card.trend.value}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="grid gap-8 lg:grid-cols-3">
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
            {user.role === 'doctor' && (
              <>
                <Button className="w-full justify-start h-11 font-medium" variant="outline">
                  <Users className="mr-3 h-4 w-4" />
                  View Patient List
                </Button>
                <Button className="w-full justify-start h-11 font-medium" variant="outline">
                  <Calendar className="mr-3 h-4 w-4" />
                  Schedule Appointment
                </Button>
                <Button className="w-full justify-start h-11 font-medium" variant="outline">
                  <FileText className="mr-3 h-4 w-4" />
                  Create Prescription
                </Button>
              </>
            )}
            {user.role === 'nurse' && (
              <>
                <Button className="w-full justify-start h-11 font-medium" variant="outline">
                  <Heart className="mr-3 h-4 w-4" />
                  Record Vital Signs
                </Button>
                <Button className="w-full justify-start h-11 font-medium" variant="outline">
                  <Pill className="mr-3 h-4 w-4" />
                  Administer Medication
                </Button>
                <Button className="w-full justify-start h-11 font-medium" variant="outline">
                  <Users className="mr-3 h-4 w-4" />
                  Patient Check-in
                </Button>
              </>
            )}
            {user.role === 'patient' && (
              <>
                <Button className="w-full justify-start h-11 font-medium" variant="outline">
                  <Calendar className="mr-3 h-4 w-4" />
                  Book Appointment
                </Button>
                <Button className="w-full justify-start h-11 font-medium" variant="outline">
                  <FileText className="mr-3 h-4 w-4" />
                  View Medical Records
                </Button>
                <Button className="w-full justify-start h-11 font-medium" variant="outline">
                  <TestTube className="mr-3 h-4 w-4" />
                  Lab Results
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-600">Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Lab results updated</p>
                  <p className="text-sm text-gray-600">Patient #1234 - Blood work completed</p>
                  <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">New appointment booked</p>
                  <p className="text-sm text-gray-600">Dr. Smith - Tomorrow 3:00 PM</p>
                  <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="w-3 h-3 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Prescription ready</p>
                  <p className="text-sm text-gray-600">Medication available for pickup</p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                <AlertCircle className="w-4 h-4 text-green-600" />
              </div>
              System Status
            </CardTitle>
            <CardDescription className="text-gray-600">Platform health and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-900">System Status</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-900">Database</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-900">Backup Status</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">Complete</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-900">Last Update</span>
                <span className="text-sm text-gray-600">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}