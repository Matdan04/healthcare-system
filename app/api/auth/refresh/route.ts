import { NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/auth/session';

export async function POST() {
  try {
    await refreshAccessToken();
    
    return NextResponse.json({
      success: true,
      message: 'Token refreshed'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Token refresh failed' },
      { status: 401 }
    );
  }
}