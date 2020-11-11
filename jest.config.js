module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
        '/node_modules/(?!(@equinor/eds-tokens|@equinor/eds-icons))',
  ],
  transform: {
        "^.+\\.(js|ts|tsx)$": "ts-jest"
  },
      globals: {
    crypto: require('crypto')
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.ts"
  ]
};

