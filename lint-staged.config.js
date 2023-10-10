module.exports = {
  '*.css': ['stylelint --fix', 'prettier --write'],
  '*.{ts,tsx,js,json}': ['eslint --cache --fix', 'prettier --write'],
  '*.{md,svg}': ['prettier --write'],
  '.browserslistrc': ['browserslist-lint'],
  'renovate.json': ['renovate-config-validator'],
};
