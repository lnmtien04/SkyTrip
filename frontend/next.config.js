const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  images: { /* ... */ },
  ...(isProd ? {} : {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ];
    },
  }),
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;