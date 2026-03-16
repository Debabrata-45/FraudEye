import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist", "node_modules"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Allow PascalCase, ALL_CAPS, and framer-motion namespace imports
      // (motion.div / AnimatePresence are used as JSX tags, not direct calls)
      "no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^([A-Z_]|motion$|AnimatePresence$)",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // Disable — closing a mobile drawer on route change is a valid
      // intentional setState in effect. Not a cascade risk.
      "react-hooks/exhaustive-deps": "warn",

      // Turned off: this rule is too strict for the drawer-close pattern.
      // setMobileOpen(false) on pathname change is correct React behavior.
      ...(reactHooks.rules?.["set-state-in-effect"]
        ? { "react-hooks/set-state-in-effect": "off" }
        : {}),
    },
  },
];
