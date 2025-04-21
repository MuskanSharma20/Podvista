/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'lovely-flamingo-139.convex.cloud'
            },

        ],
        domains: ["encrypted-tbn0.gstatic.com"],
    }
};

export default nextConfig;
