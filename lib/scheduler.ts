import cron from 'node-cron';
import { performRiskScan } from './scanner';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

let scheduledTask: cron.ScheduledTask | null = null;

export function startScheduler() {
  try {
    // Read config to determine scan interval
    if (!fs.existsSync(CONFIG_FILE)) {
      console.log('Config not found, scheduler not started');
      return;
    }

    const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(configData);

    // Stop existing task if any
    if (scheduledTask) {
      scheduledTask.stop();
    }

    let cronExpression: string;

    switch (config.scanInterval) {
      case 'hourly':
        cronExpression = '0 * * * *'; // Every hour at minute 0
        break;
      case 'every6hours':
        cronExpression = '0 */6 * * *'; // Every 6 hours
        break;
      case 'daily':
        cronExpression = '0 9 * * *'; // Every day at 9 AM
        break;
      case 'weekly':
        cronExpression = '0 9 * * 1'; // Every Monday at 9 AM
        break;
      default:
        cronExpression = '0 9 * * *'; // Default to daily
    }

    scheduledTask = cron.schedule(cronExpression, async () => {
      console.log('Running scheduled risk scan...');
      try {
        await performRiskScan();
      } catch (error) {
        console.error('Scheduled scan failed:', error);
      }
    });

    console.log(`Scheduler started with interval: ${config.scanInterval}`);
  } catch (error) {
    console.error('Failed to start scheduler:', error);
  }
}

export function stopScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    console.log('Scheduler stopped');
  }
}
