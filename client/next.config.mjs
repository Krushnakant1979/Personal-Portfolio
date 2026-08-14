/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress responses
  compress: true,

  // Optimize heavy packages — reduces JS bundle size via tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-icons'],
  },

  images: {
    // Serve modern formats (avif/webp) automatically
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
