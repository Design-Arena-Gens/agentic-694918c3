# Risk Monitoring Agent - Deployment Guide

## Application URL
🚀 **Production URL**: https://agentic-694918c3.vercel.app

## Default Credentials
- **Admin Password**: `admin123` (change via ADMIN_PASSWORD environment variable)

## Setup Instructions

### 1. Access the Application
Visit https://agentic-694918c3.vercel.app and login with the admin password.

### 2. Configure Environment Variables (Optional)
Add these environment variables in Vercel dashboard for full functionality:

**Required for AI Analysis:**
- `OPENAI_API_KEY` - OpenAI API key for intelligent risk analysis

**Required for Email Notifications:**
- `EMAIL_HOST` - SMTP host (e.g., smtp.gmail.com)
- `EMAIL_PORT` - SMTP port (e.g., 587)
- `EMAIL_USER` - Email address
- `EMAIL_PASSWORD` - Email password or app-specific password

**Required for WhatsApp Notifications:**
- `TWILIO_ACCOUNT_SID` - Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Twilio Auth Token
- `TWILIO_WHATSAPP_FROM` - Twilio WhatsApp number (e.g., whatsapp:+14155238886)

**Required for Google Sheets Backup:**
- `GOOGLE_SHEETS_API_KEY` - Google Sheets API key
- `GOOGLE_SHEETS_SPREADSHEET_ID` - Target spreadsheet ID

**Security:**
- `ADMIN_PASSWORD` - Change from default (admin123)

### 3. Configure the Agent

1. **Add News Sources**: 
   - Go to Admin panel
   - Add reputable news sources (default sources included)
   - Examples: Reuters, BBC News, CNBC, Financial Times

2. **Set Keywords**:
   - Define risk keywords to monitor
   - Default: geopolitical, economic downturn, supply chain, recession, trade war, sanctions, inflation, semiconductor shortage, oil prices, regulatory changes

3. **Specify Industries**:
   - Add industries to monitor
   - Default: Automobile
   - Add others as needed (Technology, Healthcare, Energy, etc.)

4. **Configure Notifications**:
   - Add email addresses for reports
   - Add WhatsApp numbers for real-time alerts (format: +1234567890)

5. **Set Scan Schedule**:
   - Choose: Hourly, Every 6 Hours, Daily, or Weekly
   - Default: Daily at 9 AM

### 4. Run Your First Scan
- Click "Run Scan Now" in the Admin panel
- Wait for results to appear in the Dashboard
- Review alerts and their severity rankings

## Features

✅ **Automated News Scanning** - Monitors multiple news sources continuously
✅ **AI-Powered Analysis** - Uses OpenAI to identify risks and disruptions
✅ **Severity Classification** - Critical, High, Medium, Low risk ranking
✅ **Real-time Alerts** - Instant notifications via Email and WhatsApp
✅ **Daily & Weekly Reports** - Comprehensive risk summaries
✅ **Google Sheets Backup** - Automatic data archiving
✅ **Manual Scan Trigger** - On-demand risk assessment
✅ **Admin Control Panel** - Easy configuration management

## Architecture

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-3.5
- **Notifications**: Nodemailer (Email) + Twilio (WhatsApp)
- **Backup**: Google Sheets API
- **Deployment**: Vercel

## Important Notes

⚠️ **Data Storage**: Application uses file-based storage. For production use with high volume, consider integrating a database.

⚠️ **Google Drive Hosting**: While the application is deployed on Vercel (cloud), you can export reports and data to Google Sheets for backup and sharing via Google Drive.

⚠️ **API Rate Limits**: Be mindful of rate limits for OpenAI, Twilio, and news sources when setting scan frequency.

⚠️ **Security**: Always change the default admin password in production!

## Scheduled Jobs

Note: For scheduled scans to work reliably on Vercel, you may need to:
1. Use Vercel Cron Jobs (add to `vercel.json`)
2. Or use an external service like GitHub Actions or AWS Lambda to trigger `/api/scan` endpoint

## Support

For issues or questions, refer to the main README.md or create an issue in the repository.

---

**Deployed on**: October 26, 2025
**Build Status**: ✅ Successful
**Last Updated**: October 26, 2025
