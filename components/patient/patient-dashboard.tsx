'use client';

import { useState, useEffect } from 'react';
import { Calendar, FileText, Pill, TestTube, Clock, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  datePrescribed: string;
  status: 'active' | 'completed' | 'refill_needed';
}

export function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        doctorName: 'Dr. Sarah Wilson',
        specialty: 'Cardiology',
        date: '2025-07-27',
        time: '2:00 PM',
        location: 'Room 301',
        status: 'upcoming',
      },
      {
        id: '2',
        doctorName: 'Dr. Mike Johnson',
        specialty: 'General Practice',
        date: '2025-07-20',
        time: '10:30 AM',
        location: 'Room 105',
        status: 'completed',
      },
    ];

    const mockPrescriptions: Prescription[] = [
      {
        id: '1',
        medication: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        prescribedBy: 'Dr. Sarah Wilson',
        datePrescribed: '2025-07-20',
        status: 'active',
      },
      {
        id: '2',
        medication: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        prescribedBy: 'Dr. Mike Johnson',
        datePrescribed: '2025-07-15',
        status: 'refill_needed',
      },
    ];

    setTimeout(() => {
      setAppointments(mockAppointments);
      setPrescriptions(mockPrescriptions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'refill_needed':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">
            Welcome back, {user?.firstName}!
          </CardTitle>
          <CardDescription className="text-blue-700">
            Here's an overview of your health information and upcoming appointments.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <Calendar className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments
                .filter(apt => apt.status === 'upcoming')
                .map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.date} at {appointment.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {appointment.location}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {appointments.filter(apt => apt.status === 'upcoming').length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No upcoming appointments
                </p>
              )}

              <Button className="w-full" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Book New Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Prescriptions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Active Prescriptions</CardTitle>
            <Pill className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{prescription.medication}</p>
                      <p className="text-sm text-muted-foreground">
                        {prescription.dosage} - {prescription.frequency}
                      </p>
                    </div>
                    <Badge className={getStatusColor(prescription.status)}>
                      {prescription.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Separator className="my-2" />
                  <div className="text-xs text-muted-foreground">
                    Prescribed by {prescription.prescribedBy} on {prescription.datePrescribed}
                  </div>
                </div>
              ))}

              <Button className="w-full" variant="outline">
                <Pill className="w-4 h-4 mr-2" />
                Request Prescription Refill
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Annual Physical Exam</p>
                    <p className="text-xs text-muted-foreground">July 20, 2025</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <TestTube className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Blood Test Results</p>
                    <p className="text-xs text-muted-foreground">July 18, 2025</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>

            <Button className="w-full mt-4" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              View All Records
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <TestTube className="mr-2 h-4 w-4" />
                View Lab Results
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Pill className="mr-2 h-4 w-4" />
                Manage Prescriptions
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Update Health Information
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}