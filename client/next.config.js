/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'reseller.aihandshake.org', 'onboard.aihandshake.org', 'portal.aihandshake.org'],
  },
  // Enable support for subdomain routing in production
  async rewrites() {
    return {
      beforeFiles: [
        // For development: path-based routing
        {
          source: '/portal/:slug',
          destination: '/portal/[slug]',
        },
        // For production: subdomain-based routing
        ...(process.env.NODE_ENV === 'production' ? [
          {
            source: '/:path*',
            has: [
              {
                type: 'host',
                value: ':subdomain.portal.aihandshake.org',
              },
            ],
            destination: '/portal/:subdomain/:path*',
          },
        ] : []),
      ],
    };
  },
}

module.exports = nextConfig
