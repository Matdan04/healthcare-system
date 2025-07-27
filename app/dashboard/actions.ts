'use server';

import { verifyAuth, getUserData } from '@/lib/auth/dal';
import { requirePermission } from '@/lib/auth/permissions';
import { revalidatePath } from 'next/cache';

export async function updateUserProfile(userId: string, data: any) {
  // Always authenticate in Server Actions
  const session = await verifyAuth();
  
  // Verify permissions
  requirePermission(session.user.role, 'user.update');
  
  // Ensure user can only update their own profile or has admin access
  if (session.user.id.toString() !== userId && session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  // Your update logic here...
  
  revalidatePath('/dashboard/profile');
  return { success: true };
}