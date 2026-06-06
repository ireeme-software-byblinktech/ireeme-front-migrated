/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/api/v1/:path*',
          destination: 'http://localhost:3000/api/v1/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
