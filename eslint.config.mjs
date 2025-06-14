import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore linting on UI components and assets
  {
    ignorePatterns: [
      "src/components/**/*",
      "src/assets/**/*",
      "src/app/aboutme/page.tsx",
      "src/app/signin/page.tsx",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
