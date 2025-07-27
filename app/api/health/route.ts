import { NextResponse } from 'next/server';
import { healthCheck, getDatabaseStats } from '@/lib/db/utils';

export async function GET() {
  try {
    const [health, stats] = await Promise.all([
      healthCheck(),
      getDatabaseStats(),
    ]);

    return NextResponse.json({
      ...health,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}