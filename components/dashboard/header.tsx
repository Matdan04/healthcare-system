'use client';

import { useRouter } from 'next/navigation';
import { 
  Bell,
  Search,
  Menu,
  Calendar,
  Users,
  LogOut,
  Shield
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
import { roleColors, roleIcons, roleDisplayNames } from '@/lib/constants/roles';
import { User } from '@/types/auth';
import { cn } from '@/lib/utils';

interface HeaderProps {
  user: User;
  onOpenSidebar: () => void;
  onLogout: () => void;
}

export function Header({ user, onOpenSidebar, onLogout }: HeaderProps) {
  const router = useRouter();
  const RoleIcon = roleIcons[user.role];

  const renderRoleSpecificButton = () => {
    if (user.role === 'doctor') {
      return (
        <Button size="sm" className="hidden sm:flex bg-[var(--color-healthcare-primary)] hover:bg-[var(--color-healthcare-primary)]/90">
          <Calendar className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      );
    }

    if (user.role === 'receptionist') {
      return (
        <Button size="sm" className="hidden sm:flex bg-[var(--color-healthcare-secondary)] hover:bg-[var(--color-healthcare-secondary)]/90">
          <Users className="w-4 h-4 mr-2" />
          Check-in Patient
        </Button>
      );
    }

    return null;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSidebar}
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

          {/* Role-specific quick actions */}
          {renderRoleSpecificButton()}

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
              <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 