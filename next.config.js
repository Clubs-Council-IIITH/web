const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "clubs.iiit.ac.in",
      },
      {
        protocol: "https",
        hostname: "life.iiit.ac.in",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "files",
      },
      {
        protocol: "http",
        hostname: "nginx",
      },
      {
        protocol: "http",
        hostname: "dev.clubs.iiit.ac.in",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/student-bodies/clubs",
        destination: "/clubs-council",
        permanent: true,
      },
      {
        source: "/clubs/clubs",
        destination: "/clubs-council",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/clubs-council",
        permanent: true,
      },
      {
        source: "/about/clubs-council",
        destination: "/clubs-council",
        permanent: true,
      },
    ];
  },
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  serverActions: {
    allowedOrigins: ["life.iiit.ac.in", "clubs.iiit.ac.in"],
  },
};

const withMDX = require("@next/mdx")();
module.exports = withMDX(nextConfig);
