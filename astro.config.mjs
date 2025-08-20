// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify'; // ✅ ESTA LÍNEA ES IMPORTANTE

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  output: 'server',
  adapter: netlify(), // ✅ USÁ el adaptador de Netlify
});
