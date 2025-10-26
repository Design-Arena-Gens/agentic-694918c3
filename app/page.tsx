'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Settings, Play, FileText, Shield, Bell, Database } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';
import ReportsView from './components/ReportsView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'admin' | 'reports'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Risk Monitoring Agent
          </h1>
          <p className="text-center text-gray-600 mb-6">
            AI-powered risk monitoring and alert system
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter admin password"
              />
            </div>
            {error && (
              <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Risk Monitoring Agent</h1>
            </div>
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Reports</span>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}
