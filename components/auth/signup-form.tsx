'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Phone, Award, Stethoscope, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number and special character'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['admin', 'doctor', 'nurse', 'lab_tech', 'patient', 'receptionist', 'pharmacist']),
  clinicId: z.string().min(1, 'Please select a clinic'),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  specialization: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

const roleOptions = [
  { value: 'patient', label: 'Patient', icon: User, color: 'bg-blue-100 text-blue-700' },
  { value: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'bg-green-100 text-green-700' },
  { value: 'nurse', label: 'Nurse', icon: User, color: 'bg-pink-100 text-pink-700' },
  { value: 'receptionist', label: 'Receptionist', icon: User, color: 'bg-purple-100 text-purple-700' },
  { value: 'lab_tech', label: 'Lab Technician', icon: Award, color: 'bg-orange-100 text-orange-700' },
  { value: 'pharmacist', label: 'Pharmacist', icon: Award, color: 'bg-teal-100 text-teal-700' },
  { value: 'admin', label: 'Administrator', icon: User, color: 'bg-red-100 text-red-700' },
];

// Mock clinics - replace with API call
const mockClinics = [
  { id: '1', name: 'General Hospital' },
  { id: '2', name: 'City Medical Center' },
  { id: '3', name: 'Downtown Clinic' },
];

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { signup } = useAuth();
  const router = useRouter();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: undefined,
      clinicId: '',
      phone: '',
      licenseNumber: '',
      specialization: '',
    },
  });

  const watchedRole = form.watch('role');
  const requiresLicense = ['doctor', 'nurse', 'pharmacist'].includes(watchedRole || '');
  const requiresSpecialization = watchedRole === 'doctor';

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    const success = await signup(data);
    
    if (success) {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  const nextStep = async () => {
    const fields = currentStep === 1 
      ? ['firstName', 'lastName', 'email', 'password'] 
      : ['role', 'clinicId'];
    
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-healthcare-secondary)]/10 via-background to-[var(--color-healthcare-accent)]/10 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            {currentStep === 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex-1" />
            <div className="flex space-x-2">
              <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-[var(--color-healthcare-primary)]' : 'bg-muted'}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-[var(--color-healthcare-primary)]' : 'bg-muted'}`} />
            </div>
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold">
              {currentStep === 1 ? 'Create Account' : 'Professional Details'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {currentStep === 1 
                ? 'Join our healthcare platform' 
                : 'Tell us about your role'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John"
                              disabled={isLoading}
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Doe"
                              disabled={isLoading}
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="doctor@clinic.com"
                              className="pl-10 h-12"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className="pl-10 pr-10 h-12"
                              disabled={isLoading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <div className="text-xs text-muted-foreground">
                          Must contain uppercase, lowercase, number & special character
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="button"
                    onClick={nextStep}
                    className="w-full h-12 bg-[var(--color-healthcare-secondary)] hover:bg-[var(--color-healthcare-secondary)]/90"
                    disabled={isLoading}
                  >
                    Continue
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roleOptions.map((role) => {
                              const Icon = role.icon;
                              return (
                                <SelectItem key={role.value} value={role.value}>
                                  <div className="flex items-center space-x-2">
                                    <Icon className="w-4 h-4" />
                                    <span>{role.label}</span>
                                    <Badge variant="secondary" className={role.color}>
                                      {role.label}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clinicId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clinic</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your clinic" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockClinics.map((clinic) => (
                              <SelectItem key={clinic.id} value={clinic.id}>
                                {clinic.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="pl-10 h-12"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {requiresLicense && (
                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="License #"
                                className="pl-10 h-12"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {requiresSpecialization && (
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="e.g., Cardiology, Pediatrics"
                                className="pl-10 h-12"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[var(--color-healthcare-accent)] hover:bg-[var(--color-healthcare-accent)]/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </>
              )}
            </form>
          </Form>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => router.push('/login')}
              disabled={isLoading}
              className="text-sm"
            >
              Already have an account? Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}