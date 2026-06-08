import type { NextConfig } from "next";

// Only apply /tarot basePath when deploying to GitHub Pages via CI
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const BASE_PATH = isGitHubPages ? "/tarot" : "";

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
