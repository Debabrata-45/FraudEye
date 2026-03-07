import client from './client';

export const getTransactions = async (params = {}) => {
  const res = await client.get('/api/transactions', { params });
  return res.data;
};

export const getTransactionById = async (id) => {
  const res = await client.get(`/api/transactions/${id}`);
  return res.data;
};

export const getAnalyticsSummary = async () => {
  const res = await client.get('/api/analytics/summary');
  return res.data;
};

export const getQueueStats = async () => {
  const res = await client.get('/api/queue/stats');
  return res.data;
};