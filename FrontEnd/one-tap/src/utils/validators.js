export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
export const wordCount = (text = '') =>
  text.trim() ? text.trim().split(/\s+/).length : 0;
