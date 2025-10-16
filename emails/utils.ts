export const getImageUrl = (file: string) => {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

  if (process.env.NODE_ENV === 'development') {
    return `/static/${file}`;
  }

  return `${baseUrl}/${file}`; // dla produkcji (Next public/)
};
