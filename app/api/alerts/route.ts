import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ALERTS_FILE = path.join(process.cwd(), 'data', 'alerts.json');

export async function GET() {
  try {
    if (!fs.existsSync(ALERTS_FILE)) {
      return NextResponse.json([]);
    }

    const alertsData = fs.readFileSync(ALERTS_FILE, 'utf-8');
    const alerts = JSON.parse(alertsData);

    // Return most recent alerts first
    const sortedAlerts = alerts.sort((a: any, b: any) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 50); // Limit to 50 most recent

    return NextResponse.json(sortedAlerts);
  } catch (error) {
    console.error('Error reading alerts:', error);
    return NextResponse.json([]);
  }
}
