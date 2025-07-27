import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations/auth';
import { UserService } from '@/lib/db/services/user.service';
import { createSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user with clinic info
    const userWithClinic = await UserService.findByEmail(email);

    if (!userWithClinic || !userWithClinic.clinic.isActive) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await UserService.verifyPassword(userWithClinic, password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session - convert user to match expected type
    const userForSession = {
      id: userWithClinic.id,
      clinicId: userWithClinic.clinicId,
      email: userWithClinic.email,
      firstName: userWithClinic.firstName,
      lastName: userWithClinic.lastName,
      role: userWithClinic.role.toLowerCase() as any,
      phone: userWithClinic.phone || undefined,
      licenseNumber: userWithClinic.licenseNumber || undefined,
      specialization: userWithClinic.specialization || undefined,
      isActive: userWithClinic.isActive,
      emailVerified: userWithClinic.emailVerified,
    };
    
    await createSession(userForSession, {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userWithClinic.id,
        email: userWithClinic.email,
        firstName: userWithClinic.firstName,
        lastName: userWithClinic.lastName,
        role: userWithClinic.role.toLowerCase(),
        clinicId: userWithClinic.clinicId,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}