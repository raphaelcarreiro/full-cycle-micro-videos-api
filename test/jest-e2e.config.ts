import { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  setupFilesAfterEnv: ['./jest-e2e-setup.ts'],
  // verbose: true,
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
};

export default config;
