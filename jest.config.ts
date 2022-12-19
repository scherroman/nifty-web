import type { Config } from 'jest'

const CONFIG: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules'],
    setupFiles: ['./tests/setup.ts'],
    testPathIgnorePatterns: ['./tests/endToEnd']
}

export default CONFIG
