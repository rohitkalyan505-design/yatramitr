/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/live-trip',
        destination: '/trip',
        permanent: false,
      },
      {
        source: '/live',
        destination: '/trip',
        permanent: false,
      },
      {
        source: '/fair-price',
        destination: '/price-check',
        permanent: false,
      },
      {
        source: '/checkin',
        destination: '/trip',
        permanent: false,
      },
      {
        source: '/check-in',
        destination: '/trip',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
