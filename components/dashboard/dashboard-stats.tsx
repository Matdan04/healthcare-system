import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { DashboardCard } from '@/lib/constants/dashboard';

interface DashboardStatsProps {
  cards: DashboardCard[];
}

export function DashboardStats({ cards }: DashboardStatsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
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
  );
} 