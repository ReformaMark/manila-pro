/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'xnp6i843pr.ufs.sh',
            },
        ]
    }
};

export default nextConfig;