const Sentry = require('@sentry/nextjs');

Sentry.init({
  tracesSampleRate: 1.0,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  debug: false, // or process.env.NODE_ENV === 'development'
  enabled: process.env.NODE_ENV === 'production',
});
