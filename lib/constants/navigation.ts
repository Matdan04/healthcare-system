import { 
  Heart, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Bell,
  Search,
  Stethoscope,
  Pill,
  TestTube,
  UserCheck,
  ClipboardList,
  Home,
  Activity,
  Shield,
  Building2
} from 'lucide-react';
import { UserRole } from '@/types/auth';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string;
  children?: Omit<NavItem, 'children'>[];
}

export const navigationItems: NavItem[] = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: Home,
    roles: ['admin', 'doctor', 'nurse', 'lab_tech', 'patient', 'receptionist', 'pharmacist'],
  },
  {
    name: 'Patients',
    href: '/dashboard/patients',
    icon: Users,
    roles: ['admin', 'doctor', 'nurse', 'receptionist'],
    children: [
      { name: 'Patient List', href: '/dashboard/patients', icon: Users, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
      { name: 'Add Patient', href: '/dashboard/patients/new', icon: Users, roles: ['admin', 'receptionist'] },
      { name: 'Patient Search', href: '/dashboard/patients/search', icon: Search, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    ]
  },
  {
    name: 'Appointments',
    href: '/dashboard/appointments',
    icon: Calendar,
    roles: ['admin', 'doctor', 'nurse', 'patient', 'receptionist'],
    badge: '5',
    children: [
      { name: 'Schedule', href: '/dashboard/appointments', icon: Calendar, roles: ['admin', 'doctor', 'nurse', 'patient', 'receptionist'] },
      { name: 'Book Appointment', href: '/dashboard/appointments/book', icon: Calendar, roles: ['patient', 'receptionist'] },
      { name: 'Appointment History', href: '/dashboard/appointments/history', icon: Calendar, roles: ['admin', 'doctor', 'nurse', 'patient', 'receptionist'] },
    ]
  },
  {
    name: 'Medical Records',
    href: '/dashboard/records',
    icon: FileText,
    roles: ['admin', 'doctor', 'nurse', 'patient'],
    children: [
      { name: 'View Records', href: '/dashboard/records', icon: FileText, roles: ['admin', 'doctor', 'nurse', 'patient'] },
      { name: 'Create Record', href: '/dashboard/records/new', icon: FileText, roles: ['admin', 'doctor', 'nurse'] },
      { name: 'Lab Integration', href: '/dashboard/records/lab', icon: TestTube, roles: ['admin', 'doctor', 'nurse'] },
    ]
  },
  {
    name: 'Prescriptions',
    href: '/dashboard/prescriptions',
    icon: Pill,
    roles: ['admin', 'doctor', 'pharmacist', 'patient'],
    children: [
      { name: 'Active Prescriptions', href: '/dashboard/prescriptions', icon: Pill, roles: ['admin', 'doctor', 'pharmacist', 'patient'] },
      { name: 'Create Prescription', href: '/dashboard/prescriptions/new', icon: Pill, roles: ['doctor'] },
      { name: 'Pharmacy Queue', href: '/dashboard/prescriptions/queue', icon: Pill, roles: ['pharmacist'] },
    ]
  },
  {
    name: 'Lab Tests',
    href: '/dashboard/lab-tests',
    icon: TestTube,
    roles: ['admin', 'doctor', 'nurse', 'lab_tech', 'patient'],
    badge: '3',
    children: [
      { name: 'Test Results', href: '/dashboard/lab-tests', icon: TestTube, roles: ['admin', 'doctor', 'nurse', 'lab_tech', 'patient'] },
      { name: 'Order Tests', href: '/dashboard/lab-tests/order', icon: TestTube, roles: ['doctor', 'nurse'] },
      { name: 'Lab Queue', href: '/dashboard/lab-tests/queue', icon: TestTube, roles: ['lab_tech'] },
    ]
  },
  {
    name: 'Staff Management',
    href: '/dashboard/staff',
    icon: UserCheck,
    roles: ['admin'],
    children: [
      { name: 'Staff Directory', href: '/dashboard/staff', icon: UserCheck, roles: ['admin'] },
      { name: 'Add Staff', href: '/dashboard/staff/new', icon: UserCheck, roles: ['admin'] },
      { name: 'Roles & Permissions', href: '/dashboard/staff/permissions', icon: Shield, roles: ['admin'] },
      { name: 'Staff Schedule', href: '/dashboard/staff/schedule', icon: Calendar, roles: ['admin'] },
    ]
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: ClipboardList,
    roles: ['admin', 'doctor'],
    children: [
      { name: 'Patient Reports', href: '/dashboard/reports/patients', icon: ClipboardList, roles: ['admin', 'doctor'] },
      { name: 'Financial Reports', href: '/dashboard/reports/financial', icon: ClipboardList, roles: ['admin'] },
      { name: 'Performance Metrics', href: '/dashboard/reports/performance', icon: Activity, roles: ['admin'] },
    ]
  },
  {
    name: 'Clinic Management',
    href: '/dashboard/clinic',
    icon: Building2,
    roles: ['admin'],
    children: [
      { name: 'Clinic Settings', href: '/dashboard/clinic/settings', icon: Settings, roles: ['admin'] },
      { name: 'Billing & Insurance', href: '/dashboard/clinic/billing', icon: ClipboardList, roles: ['admin'] },
      { name: 'Inventory', href: '/dashboard/clinic/inventory', icon: TestTube, roles: ['admin'] },
    ]
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['admin', 'doctor', 'nurse', 'lab_tech', 'patient', 'receptionist', 'pharmacist'],
    children: [
      { name: 'Profile Settings', href: '/dashboard/settings/profile', icon: Settings, roles: ['admin', 'doctor', 'nurse', 'lab_tech', 'patient', 'receptionist', 'pharmacist'] },
      { name: 'Notification Settings', href: '/dashboard/settings/notifications', icon: Bell, roles: ['admin', 'doctor', 'nurse', 'lab_tech', 'patient', 'receptionist', 'pharmacist'] },
      { name: 'Security Settings', href: '/dashboard/settings/security', icon: Shield, roles: ['admin', 'doctor', 'nurse', 'lab_tech', 'patient', 'receptionist', 'pharmacist'] },
    ]
  },
]; 