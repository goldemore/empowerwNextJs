/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.esther.com.au",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.empowerwoman.az",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "95.111.229.9",
        port: "", // оставьте пустым для порта 80
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "95.111.229.9",
        port: "8000", // для прямого доступа к Django
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
