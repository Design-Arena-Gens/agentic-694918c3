interface Alert {
  id: string;
  title: string;
  severity: string;
  riskRank: number;
  impact: string;
  source: string;
  timestamp: string;
  summary: string;
}

export async function saveToGoogleSheets(alerts: Alert[]) {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!apiKey || !spreadsheetId) {
    console.log('Google Sheets configuration not found, skipping backup');
    return;
  }

  try {
    // Prepare data in rows format
    const rows = alerts.map(alert => [
      alert.timestamp,
      alert.severity,
      alert.riskRank,
      alert.title,
      alert.impact,
      alert.source,
      alert.summary,
    ]);

    // Use Google Sheets API v4 to append data
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Alerts:append?valueInputOption=RAW&key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: rows,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    console.log(`Saved ${alerts.length} alerts to Google Sheets`);
  } catch (error) {
    console.error('Failed to save to Google Sheets:', error);
    throw error;
  }
}
