module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ['<rootDir>/packages/(?:.+?)/lib/'],
  coveragePathIgnorePatterns: ['<rootDir>/packages/(?:.+?)/lib/']
}
