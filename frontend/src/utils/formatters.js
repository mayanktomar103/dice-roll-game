export const formatCoins = (amount) => {
  if (amount === undefined || amount === null) return '0';
  return Number(amount).toLocaleString();
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
