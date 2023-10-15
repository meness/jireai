const path = require('path');

/** @type {import('next-i18next').UserConfig} */
const options = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  reloadOnPrerender: true,
  cleanCode: true,
  keySeparator: '.',
  contextSeparator: '_',
  fallbackLng: false,
  fallbackNS: false,
  nsSeparator: ':',
  localePath: path.resolve('./public/locales'),
};

module.exports = options;
