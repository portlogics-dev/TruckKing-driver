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
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
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
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["module:metro-react-native-babel-preset"],
    },
  },
};
