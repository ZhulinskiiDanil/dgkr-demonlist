import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'levelthumbs.prevter.me',
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'purecatamphetamine.github.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
