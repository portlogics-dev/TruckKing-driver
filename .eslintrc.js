module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "@react-native-community",
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["import", "@typescript-eslint", "prettier"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
    react: {
      version: "detect",
    },
  },
  rules: {
    // import
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"],
          "internal",
          ["parent", "sibling"],
          "index",
        ],
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "@/**",
            group: "internal",
            position: "after",
          },
        ],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    // prettier
    "prettier/prettier": "warn",
    // typescript-unused-vars
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
  ],
  overrides: [
    { files: ["*.js?(x)", "*.ts?(x)"] },
    {
      // Test files only
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
    {
      files: ["./i18n/key.ts"],
      rules: {
        "sort-keys-fix/sort-keys-fix": [
          "error",
          "asc",
          { caseSensitive: false, natural: true },
        ],
      },
    },
    {
      // config 파일들은 JavaScript 파서로 처리
      files: ["*.config.js", ".eslintrc.js"],
      parser: "espree", // JavaScript 전용 파서
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      rules: {
        // config 파일에 필요한 규칙들 추가
        "no-unused-vars": "error",
        "no-undef": "error",
        "no-console": "warn",
      },
      env: {
        node: true,
      },
    },
  ],
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["module:metro-react-native-babel-preset"],
    },
  },
};
