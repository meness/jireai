const { withSentryConfig } = require('@sentry/nextjs');
const nextBundleAnalyzer = require('@next/bundle-analyzer');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { i18n } = require('./next-i18next.config');

// TODO Remove 'unsafe-'s when nonce technique is implemented for Google Tag Manager
const contentSecurityPolicy = `
upgrade-insecure-requests;

default-src 'self';

script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://tagmanager.google.com *.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://www.google.com https://googleads.g.doubleclick.net https://www.googleanalytics.com https://vercel.live https://vercel.com;

style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com;

font-src 'self' https://fonts.gstatic.com https://assets.vercel.com;

img-src 'self' data: blob: www.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com *.google-analytics.com *.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://www.google-analytics.com https://www.googletagmanager.com https://*.vercel.com https://vercel.com https://nowpayments.io;

connect-src * 'self' data: *.google-analytics.com *.analytics.google.com *.googletagmanager.com wss://*.pusher.com https://vitals.vercel-insights.com;

frame-src 'self' https://bid.g.doubleclick.net https://vercel.live;

report-uri ${process.env.SENTRY_CSP_REPORT_URI};

media-src * 'self';

frame-ancestors 'none';

object-src 'none';
`;

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // TODO Delete this header when 'unsafe-inline's removed from CSP
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Permissions-Policy',
    value: 'fullscreen=(), autoplay=()',
  },
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'Expect-CT',
    value: `report-uri="${process.env.SENTRY_CSP_REPORT_URI}"`,
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload', // 2 years
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin', // https://scotthelme.co.uk/a-new-security-header-referrer-policy/
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.tsx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            filenameCase: 'kebab',
            memo: true,
            icon: true,
          },
        },
      ],
    });

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'node_modules/tinymce'),
            to: path.join(__dirname, 'public/assets/js/tinymce'),
          },
        ],
      }),
    );

    return config;
  },
  experimental: {
    outputFileTracingExcludes: ['**canvas**'],
  },
  // StrictMode renders components twice (in dev environment only) in order to detect any problems with your code and warn you about them (which can be quite useful).
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  headers: async () => {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          headers: securityHeaders,
        },
      ];
    }

    return [];
  },
  i18n,
};

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withSentryConfig(
    nextConfig,
    { silent: true },
    { disableLogger: process.env.NODE_ENV === 'production', hideSourceMaps: true },
  ),
);
