module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["prettier", "eslint:recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-unused-vars": "error",
    "no-undef": "off",
    "no-console": "off",
    "no-debugger": "error",
    "no-unused-expressions": "error",
    "no-unused-labels": "error",
    "no-use-before-define": "error",
  },
};
