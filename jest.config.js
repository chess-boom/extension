module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src/__tests__"],
    collectCoverage: true,
    collectCoverageFrom: [
        "<rootDir>/src/api/*.{js,jsx,ts,tsx}",
        "<rootDir>/src/chrome/*.{js,jsx,ts,tsx}",
        "<rootDir>/src/popup/*.{js,jsx,ts,tsx}",
        "!<rootDir>/src/**/*.interface.{js,jsx}",
        "!<rootDir>/src/**/*.mock.{js,jsx}",
        "!<rootDir>/src/**/*.module.{js,jsx}",
        "!<rootDir>/src/**/*.spec.{js,jsx}",
        "!<rootDir>/src/**/*.test.{js,jsx}",
        "!<rootDir>/src/**/*.d.{js,jsx}",
    ],
    coverageThreshold: {
        global: {
            branches: 75,
        },
    },
};
