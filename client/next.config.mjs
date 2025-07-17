/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: undefined,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
    domains: [
      "image.tmdb.org",
      "i.pravatar.cc",
      "fakestoreapi.com",
      "cdn.pixabay.com",
      "encrypted-tbn2.gstatic.com",
      "www.gomatch.nl",
      "localhost",
    ],
  },
};

export default nextConfig;
