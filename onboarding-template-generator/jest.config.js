/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Use jsdom for browser-like environment (needed for React components, DOM manipulation)
  moduleNameMapper: {
    // Handle CSS imports (useful for component tests)
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js', // You might need to create this mock file
    // Setup path aliases for Jest to match webpack config
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1', // Added utils alias assuming it might be needed
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts' // Optional: if you need setup files (e.g., for testing library)
  ],
  // Add any other Jest configurations you need
};
