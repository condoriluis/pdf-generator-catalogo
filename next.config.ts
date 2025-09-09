import type { NextConfig } from "next";

const config: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    localPatterns: [
      {
        pathname: "/assets/images/**",
        search: "",
      },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;