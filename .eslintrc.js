const nextConfig = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
    'no-console': 'off',
    'react-hooks/exhaustive-deps': 'off'
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'dist/',
    'server/',
  ],
}

module.exports = nextConfig