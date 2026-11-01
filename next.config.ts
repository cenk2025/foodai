import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Crawlers that don't run JavaScript must find titles and noindex in <head>, not streamed later.
  htmlLimitedBots: /.*/,
  /* config options here */
};

export default nextConfig;
