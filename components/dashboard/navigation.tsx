'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigationItems, NavItem } from '@/lib/constants/navigation';
import { User } from '@/types/auth';
import { cn } from '@/lib/utils';

interface NavigationProps {
  user: User;
  expandedItems: string[];
  onToggleExpanded: (itemName: string) => void;
  onCloseSidebar: () => void;
}

export function Navigation({ user, expandedItems, onToggleExpanded, onCloseSidebar }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  ).map(item => ({
    ...item,
    children: item.children?.filter(child => child.roles.includes(user.role))
  }));

  const renderNavItem = (item: NavItem) => {
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
              onToggleExpanded(item.name);
            } else {
              router.push(item.href);
              onCloseSidebar();
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
                    onCloseSidebar();
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
  };

  return (
    <ScrollArea className="flex-1 px-4 py-4">
      <nav className="space-y-1">
        {filteredNavItems.map(renderNavItem)}
      </nav>
    </ScrollArea>
  );
} 