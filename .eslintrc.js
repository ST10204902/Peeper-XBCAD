module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "@react-native-community",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-native", "prettier", "jest"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2021,
    sourceType: "module",
  },
  env: {
    "react-native/react-native": true,
    "jest/globals": true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
    jest: {
      version: "detect",
    },
  },
  rules: {
    "prettier/prettier": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "react-native/no-unused-styles": "error",
    "react-native/split-platform-components": "error",
    "react-native/no-inline-styles": "error",
    "react-native/no-color-literals": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx"],
      env: {
        "jest/globals": true,
      },
      rules: {
        "no-console": "off",
      },
    },
  ],
};
