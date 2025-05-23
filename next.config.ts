import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images:
  {
    domains: ['www.autoo.com.br'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
