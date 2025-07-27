import { Badge } from '@/components/ui/badge';
import { getGreeting, formatCurrentDate } from '@/lib/utils/dashboard';
import { ROLE_DISPLAY_NAMES } from '@/lib/constants/dashboard';

interface DashboardHeaderProps {
  firstName: string;
  role: string;
}

export function DashboardHeader({ firstName, role }: DashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[var(--color-healthcare-primary)] to-[var(--color-healthcare-secondary)] rounded-xl p-8 text-white shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, Dr. {firstName}!
          </h1>
          <p className="text-blue-100 text-lg">
            Welcome back to your {ROLE_DISPLAY_NAMES[role]?.toLowerCase() || role} dashboard
          </p>
        </div>
        <div className="sm:text-right">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
            {formatCurrentDate()}
          </Badge>
        </div>
      </div>
    </div>
  );
} 