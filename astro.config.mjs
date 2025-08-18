// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()], // 👈 solo tailwind acá
  },
  integrations: [react()],    // 👈 react solo aquí
});
