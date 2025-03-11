import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
    extends: [
        js.configs.recommended,
        // ...tseslint.configs.recommended,
        ...tseslint.configs.strict,
        ...tseslint.configs.stylistic,
    ],
    files: ['src/**/*.{ts,tsx}'],
    ignores: [],
    languageOptions: {
        ecmaVersion: 2020,
    },
    plugins: {},
    rules: {},
});
