'use server';

import { verifyAuth } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/permissions';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createPatientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfBirth: z.string(),
  address: z.string().optional(),
});

export async function createPatient(formData: FormData) {
  try {
    // Always authenticate first
    const session = await verifyAuth();
    
    // Check permissions
    requirePermission(session.user.role, 'patient.create');
    
    // Validate input
    const rawData = Object.fromEntries(formData);
    const validatedData = createPatientSchema.parse(rawData);
    
    // Your patient creation logic here...
    // Make sure to filter by clinic_id for multi-tenancy
    
    revalidatePath('/dashboard/patients');
    return { success: true, message: 'Patient created successfully' };
    
  } catch (error) {
    console.error('Create patient error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to create patient' 
    };
  }
}