module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'tailwind.config.js'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    // This project uses JSX without runtime React imports and does not ship
    // PropTypes. Type validation will be introduced with a future TS migration.
    'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }],
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      files: [
        'src/pages/Course/**/*.{js,jsx}',
        'src/pages/Exams/**/*.{js,jsx}',
        'src/components/AboutPage/**/*.{js,jsx}',
        'src/components/Homepage/**/*.{js,jsx}',
        'src/components/ServicesPage/**/*.{js,jsx}',
        'src/components/ExploreCityPage/**/*.{js,jsx}',
        'src/components/GalleryPage/**/*.{js,jsx}',
        'src/components/common/backup.jsx',
        'src/text.jsx',
      ],
      rules: { 'no-unused-vars': 'off' },
    },
  ],
}
