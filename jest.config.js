module.exports = {
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    verbose: true,
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        '/node_modules/(?!(@equinor/eds-tokens|@equinor/eds-icons|@equinor/procosys-webapp-components))',
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
        '^.+\\.(svg|png)$': '<rootDir>/src/test/imgTransform.js',
    },
    globals: {
        crypto: require('crypto'),
    },
    setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
};
