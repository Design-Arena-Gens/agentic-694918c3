'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Activity, Clock } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  riskRank: number;
  impact: string;
  source: string;
  timestamp: string;
  summary: string;
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    highRiskAlerts: 0,
    lastScan: '',
  });

  useEffect(() => {
    loadAlerts();
    loadStats();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await fetch('/api/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAlerts}</p>
            </div>
            <Activity className="w-12 h-12 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Alerts</p>
              <p className="text-3xl font-bold text-red-600">{stats.criticalAlerts}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-3xl font-bold text-orange-600">{stats.highRiskAlerts}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Scan</p>
              <p className="text-sm font-semibold text-gray-900">
                {stats.lastScan || 'Never'}
              </p>
            </div>
            <Clock className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Alerts</h2>
        </div>
        <div className="p-6">
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No alerts yet. Run a scan to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-lg">{alert.title}</span>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-white">
                          Risk Rank: {alert.riskRank}/10
                        </span>
                      </div>
                      <p className="text-sm mb-2">{alert.summary}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="font-semibold">Impact: {alert.impact}</span>
                        <span>Source: {alert.source}</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
