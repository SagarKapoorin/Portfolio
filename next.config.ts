import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "razorpay",
    "nodemailer",
    "mjml",
    "handlebars",
    "redis",
    "bcryptjs",
  ],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@headlessui/react",
      "react-toastify",
      "@tabler/icons-react",
    ],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "assets.aceternity.com" },
    ],
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
