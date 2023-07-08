"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Sync object
const config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    "testMatch": [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
exports.default = config;
