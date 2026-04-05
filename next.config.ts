import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
    ],
  },
  webpack(config) {
    // Add alias '@' pointing to the 'app' folder
    config.resolve.alias["@"] = path.resolve(__dirname, "app");
    return config;
  },
};

export default nextConfig;