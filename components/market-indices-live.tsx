/**
 * Frontend WebSocket Client Example
 * React component for real-time market indices
 */

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface MarketIndex {
  indexName: string;
  symbol: string;
  value: number;
  change: number;
  percentChange: number;
  lastUpdated: Date;
  isMarketOpen: boolean;
}

interface MarketStatus {
  isOpen: boolean;
  reason?: string;
  currentTime: string;
  timestamp: string;
}

export function useMarketData() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002',
      {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
      }
    );

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to market data server');
    });

    // Market data events
    newSocket.on('market:status', (status: MarketStatus) => {
      console.log('📊 Market status:', status);
      setMarketStatus(status);
    });

    newSocket.on('market:indices', (data: MarketIndex[]) => {
      console.log('📈 Initial indices data:', data.length);
      setIndices(data);
    });

    newSocket.on(
      'market:update',
      (data: { indices: MarketIndex[]; timestamp: string }) => {
        console.log('🔄 Real-time update received at', data.timestamp);
        setIndices(data.indices);
      }
    );

    newSocket.on('market:error', (error: { message: string }) => {
      console.error('Market data error:', error);
      setError(error.message);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Subscribe to specific indices
  const subscribeToIndices = (symbols: string[]) => {
    if (socket) {
      socket.emit('market:subscribe', symbols);
    }
  };

  // Manual refresh
  const refreshData = () => {
    if (socket) {
      socket.emit('market:refresh');
    }
  };

  return {
    indices,
    marketStatus,
    isConnected,
    error,
    subscribeToIndices,
    refreshData,
  };
}

// Example React Component
export default function MarketIndicesWidget() {
  const { indices, marketStatus, isConnected, error, refreshData } =
    useMarketData();

  return (
    <div className="market-widget">
      {/* Connection Status */}
      <div className="status-bar">
        <span
          className={`connection-dot ${isConnected ? 'connected' : 'disconnected'}`}
        />
        <span>{isConnected ? 'Live' : 'Offline'}</span>

        {marketStatus && (
          <span
            className={`market-status ${marketStatus.isOpen ? 'open' : 'closed'}`}
          >
            {marketStatus.isOpen ? '🟢 Market Open' : '🔴 Market Closed'}
          </span>
        )}

        <button onClick={refreshData} disabled={!isConnected}>
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">⚠️ {error}</div>}

      {/* Market Indices */}
      <div className="indices-grid">
        {indices.map((index) => (
          <div key={index.symbol} className="index-card">
            <div className="index-name">{index.indexName}</div>
            <div className="index-value">{index.value.toLocaleString()}</div>
            <div
              className={`index-change ${index.change >= 0 ? 'positive' : 'negative'}`}
            >
              {index.change >= 0 ? '+' : ''}
              {index.change.toFixed(2)}({index.percentChange >= 0 ? '+' : ''}
              {index.percentChange.toFixed(2)}%)
            </div>
            <div className="index-updated">
              Updated: {new Date(index.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {marketStatus && !marketStatus.isOpen && (
        <div className="market-closed-notice">
          <p>Market is closed: {marketStatus.reason}</p>
          <p>Last update: {marketStatus.currentTime}</p>
        </div>
      )}
    </div>
  );
}

// CSS Styles (add to your global CSS)
/*
.market-widget {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  margin-bottom: 20px;
}

.connection-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.connection-dot.connected {
  background: #4caf50;
}

.connection-dot.disconnected {
  background: #f44336;
}

.market-status.open {
  color: #4caf50;
  font-weight: bold;
}

.market-status.closed {
  color: #f44336;
  font-weight: bold;
}

.indices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.index-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.index-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.index-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.index-change {
  font-size: 16px;
  font-weight: 600;
}

.index-change.positive {
  color: #4caf50;
}

.index-change.negative {
  color: #f44336;
}

.index-updated {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.market-closed-notice {
  background: #fff3cd;
  border: 1px solid #ffc107;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
}

.error-message {
  background: #f8d7da;
  border: 1px solid #f44336;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}
*/
