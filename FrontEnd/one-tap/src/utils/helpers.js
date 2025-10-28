export const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + '...';
};

export const generateProfileUrl = (username) => {
  return `${window.location.origin}/${username}`;
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getDomainFromUrl = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (error) {
    console.error(error);
    return url;
  }
};
