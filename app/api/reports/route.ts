import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REPORTS_FILE = path.join(process.cwd(), 'data', 'reports.json');

export async function GET() {
  try {
    if (!fs.existsSync(REPORTS_FILE)) {
      return NextResponse.json([]);
    }

    const reportsData = fs.readFileSync(REPORTS_FILE, 'utf-8');
    const reports = JSON.parse(reportsData);

    // Sort by date descending
    const sortedReports = reports.sort((a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(sortedReports);
  } catch (error) {
    console.error('Error reading reports:', error);
    return NextResponse.json([]);
  }
}
