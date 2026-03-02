module.exports = process.env.CI ? require("./dist") : require("./src");
