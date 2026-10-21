import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "2bn9symg6o.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
