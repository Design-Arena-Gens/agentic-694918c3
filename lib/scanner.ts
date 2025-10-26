import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import { sendEmailAlert, sendWhatsAppAlert } from './notifications';
import { saveToGoogleSheets } from './googleSheets';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');
const ALERTS_FILE = path.join(process.cwd(), 'data', 'alerts.json');
const REPORTS_FILE = path.join(process.cwd(), 'data', 'reports.json');
const STATS_FILE = path.join(process.cwd(), 'data', 'stats.json');

interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  riskRank: number;
  impact: string;
  source: string;
  timestamp: string;
  summary: string;
  fullText?: string;
}

function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

async function fetchNewsFromSource(url: string): Promise<string[]> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const articles: string[] = [];

    // Generic selectors for common news sites
    $('article, .article, .story, .news-item').each((_, element) => {
      const text = $(element).text().trim();
      if (text.length > 100) {
        articles.push(text.substring(0, 1000)); // Limit length
      }
    });

    // If no articles found, try paragraphs
    if (articles.length === 0) {
      $('p').each((_, element) => {
        const text = $(element).text().trim();
        if (text.length > 100) {
          articles.push(text);
        }
      });
    }

    return articles.slice(0, 10); // Limit to 10 articles per source
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    return [];
  }
}

async function analyzeWithAI(content: string, keywords: string[], industries: string[]): Promise<Alert | null> {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    console.log('OpenAI API key not found, using rule-based analysis');
    return analyzeWithRules(content, keywords, industries);
  }

  try {
    const openai = new OpenAI({ apiKey: openaiKey });

    const prompt = `Analyze the following news content for business risks and disruptions related to these industries: ${industries.join(', ')}.

Keywords to focus on: ${keywords.join(', ')}

News content:
${content}

Provide a JSON response with:
{
  "isRelevant": boolean (true if this poses a risk),
  "title": "Brief title of the risk",
  "severity": "critical" | "high" | "medium" | "low",
  "riskRank": number (1-10),
  "impact": "Description of potential impact",
  "summary": "2-3 sentence summary of the risk"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    if (!result.isRelevant) {
      return null;
    }

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: result.title,
      severity: result.severity,
      riskRank: result.riskRank,
      impact: result.impact,
      source: 'AI Analysis',
      timestamp: new Date().toISOString(),
      summary: result.summary,
      fullText: content,
    };
  } catch (error) {
    console.error('AI analysis failed, falling back to rules:', error);
    return analyzeWithRules(content, keywords, industries);
  }
}

function analyzeWithRules(content: string, keywords: string[], industries: string[]): Alert | null {
  const lowerContent = content.toLowerCase();

  // Check if content mentions any monitored industry
  const mentionsIndustry = industries.some(industry =>
    lowerContent.includes(industry.toLowerCase())
  );

  if (!mentionsIndustry) {
    return null;
  }

  // Count keyword matches
  const matchedKeywords = keywords.filter(keyword =>
    lowerContent.includes(keyword.toLowerCase())
  );

  if (matchedKeywords.length === 0) {
    return null;
  }

  // Determine severity based on keywords
  let severity: 'critical' | 'high' | 'medium' | 'low' = 'low';
  let riskRank = matchedKeywords.length;

  if (matchedKeywords.some(k => ['recession', 'collapse', 'crisis', 'shutdown'].includes(k.toLowerCase()))) {
    severity = 'critical';
    riskRank = Math.min(10, riskRank + 5);
  } else if (matchedKeywords.some(k => ['downturn', 'sanctions', 'shortage'].includes(k.toLowerCase()))) {
    severity = 'high';
    riskRank = Math.min(10, riskRank + 3);
  } else if (matchedKeywords.length > 2) {
    severity = 'medium';
    riskRank = Math.min(10, riskRank + 1);
  }

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: `Risk Alert: ${matchedKeywords.slice(0, 2).join(', ')} affecting ${industries[0]}`,
    severity,
    riskRank,
    impact: `Potential ${severity} impact on ${industries.join(', ')} industry`,
    source: 'Rule-based Analysis',
    timestamp: new Date().toISOString(),
    summary: content.substring(0, 300) + '...',
    fullText: content,
  };
}

export async function performRiskScan() {
  console.log('Starting risk scan...');
  ensureDataDir();

  // Load configuration
  let config;
  try {
    const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
    config = JSON.parse(configData);
  } catch (error) {
    console.error('Failed to load config:', error);
    throw new Error('Configuration not found');
  }

  const newAlerts: Alert[] = [];

  // Fetch and analyze news from each source
  for (const source of config.sources) {
    console.log(`Fetching from ${source}...`);
    const articles = await fetchNewsFromSource(source);

    for (const article of articles) {
      const alert = await analyzeWithAI(article, config.keywords, config.industries);
      if (alert) {
        alert.source = source;
        newAlerts.push(alert);
      }
    }
  }

  console.log(`Found ${newAlerts.length} new alerts`);

  // Load existing alerts
  let existingAlerts: Alert[] = [];
  if (fs.existsSync(ALERTS_FILE)) {
    const alertsData = fs.readFileSync(ALERTS_FILE, 'utf-8');
    existingAlerts = JSON.parse(alertsData);
  }

  // Combine and save alerts
  const allAlerts = [...newAlerts, ...existingAlerts];
  fs.writeFileSync(ALERTS_FILE, JSON.stringify(allAlerts, null, 2));

  // Update stats
  fs.writeFileSync(
    STATS_FILE,
    JSON.stringify({ lastScan: new Date().toISOString() }, null, 2)
  );

  // Send notifications for critical and high severity alerts
  const urgentAlerts = newAlerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  if (urgentAlerts.length > 0) {
    await sendNotifications(urgentAlerts, config);
  }

  // Save to Google Sheets
  try {
    await saveToGoogleSheets(newAlerts);
  } catch (error) {
    console.error('Failed to save to Google Sheets:', error);
  }

  // Generate report
  await generateReport('daily', allAlerts);

  console.log('Scan completed');
  return newAlerts;
}

async function sendNotifications(alerts: Alert[], config: any) {
  const summary = `${alerts.length} urgent risk alert(s) detected:\n\n${alerts
    .map(a => `- [${a.severity.toUpperCase()}] ${a.title}`)
    .join('\n')}`;

  // Send emails
  for (const email of config.emails) {
    try {
      await sendEmailAlert(email, 'Urgent Risk Alert', summary);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
    }
  }

  // Send WhatsApp alerts
  for (const number of config.whatsappNumbers) {
    try {
      await sendWhatsAppAlert(number, summary);
    } catch (error) {
      console.error(`Failed to send WhatsApp to ${number}:`, error);
    }
  }
}

async function generateReport(type: 'daily' | 'weekly', alerts: Alert[]) {
  const now = new Date();
  const cutoffDate = new Date();

  if (type === 'daily') {
    cutoffDate.setDate(cutoffDate.getDate() - 1);
  } else {
    cutoffDate.setDate(cutoffDate.getDate() - 7);
  }

  const recentAlerts = alerts.filter(
    a => new Date(a.timestamp) > cutoffDate
  );

  const report = {
    id: Date.now().toString(),
    type,
    date: now.toISOString(),
    totalRisks: recentAlerts.length,
    criticalCount: recentAlerts.filter(a => a.severity === 'critical').length,
    highCount: recentAlerts.filter(a => a.severity === 'high').length,
    mediumCount: recentAlerts.filter(a => a.severity === 'medium').length,
    lowCount: recentAlerts.filter(a => a.severity === 'low').length,
  };

  // Load existing reports
  let reports = [];
  if (fs.existsSync(REPORTS_FILE)) {
    const reportsData = fs.readFileSync(REPORTS_FILE, 'utf-8');
    reports = JSON.parse(reportsData);
  }

  reports.push(report);
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));

  return report;
}
