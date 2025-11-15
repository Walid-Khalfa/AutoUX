export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', 'e2e'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/__tests__/**',
  ],
};
