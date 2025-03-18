/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cheery-butterfly-223.convex.cloud',
              },
            {
                protocol: 'https',
                hostname: 'xnp6i843pr.ufs.sh',
              },
        ]
    }
   
};

export default nextConfig;