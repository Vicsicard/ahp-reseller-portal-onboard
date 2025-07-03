/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'reseller.aihandshake.org', 'onboard.aihandshake.org'],
  },
}

module.exports = nextConfig
