import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
        '@organisms': '/src/components/organisms',
        '@molecules': '/src/components/molecules',
        '@atoms': '/src/components/atoms',
        '@templates': '/src/components/templates',
        '@lib': '/src/lib',
        '@utils': '/src/utils',
        '@styles': '/src/styles',
        '@layouts': '/src/layouts',
        '@pages': '/src/pages',
        '@data': '/src/data',
        '@i18n': '/src/i18n'
      }
    }
  }
});