export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
      // Mock CSS and other style files
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

      // Mock image and asset files
      '\\.(jpg|jpeg|png|gif|webp|svg|eot|otf|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
    },
    setupFiles: ['./jest.setup.ts'],
  };
