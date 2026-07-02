export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatDateInput = (date) => new Date(date).toISOString().split('T')[0];

export const calculateDays = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return 0;
  const diff = new Date(returnDate) - new Date(pickupDate);
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

export const truncate = (text, max = 100) =>
  text && text.length > max ? `${text.slice(0, max).trim()}…` : text;

export const initials = (name = '') =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
