const baseConfig = require('./jest.config');


module.exports = {
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/*.integration.spec.ts'],
  bail: false,
  verbose: false,
  collectCoverage: false,
  coverageDirectory: './coverage/jest/integration',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: [
    ".*integration.spec.ts$"
  ],
  coverageThreshold: {
    global: {
      statements: 50
    },
  },
  roots: [
    "<rootDir>"
  ],
  modulePaths: [
    "<rootDir>"
  ],
  moduleDirectories: [
    "node_modules"
  ],
};


