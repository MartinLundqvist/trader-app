import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // transform: {
  //   '^.+\\.[tj]sx?$': [
  //     'ts-jest',
  //     {
  //       useESM: true,
  //     },
  //   ],
  // },
  rootDir: 'src',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/*.ts'],
  // extensionsToTreatAsEsm: ['.ts'],
};

export default jestConfig;
