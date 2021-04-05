module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  cacheDirectory: './jest-cache',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!test/**',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/test/'
  ],
  rootDir: '.',
  testMatch: [
    '**/test/**/*.test.ts'
  ]
};