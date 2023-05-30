/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true,
    },
    swcMinify: true,
    images: {
        domains: ["lh3.googleusercontent.com", "vercel.com"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "**",
            },
        ],
    },
    api: {
        bodyParser: false,
    },
    async redirects() {
        return [
            {
                source: "/github",
                destination: "https://github.com/steven-tey/precedent",
                permanent: false,
            },
        ];
    },
};

module.exports = nextConfig;
