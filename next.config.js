/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force dynamic rendering for Vercel
  trailingSlash: false,
  
  // Experimental features for dynamic behavior  
  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: [],
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },

    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig