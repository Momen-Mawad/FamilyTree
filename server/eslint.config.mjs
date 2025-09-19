import { configs } from "@eslint/js";
import prettier from "eslint-config-prettier";
import nodePlugin, { configs as _configs } from "eslint-plugin-node";

export default [
  // Base recommended rules from @eslint/js
  configs.recommended,

  // Node.js-specific rules
  {
    plugins: {
      node: nodePlugin,
    },
    rules: {
      ..._configs.recommended.rules,
      "node/no-unsupported-features/es-syntax": [
        "error",
        { ignores: ["modules"] },
      ],
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
    },
  },

  // Prettier configuration to turn off conflicting rules
  prettier,
];
