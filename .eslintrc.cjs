module.exports = {
  extends: ['plugin:astro/recommended'],
  parser: 'astro-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'astro/process-jsx': 'off',
  },
  ignorePatterns: [
    'src/components/organisms/booking/',
    'src/layouts/Layout.astro',
    'src/pages/contacto.astro',
    'src/pages/experiencias.astro',
    'src/pages/habitaciones/index.astro',
    'src/components/molecules/LanguageSwitcher.astro',
    'src/components/organisms/navigation/Navbar.astro',
    'src/pages/**/contacto.astro',
    'src/pages/**/experiencias.astro',
    'src/pages/**/habitaciones/index.astro',
  ],
};