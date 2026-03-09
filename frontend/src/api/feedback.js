import client from './client';

export const submitFeedback = async (transactionId, verdict, notes) => {
  const res = await client.post('/api/feedback', { transactionId, verdict, notes });
  return res.data.data;
};

export const getFeedback = async (transactionId) => {
  const res = await client.get(`/api/feedback?transactionId=${transactionId}`);
  return res.data.data;
};

export const flagUser = async (userId, reason) => {
  const res = await client.post('/api/actions/flag-user', { userId, reason });
  return res.data;
};

export const flagMerchant = async (merchantId, reason) => {
  const res = await client.post('/api/actions/flag-merchant', { merchantId, reason });
  return res.data;
};