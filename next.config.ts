import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode; SWC minification and modern bundles are default in current Next.js
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com','assets.aceternity.com'],
  },
};

export default nextConfig;
