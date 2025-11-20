/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/google",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`,
      },
      {
        source: "/api/google/login",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/login`,
      },
      {
        source: "/api/google/callback",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/callback`,
      },
      {
        source: "/api/auth/google/callback",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/callback`,
      },
    ];
  },
};

export default nextConfig;
