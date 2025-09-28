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
    domains: ['images.unsplash.com', 'artverse.site', 'localhost'],
    unoptimized: true,
  },
};

export default nextConfig;
