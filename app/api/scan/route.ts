import { NextResponse } from 'next/server';
import { performRiskScan } from '@/lib/scanner';

export async function POST() {
  try {
    await performRiskScan();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { success: false, error: 'Scan failed' },
      { status: 500 }
    );
  }
}
