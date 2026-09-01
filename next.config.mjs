/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  turbopack: {
    resolveAlias: {
      canvas: "./lib/emptyModule.js",
      encoding: "./lib/emptyModule.js",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };
    return config;
  },
};

export default nextConfig;