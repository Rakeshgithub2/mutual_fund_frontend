/**
 * Debug Panel Component
 *
 * Shows backend connectivity status and API configuration.
 * Only visible in development mode when NEXT_PUBLIC_DEBUG=true
 */

'use client';

import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '@/lib/api/funds';

interface DebugPanelProps {
  alwaysShow?: boolean; // Force show even in production
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  alwaysShow = false,
}) => {
  const [backendStatus, setBackendStatus] = useState<
    'checking' | 'online' | 'offline'
  >('checking');
  const [apiUrl, setApiUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check if we should show debug panel
  const shouldShow = alwaysShow || process.env.NODE_ENV === 'development';

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'NOT SET');
    checkHealth();

    // Auto-check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    setBackendStatus('checking');
    const isHealthy = await checkBackendHealth();
    setBackendStatus(isHealthy ? 'online' : 'offline');
    setLastChecked(new Date());
  };

  if (!shouldShow) {
    return null;
  }

  const statusColors = {
    checking: 'bg-yellow-500',
    online: 'bg-green-500',
    offline: 'bg-red-500',
  };

  const statusText = {
    checking: '🔄 Checking...',
    online: '✅ Online',
    offline: '❌ Offline',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed State - Status Indicator */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className={`${statusColors[backendStatus]} text-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform`}
          title="Backend Status"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      )}

      {/* Expanded State - Full Panel */}
      {isExpanded && (
        <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-4 w-96 max-w-[calc(100vw-2rem)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              🔍 Debug Panel
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* API URL */}
            <div>
              <div className="text-gray-400 mb-1">API URL:</div>
              <div className="bg-gray-800 rounded px-2 py-1 font-mono text-xs break-all">
                {apiUrl}
              </div>
            </div>

            {/* Backend Status */}
            <div>
              <div className="text-gray-400 mb-1">Backend Status:</div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${statusColors[backendStatus]}`}
                ></span>
                <span
                  className={
                    backendStatus === 'online'
                      ? 'text-green-400'
                      : backendStatus === 'offline'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                  }
                >
                  {statusText[backendStatus]}
                </span>
              </div>
            </div>

            {/* Last Checked */}
            {lastChecked && (
              <div>
                <div className="text-gray-400 mb-1">Last Checked:</div>
                <div className="text-white">
                  {lastChecked.toLocaleTimeString()}
                </div>
              </div>
            )}

            {/* Environment */}
            <div>
              <div className="text-gray-400 mb-1">Environment:</div>
              <div className="text-white capitalize">
                {process.env.NODE_ENV || 'unknown'}
              </div>
            </div>

            {/* Recheck Button */}
            <button
              onClick={checkHealth}
              disabled={backendStatus === 'checking'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
            >
              {backendStatus === 'checking' ? 'Checking...' : 'Recheck Backend'}
            </button>

            {/* Troubleshooting Tips */}
            {backendStatus === 'offline' && (
              <div className="mt-3 bg-red-900/30 border border-red-700 rounded p-3">
                <div className="font-bold text-red-400 mb-2 text-xs">
                  ⚠️ Backend Offline
                </div>
                <ul className="text-xs text-red-200 space-y-1 list-disc ml-4">
                  <li>Check if backend is running on port 3002</li>
                  <li>Verify NEXT_PUBLIC_API_URL in .env.local</li>
                  <li>Check browser console for errors</li>
                  <li>Check Network tab in DevTools</li>
                </ul>
              </div>
            )}

            {/* Success Message */}
            {backendStatus === 'online' && (
              <div className="mt-3 bg-green-900/30 border border-green-700 rounded p-3">
                <div className="text-green-400 text-xs">
                  ✅ Backend is accessible and healthy
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className="text-gray-400 mb-2 text-xs">Quick Actions:</div>
            <div className="flex gap-2">
              <button
                onClick={() => window.open(`${apiUrl}/health`, '_blank')}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
              >
                Open Health
              </button>
              <button
                onClick={() =>
                  window.open(`${apiUrl}/api/funds?limit=5`, '_blank')
                }
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
              >
                Test API
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
