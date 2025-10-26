# Risk Monitoring Agent

AI-powered risk monitoring and alert system for businesses. Continuously scans news sources to identify risks and potential disruptions to your industry.

## Features

- **Automated News Scanning**: Monitors multiple reputable news sources
- **AI-Powered Analysis**: Uses OpenAI to analyze content for risks and disruptions
- **Customizable Keywords**: Track specific risk indicators (geopolitical, economic downturn, etc.)
- **Industry-Specific Monitoring**: Focus on specific industries (e.g., Automobile)
- **Real-time Alerts**: Instant notifications for critical risks
- **Multi-Channel Notifications**: Email and WhatsApp alerts
- **Comprehensive Reports**: Daily and weekly risk summaries
- **Google Sheets Backup**: Automatic data backup to Google Sheets
- **Admin Control Panel**: Easy configuration and manual scan triggering
- **Risk Severity Ranking**: Automated severity classification (Critical, High, Medium, Low)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (copy `.env.example` to `.env`)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Usage

1. Login with admin password
2. Configure sources, keywords, and notifications in Admin panel
3. Run manual scans or enable automated scheduling
4. View alerts and download reports

## Deployment

Deploy to Vercel:
```bash
vercel deploy --prod
```
