module.exports = {
  testEnvironment: 'node',
  roots: [],
  testMatch: [
    '**/*.test.ts',
    '**/*.test.js'
  ],
  transform: {},
  modulePaths: [
    '<rootDir>/src/authorizer/node_modules',
    '<rootDir>/src/projects-api/node_modules',
    '<rootDir>/src/layers/common/3rd-party/nodejs/node14/node_modules',
    '<rootDir>/src/layers/common/common-lib/nodejs/node14/node_modules'
  ]
};
