module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules', 'src'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],

    transform: {
       '^\.+\.(js|jsx|ts|tsx|mjs|mts)$': ['ts-jest', {
            useESM: true,
            
        }],
    },

    transformIgnorePatterns: [
        '/node_modules/(?!(firebase|@firebase|@babel/runtime)/)',
        "\\.pnp\\.[^\\\/]+$" // Default Jest pattern for Yarn PnP
    ],
};
