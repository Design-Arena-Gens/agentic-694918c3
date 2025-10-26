import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ALERTS_FILE = path.join(process.cwd(), 'data', 'alerts.json');
const STATS_FILE = path.join(process.cwd(), 'data', 'stats.json');

export async function GET() {
  try {
    let alerts = [];
    if (fs.existsSync(ALERTS_FILE)) {
      const alertsData = fs.readFileSync(ALERTS_FILE, 'utf-8');
      alerts = JSON.parse(alertsData);
    }

    let lastScan = '';
    if (fs.existsSync(STATS_FILE)) {
      const statsData = fs.readFileSync(STATS_FILE, 'utf-8');
      const stats = JSON.parse(statsData);
      lastScan = stats.lastScan;
    }

    const totalAlerts = alerts.length;
    const criticalAlerts = alerts.filter((a: any) => a.severity === 'critical').length;
    const highRiskAlerts = alerts.filter((a: any) => a.severity === 'high').length;

    return NextResponse.json({
      totalAlerts,
      criticalAlerts,
      highRiskAlerts,
      lastScan: lastScan ? new Date(lastScan).toLocaleString() : 'Never',
    });
  } catch (error) {
    console.error('Error reading stats:', error);
    return NextResponse.json({
      totalAlerts: 0,
      criticalAlerts: 0,
      highRiskAlerts: 0,
      lastScan: 'Never',
    });
  }
}
