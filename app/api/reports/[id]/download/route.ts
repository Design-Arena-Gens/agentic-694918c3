import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id;
    const REPORTS_FILE = path.join(process.cwd(), 'data', 'reports.json');

    if (!fs.existsSync(REPORTS_FILE)) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const reportsData = fs.readFileSync(REPORTS_FILE, 'utf-8');
    const reports = JSON.parse(reportsData);
    const report = reports.find((r: any) => r.id === reportId);

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Generate simple text report
    const reportContent = `
RISK MONITORING REPORT
======================

Report ID: ${report.id}
Type: ${report.type}
Date: ${new Date(report.date).toLocaleString()}

SUMMARY
-------
Total Risks: ${report.totalRisks}
Critical: ${report.criticalCount}
High: ${report.highCount}
Medium: ${report.mediumCount}
Low: ${report.lowCount}

This is a sample report. Full report generation would include detailed analysis.
    `.trim();

    return new NextResponse(reportContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="risk-report-${reportId}.txt"`,
      },
    });
  } catch (error) {
    console.error('Error downloading report:', error);
    return NextResponse.json({ error: 'Failed to download report' }, { status: 500 });
  }
}
