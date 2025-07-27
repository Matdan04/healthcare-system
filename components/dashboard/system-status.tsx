import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface StatusItem {
  label: string;
  status: 'operational' | 'online' | 'complete';
  value?: string;
}

const STATUS_ITEMS: StatusItem[] = [
  { label: 'System Status', status: 'operational' },
  { label: 'Database', status: 'online' },
  { label: 'Backup Status', status: 'complete' },
  { label: 'Last Update', value: '2 hours ago' },
];

const getStatusBadge = (status: StatusItem['status']) => {
  const statusConfig = {
    operational: { className: 'bg-green-100 text-green-700 border-green-200', text: 'Operational' },
    online: { className: 'bg-green-100 text-green-700 border-green-200', text: 'Online' },
    complete: { className: 'bg-green-100 text-green-700 border-green-200', text: 'Complete' },
  };
  
  return statusConfig[status];
};

export function SystemStatus() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
            <AlertCircle className="w-4 h-4 text-green-600" />
          </div>
          System Status
        </CardTitle>
        <CardDescription className="text-gray-600">Platform health and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {STATUS_ITEMS.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium text-gray-900">{item.label}</span>
              {item.value ? (
                <span className="text-sm text-gray-600">{item.value}</span>
              ) : (
                <Badge className={getStatusBadge(item.status).className}>
                  {getStatusBadge(item.status).text}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 