import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`,
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
