import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../utils/constants';

export const useSSE = (maxItems = 50) => {
  const [transactions, setTransactions] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const esRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('fraudeye_token');
    const url = `${API_BASE_URL}/api/stream/transactions${token ? `?token=${token}` : ''}`;

    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setError(null);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTransactions((prev) => {
          const updated = [data, ...prev];
          return updated.slice(0, maxItems);
        });
      } catch (e) {
        console.error('SSE parse error:', e);
      }
    };

    es.onerror = () => {
      setConnected(false);
      setError('SSE connection lost. Reconnecting...');
    };

    return () => {
      es.close();
      setConnected(false);
    };
  }, [maxItems]);

  const clear = () => setTransactions([]);

  return { transactions, connected, error, clear };
};