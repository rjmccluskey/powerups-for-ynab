module.exports = {
  name: 'pending-transactions',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/pending-transactions',
  moduleNameMapper: {
    "^[./]+config$": '<rootDir>/src/app/config-test.js'
  }
};
