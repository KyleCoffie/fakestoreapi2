module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules', 'src'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Add setup file for polyfills
    moduleNameMapper: {
      // Mock CSS files
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      // You might keep or remove the react-router-dom line depending on other needs
      // "react-router-dom": "<rootDir>/node_modules/react-router-dom",
    },
    // Remove the explicit transform, rely on ts-jest preset
    // transform: {
    //   '^.+\\.tsx?$': 'ts-jest',
    // },
    // setupFilesAfterEnv: ['<rootDir>/src/setupTests.tsx'], // Removed
    // transformIgnorePatterns: [ // Removed
    //   // Default: '/node_modules/'
    //   // Allow react-router and related modules to be transformed
    //   '/node_modules/(?!react-router|react-router-dom|@remix-run)',
    // ],
};
