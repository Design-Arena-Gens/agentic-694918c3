'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

interface Report {
  id: string;
  type: 'daily' | 'weekly';
  date: string;
  totalRisks: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export default function ReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `risk-report-${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  const filteredReports = reports.filter((report) => {
    if (filter === 'all') return true;
    return report.type === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reports Archive</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('daily')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'daily'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setFilter('weekly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'weekly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reports available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-gray-900">
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-6 text-sm">
                      <span className="text-gray-600">
                        Total Risks: <span className="font-semibold">{report.totalRisks}</span>
                      </span>
                      <span className="text-red-600">
                        Critical: <span className="font-semibold">{report.criticalCount}</span>
                      </span>
                      <span className="text-orange-600">
                        High: <span className="font-semibold">{report.highCount}</span>
                      </span>
                      <span className="text-yellow-600">
                        Medium: <span className="font-semibold">{report.mediumCount}</span>
                      </span>
                      <span className="text-blue-600">
                        Low: <span className="font-semibold">{report.lowCount}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadReport(report.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
