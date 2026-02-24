import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // -- Code quality --
      // Detect and auto-fix unused imports
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // Self-closing components and HTML elements
      "react/self-closing-comp": ["error", { component: true, html: true }],

      // Enforce Next.js Image component
      "@next/next/no-img-element": "error",

      // Ban alert/confirm/prompt - use proper UI
      "no-restricted-globals": [
        "error",
        { name: "alert", message: "Use a Dialog or toast instead of alert()" },
        { name: "confirm", message: "Use a Dialog for confirmations instead of confirm()" },
        { name: "prompt", message: "Use a Dialog with Input instead of prompt()" },
      ],

      // Warn on unescaped entities in JSX
      "react/no-unescaped-entities": "warn",
    },
  },
]);

export default eslintConfig;
