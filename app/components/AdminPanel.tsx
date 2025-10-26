'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Play } from 'lucide-react';

interface Config {
  sources: string[];
  keywords: string[];
  industries: string[];
  emails: string[];
  whatsappNumbers: string[];
  scanInterval: string;
}

export default function AdminPanel() {
  const [config, setConfig] = useState<Config>({
    sources: [],
    keywords: [],
    industries: [],
    emails: [],
    whatsappNumbers: [],
    scanInterval: 'daily',
  });

  const [newSource, setNewSource] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [scanMessage, setScanMessage] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const saveConfig = async () => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSaveMessage('Configuration saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      setSaveMessage('Failed to save configuration');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const triggerManualScan = async () => {
    setScanMessage('Starting manual scan...');
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
      });

      if (response.ok) {
        setScanMessage('Scan completed successfully! Check reports for results.');
      } else {
        setScanMessage('Scan failed. Please try again.');
      }
    } catch (error) {
      setScanMessage('Scan failed. Please try again.');
    }
    setTimeout(() => setScanMessage(''), 5000);
  };

  const addItem = (field: keyof Config, value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      setConfig({
        ...config,
        [field]: [...config[field] as string[], value.trim()],
      });
      setter('');
    }
  };

  const removeItem = (field: keyof Config, index: number) => {
    const items = config[field] as string[];
    setConfig({
      ...config,
      [field]: items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Control Panel</h2>

        {/* Manual Scan Trigger */}
        <div className="mb-8 p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Manual Scan</h3>
              <p className="text-sm text-gray-600">Trigger an immediate risk scan</p>
            </div>
            <button
              onClick={triggerManualScan}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Run Scan Now</span>
            </button>
          </div>
          {scanMessage && (
            <div className="mt-4 text-sm text-indigo-700">{scanMessage}</div>
          )}
        </div>

        {/* News Sources */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">News Sources</h3>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="Add news source URL"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => addItem('sources', newSource, setNewSource)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {config.sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-700">{source}</span>
                <button
                  onClick={() => removeItem('sources', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Risk Keywords</h3>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword (e.g., geopolitical, economic downturn)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => addItem('keywords', newKeyword, setNewKeyword)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.keywords.map((keyword, index) => (
              <div key={index} className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                <span className="text-sm">{keyword}</span>
                <button
                  onClick={() => removeItem('keywords', index)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Industries */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Industries to Monitor</h3>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              placeholder="Add industry (e.g., Automobile, Technology)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => addItem('industries', newIndustry, setNewIndustry)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.industries.map((industry, index) => (
              <div key={index} className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                <span className="text-sm">{industry}</span>
                <button
                  onClick={() => removeItem('industries', index)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Email Recipients */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Email Recipients</h3>
          <div className="flex space-x-2 mb-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Add email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => addItem('emails', newEmail, setNewEmail)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {config.emails.map((email, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-700">{email}</span>
                <button
                  onClick={() => removeItem('emails', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Numbers */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">WhatsApp Numbers</h3>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newWhatsapp}
              onChange={(e) => setNewWhatsapp(e.target.value)}
              placeholder="Add WhatsApp number (e.g., +1234567890)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => addItem('whatsappNumbers', newWhatsapp, setNewWhatsapp)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {config.whatsappNumbers.map((number, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-700">{number}</span>
                <button
                  onClick={() => removeItem('whatsappNumbers', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Scan Interval */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Automated Scan Schedule</h3>
          <select
            value={config.scanInterval}
            onChange={(e) => setConfig({ ...config, scanInterval: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="hourly">Every Hour</option>
            <option value="every6hours">Every 6 Hours</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            {saveMessage && (
              <span className="text-green-600 text-sm">{saveMessage}</span>
            )}
          </div>
          <button
            onClick={saveConfig}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
