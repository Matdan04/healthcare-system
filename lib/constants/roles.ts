import { 
  Shield,
  Stethoscope,
  Heart,
  TestTube,
  Users,
  UserCheck,
  Pill,
} from 'lucide-react';
import { UserRole } from '@/types/auth';

export const roleColors: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-700 border-red-200',
  doctor: 'bg-green-100 text-green-700 border-green-200',
  nurse: 'bg-pink-100 text-pink-700 border-pink-200',
  lab_tech: 'bg-orange-100 text-orange-700 border-orange-200',
  patient: 'bg-blue-100 text-blue-700 border-blue-200',
  receptionist: 'bg-purple-100 text-purple-700 border-purple-200',
  pharmacist: 'bg-teal-100 text-teal-700 border-teal-200',
};

export const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  admin: Shield,
  doctor: Stethoscope,
  nurse: Heart,
  lab_tech: TestTube,
  patient: Users,
  receptionist: UserCheck,
  pharmacist: Pill,
};

export const roleDisplayNames: Record<UserRole, string> = {
  admin: 'Administrator',
  doctor: 'Doctor',
  nurse: 'Nurse',
  lab_tech: 'Lab Technician',
  patient: 'Patient',
  receptionist: 'Receptionist',
  pharmacist: 'Pharmacist',
}; 