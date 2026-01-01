import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle curl-cffi and its native dependencies
      // This allows curl-cffi to load its native bindings properly
      config.externals = config.externals || [];
      config.externals.push('curl-cffi');
    }
    return config;
  },
};

export default nextConfig;
