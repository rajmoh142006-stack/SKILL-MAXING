export const formatDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

export const formatDisplayDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getToday = () => formatDate(new Date());

export const isValidDate = (dateStr) => {
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d.getTime());
};

export const sanitizeInput = (str, maxLength = 100) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>\"'&]/g, '').trim().slice(0, maxLength);
};
