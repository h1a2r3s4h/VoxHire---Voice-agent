/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  experimental: {
    turbo: {
      resolveAlias: {
        canvas: false,
        encoding: false,
      },
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