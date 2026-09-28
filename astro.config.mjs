import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// NOTE: `site` is a placeholder domain (غير مكتمل / unconfigured).
// Replace with the real production domain before launch so canonical,
// hreflang, Open Graph and sitemap URLs are correct.
export default defineConfig({
  base: '/al-safa-residence/',
  site: 'https://al-safa-residence.example.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  integrations: [tailwind({ applyBaseStyles: false })],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});