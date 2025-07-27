import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JWTPayload, User } from '@/types/auth';
import { UserService } from '@/lib/db/services/user.service';
import { TokenService } from '@/lib/db/services/token.service';
import { SessionService } from '@/lib/db/services/session.service';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function createSession(user: User, request?: {
  ip?: string;
  userAgent?: string;
}) {
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role.toLowerCase() as any, // Convert enum to lowercase
    clinicId: user.clinicId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
  };

  const accessToken = jwt.sign(payload, JWT_SECRET);
  const refreshToken = jwt.sign(
    { sub: user.id, type: 'refresh' }, 
    JWT_REFRESH_SECRET, 
    { expiresIn: '7d' }
  );

  // Store refresh token in database
  await TokenService.createRefreshToken(user.id, refreshToken);

  // Log session
  if (request) {
    await SessionService.createSession({
      userId: user.id,
      ipAddress: request.ip,
      userAgent: request.userAgent,
    });
  }

  // Update last login
  await UserService.updateLastLogin(user.id);

  // Set HTTP-only cookies
  const cookieStore = await cookies();
  cookieStore.set('access-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  cookieStore.set('refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return { accessToken, refreshToken };
}

export async function verifySession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access-token')?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const payload = jwt.verify(accessToken, JWT_SECRET) as JWTPayload;
    
    // Get fresh user data with clinic validation
    const userWithClinic = await UserService.findById(payload.sub);

    if (!userWithClinic || !userWithClinic.isActive || !userWithClinic.clinic.isActive) {
      return null;
    }

    return {
      user: {
        id: userWithClinic.id,
        clinicId: userWithClinic.clinicId,
        email: userWithClinic.email,
        firstName: userWithClinic.firstName,
        lastName: userWithClinic.lastName,
        role: userWithClinic.role.toLowerCase() as any, // Convert enum to lowercase
        phone: userWithClinic.phone,
        licenseNumber: userWithClinic.licenseNumber,
        specialization: userWithClinic.specialization,
        isActive: userWithClinic.isActive,
        emailVerified: userWithClinic.emailVerified,
      },
      accessToken,
    };
  } catch (error) {
    return null;
  }
}

export async function refreshAccessToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh-token')?.value;

  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    
    // Verify refresh token exists in database
    const tokenRecord = await TokenService.findValidToken(payload.sub, refreshToken);

    if (!tokenRecord || !tokenRecord.user.isActive || !tokenRecord.user.clinicId) {
      throw new Error('Invalid refresh token');
    }

    // Create new session
    return await createSession(tokenRecord.user as unknown as User);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh-token')?.value;

  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      
      // Remove refresh token from database
      await TokenService.deleteToken(payload.sub, refreshToken);
      
      // End session
      await SessionService.endSession(payload.sub);
    } catch (error) {
      // Token might be invalid, continue with logout
    }
  }

  // Clear cookies
  cookieStore.delete('access-token');
  cookieStore.delete('refresh-token');
}