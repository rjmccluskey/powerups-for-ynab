module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/pending-transactions',
  moduleNameMapper: {
    '^[./]+config$': '<rootDir>/src/app/config-test.js',
  },
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'pending-transactions',
};
