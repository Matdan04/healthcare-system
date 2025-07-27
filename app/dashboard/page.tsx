'use client';

import { useAuth } from '@/context/auth-context';
import { getDashboardData } from '@/lib/constants/dashboard';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { SystemStatus } from '@/components/dashboard/system-status';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const dashboardCards = getDashboardData(user.role);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <DashboardHeader firstName={user.firstName} role={user.role} />

      {/* Stats Overview */}
      <DashboardStats cards={dashboardCards} />

      {/* Dashboard Sections */}
      <div className="grid gap-8 lg:grid-cols-3">
        <QuickActions userRole={user.role} />
        <RecentActivity />
        <SystemStatus />
      </div>
    </div>
  );
}