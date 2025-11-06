import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Ignore build artifacts and deps
  { ignores: ['dist/**', 'node_modules/**'] },
  // Recommended TypeScript ESLint rules
  ...tseslint.configs.recommended,
  // Disable rules that conflict with Prettier
  eslintConfigPrettier,
  // Project-specific tweaks (optional slot)
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // Add custom rules here if desired
    },
  }
);

