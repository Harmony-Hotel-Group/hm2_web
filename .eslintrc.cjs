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
    'src/components/organisms/booking/BookingForm.astro',
    'src/components/organisms/booking/BookingSummaryModal.astro',
    'src/components/organisms/booking/BookingVehicleSection.astro',
    'src/components/organisms/booking/DateRangePickerField.astro',
    'src/layouts/Layout.astro',
    'src/pages/contacto.astro',
    'src/pages/experiencias.astro',
    'src/pages/habitaciones/index.astro',
  ],
};