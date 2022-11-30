/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ipfs.io',
                pathname: '/ipfs/**'
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '**'
            }
        ]
    }
}

module.exports = nextConfig
