export const getImageUrl = (file: string) => {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) {
    throw new Error('NEXT_PUBLIC_SITE_URL is required for email images');
  }
  return `${origin}/static/${file}`;
};
