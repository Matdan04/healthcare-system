'use client';

import { Heart, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserInfo } from './user-info';
import { Navigation } from './navigation';
import { User } from '@/types/auth';
import { cn } from '@/lib/utils';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  expandedItems: string[];
  onToggleExpanded: (itemName: string) => void;
  onClose: () => void;
  onLogout: () => void;
}

export function Sidebar({ 
  user, 
  isOpen, 
  expandedItems, 
  onToggleExpanded, 
  onClose, 
  onLogout 
}: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
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
              onClick={onClose}
              className="lg:hidden hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User info */}
          <UserInfo user={user} />

          {/* Navigation */}
          <Navigation
            user={user}
            expandedItems={expandedItems}
            onToggleExpanded={onToggleExpanded}
            onCloseSidebar={onClose}
          />

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 