/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "clubs.iiit.ac.in",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "http",
                hostname: "dev.clubs.iiit.ac.in",
            },
            {
                protocol: "https",
                hostname: "dev.clubs.iiit.ac.in",
            },
            {
                protocol: "https",
                hostname: "zone-assets-api.vercel.app",
            },
        ],
    },
};

module.exports = nextConfig;
