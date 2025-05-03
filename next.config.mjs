/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'lovely-flamingo-139.convex.cloud'
            },

            {
                protocol:'https',
                hostname:'resilient-hyena-104.convex.cloud'
            },
            {
                protocol:'https',
                hostname:'img.clerk.com'
            }


        ],
        domains: ["encrypted-tbn0.gstatic.com"],
    }
};

export default nextConfig;
