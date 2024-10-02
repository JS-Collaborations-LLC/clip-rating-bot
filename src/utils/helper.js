const calculateAverageRating = (ratings) => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return sum / ratings.length;
};

const isValidClipUrl = (url) => {
  // This is a basic check. You might want to add more specific validation.
  const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|twitch\.tv)\/\S+$/;
  return urlPattern.test(url);
};

const formatDate = (date) => {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const truncateString = (str, maxLength) => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

module.exports = {
  calculateAverageRating,
  isValidClipUrl,
  formatDate,
  generateUniqueId,
  truncateString
};
