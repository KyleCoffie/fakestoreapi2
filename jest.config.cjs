module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules', 'src'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Add setup file for polyfills
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    "transform": {
        "^.+\\.m?[jt]sx?$": "jest-esm-transformer"
      }
    ,
    
      "extensionsToTreatAsEsm": [".ts",".mjs"]
};
   
