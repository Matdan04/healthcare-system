'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { roleColors, roleIcons, roleDisplayNames } from '@/lib/constants/roles';
import { User } from '@/types/auth';
import { cn } from '@/lib/utils';

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps) {
  const RoleIcon = roleIcons[user.role];

  return (
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
  );
} 