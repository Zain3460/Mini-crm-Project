const js = require("@eslint/js");
const jest = require("eslint-plugin-jest");
const prettier = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    plugins: {
      jest: jest,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        node: true,
        jest: true,
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        process: "readonly",
        __dirname: "readonly",
        require: "readonly",
        module: "readonly",
        console: "readonly"
      },
    },
    rules: {
      // Moha: '_' ile başlayan parametreler kullanılmasa bile uyarı vermez (Express middleware imzaları için).
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      ...jest.configs.recommended.rules,
    },
  },
  prettier,
];
