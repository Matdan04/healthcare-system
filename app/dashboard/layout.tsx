'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Heart, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
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

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/types/auth';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string;
  children?: Omit<NavItem, 'children'>[];
}

const navigationItems: NavItem[] = [
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

const roleColors: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-700 border-red-200',
  doctor: 'bg-green-100 text-green-700 border-green-200',
  nurse: 'bg-pink-100 text-pink-700 border-pink-200',
  lab_tech: 'bg-orange-100 text-orange-700 border-orange-200',
  patient: 'bg-blue-100 text-blue-700 border-blue-200',
  receptionist: 'bg-purple-100 text-purple-700 border-purple-200',
  pharmacist: 'bg-teal-100 text-teal-700 border-teal-200',
};

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  admin: Shield,
  doctor: Stethoscope,
  nurse: Heart,
  lab_tech: TestTube,
  patient: Users,
  receptionist: UserCheck,
  pharmacist: Pill,
};

const roleDisplayNames: Record<UserRole, string> = {
  admin: 'Administrator',
  doctor: 'Doctor',
  nurse: 'Nurse',
  lab_tech: 'Lab Technician',
  patient: 'Patient',
  receptionist: 'Receptionist',
  pharmacist: 'Pharmacist',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Auto-expand current section
  useEffect(() => {
    const currentSection = navigationItems.find(item => 
      item.children?.some(child => child.href === pathname) || item.href === pathname
    );
    
    if (currentSection && currentSection.children && !expandedItems.includes(currentSection.name)) {
      setExpandedItems(prev => [...prev, currentSection.name]);
    }
  }, [pathname, expandedItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[var(--color-healthcare-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  ).map(item => ({
    ...item,
    children: item.children?.filter(child => child.roles.includes(user.role))
  }));

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const RoleIcon = roleIcons[user.role];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-healthcare-primary)] to-[var(--color-healthcare-secondary)] rounded-lg flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">HealthCare</span>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                <AvatarImage src="" alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="bg-[var(--color-healthcare-primary)] text-white font-semibold">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-600 truncate mb-1">{user.email}</p>
                <Badge variant="secondary" className={cn("text-xs", roleColors[user.role])}>
                  <RoleIcon className="w-3 h-3 mr-1" />
                  {roleDisplayNames[user.role]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.children && item.children.some(child => pathname === child.href));
                const isExpanded = expandedItems.includes(item.name);
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <div key={item.name}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-10 px-3 text-left font-medium transition-all duration-200",
                        isActive 
                          ? "bg-[var(--color-healthcare-primary)]/10 text-[var(--color-healthcare-primary)] border-r-2 border-[var(--color-healthcare-primary)]" 
                          : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
                      )}
                      onClick={() => {
                        if (hasChildren) {
                          toggleExpanded(item.name);
                        } else {
                          router.push(item.href);
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="flex-1 truncate">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs bg-red-100 text-red-700">
                          {item.badge}
                        </Badge>
                      )}
                      {hasChildren && (
                        <div className={cn(
                          "ml-2 transition-transform duration-200",
                          isExpanded ? "rotate-90" : "rotate-0"
                        )}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </Button>

                    {/* Submenu */}
                    {hasChildren && isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = pathname === child.href;
                          
                          return (
                            <Button
                              key={child.name}
                              variant="ghost"
                              className={cn(
                                "w-full justify-start h-8 px-3 text-left text-sm transition-all duration-200",
                                isChildActive 
                                  ? "bg-[var(--color-healthcare-primary)]/5 text-[var(--color-healthcare-primary)] font-medium" 
                                  : "hover:bg-gray-50 hover:text-gray-900 text-gray-600"
                              )}
                              onClick={() => {
                                router.push(child.href);
                                setSidebarOpen(false);
                              }}
                            >
                              <ChildIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                              <span className="truncate">{child.name}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search patients, appointments, records..."
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-[var(--color-healthcare-primary)] focus:ring-[var(--color-healthcare-primary)] bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Quick actions based on role */}
              {user.role === 'doctor' && (
                <Button size="sm" className="hidden sm:flex bg-[var(--color-healthcare-primary)] hover:bg-[var(--color-healthcare-primary)]/90">
                  <Calendar className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              )}

              {user.role === 'receptionist' && (
                <Button size="sm" className="hidden sm:flex bg-[var(--color-healthcare-secondary)] hover:bg-[var(--color-healthcare-secondary)]/90">
                  <Users className="w-4 h-4 mr-2" />
                  Check-in Patient
                </Button>
              )}

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100">
                    <Avatar className="h-10 w-10 border-2 border-gray-200">
                      <AvatarImage src="" alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback className="bg-[var(--color-healthcare-primary)] text-white text-sm font-semibold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge variant="secondary" className={cn("text-xs w-fit", roleColors[user.role])}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {roleDisplayNames[user.role]}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings/profile')}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings/notifications')}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings/security')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Security</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <p>&copy; 2025 HealthCare Management System. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                System Online
              </span>
              <span>Version 1.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}