module.exports = {
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.js", "**/*.test.js"],
    transform: {
        "^.+\\.js$": "babel-jest",
    },
    moduleFileExtensions: ["js", "json"],
};
