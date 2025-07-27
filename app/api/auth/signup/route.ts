import { NextRequest, NextResponse } from 'next/server';
import { signupSchema } from '@/lib/validations/auth';
import { UserService } from '@/lib/db/services/user.service';
import { ClinicService } from '@/lib/db/services/clinic.service';
import { createSession } from '@/lib/auth/session';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Check if clinic exists and is active
    const clinic = await ClinicService.findById(validatedData.clinicId);

    if (!clinic) {
      return NextResponse.json(
        { success: false, message: 'Invalid clinic' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserService.findByEmail(validatedData.email);

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      );
    }

    // Convert role to enum format
    const role = validatedData.role.toUpperCase() as UserRole;

    // Create user
    const user = await UserService.create({
      ...validatedData,
      role,
    });

    // Create session - convert user to match expected type
    const userForSession = {
      id: user.id,
      clinicId: user.clinicId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.toLowerCase() as any,
      phone: user.phone || undefined,
      licenseNumber: user.licenseNumber || undefined,
      specialization: user.specialization || undefined,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
    
    await createSession(userForSession, {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.toLowerCase(),
        clinicId: user.clinicId,
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}