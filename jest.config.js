module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/api/**/*.test.js',
  ],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test-results', outputName: 'junit.xml' }],
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['app/src/**/*.js'],
};
