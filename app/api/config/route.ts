import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Default configuration
const defaultConfig = {
  sources: [
    'https://www.reuters.com/business/autos-transportation/',
    'https://www.bbc.com/news/business',
    'https://www.cnbc.com/automotive/',
    'https://www.ft.com/companies/automobiles',
  ],
  keywords: [
    'geopolitical',
    'economic downturn',
    'supply chain',
    'recession',
    'trade war',
    'sanctions',
    'inflation',
    'semiconductor shortage',
    'oil prices',
    'regulatory changes',
  ],
  industries: ['Automobile'],
  emails: [],
  whatsappNumbers: [],
  scanInterval: 'daily',
};

export async function GET() {
  try {
    ensureDataDir();

    if (!fs.existsSync(CONFIG_FILE)) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
      return NextResponse.json(defaultConfig);
    }

    const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(configData);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json(defaultConfig);
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json();
    ensureDataDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ success: false, error: 'Failed to save config' }, { status: 500 });
  }
}
