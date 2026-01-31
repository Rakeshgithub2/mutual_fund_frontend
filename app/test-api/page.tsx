'use client';

import { useState } from 'react';

export default function TestAPI() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  const testHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token: 'test-token' }),
      });

      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      console.log('Status:', response.status);

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } else {
        const text = await response.text();
        setResult(`Non-JSON response:\n${text.substring(0, 1000)}`);
      }
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      <p className="mb-4">API Base URL: {API_BASE_URL}</p>

      <div className="flex gap-4 mb-4">
        <button
          onClick={testHealth}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Health Endpoint
        </button>

        <button
          onClick={testAuth}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Auth Endpoint
        </button>
      </div>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-96">
        {result || 'Click a button to test...'}
      </pre>
    </div>
  );
}
