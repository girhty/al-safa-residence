import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  base: '/al-safa-residence/',
  output: 'static',
  integrations: [tailwind()],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1500
    }
  }
});