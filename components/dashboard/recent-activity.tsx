import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface ActivityItem {
  title: string;
  description: string;
  timestamp: string;
  color: 'green' | 'blue' | 'orange';
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    title: 'Lab results updated',
    description: 'Patient #1234 - Blood work completed',
    timestamp: '2 minutes ago',
    color: 'green',
  },
  {
    title: 'New appointment booked',
    description: 'Dr. Smith - Tomorrow 3:00 PM',
    timestamp: '15 minutes ago',
    color: 'blue',
  },
  {
    title: 'Prescription ready',
    description: 'Medication available for pickup',
    timestamp: '1 hour ago',
    color: 'orange',
  },
];

const getActivityStyles = (color: ActivityItem['color']) => {
  const styles = {
    green: {
      container: 'bg-green-50 border-green-100',
      dot: 'bg-green-500',
    },
    blue: {
      container: 'bg-blue-50 border-blue-100',
      dot: 'bg-blue-500',
    },
    orange: {
      container: 'bg-orange-50 border-orange-100',
      dot: 'bg-orange-500',
    },
  };
  return styles[color];
};

export function RecentActivity() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          Recent Activity
        </CardTitle>
        <CardDescription className="text-gray-600">Latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_ACTIVITIES.map((activity, index) => {
            const styles = getActivityStyles(activity.color);
            return (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${styles.container}`}>
                <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${styles.dot}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 