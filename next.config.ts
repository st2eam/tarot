import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const BASE_PATH = isProd ? "/tarot" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

export default nextConfig;
