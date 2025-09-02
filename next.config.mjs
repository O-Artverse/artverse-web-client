/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    }
  },
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
};

export default nextConfig;
