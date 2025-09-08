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
};

export default config;