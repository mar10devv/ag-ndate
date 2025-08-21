// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

// Detecta si estás en Netlify (cuando deployás en la nube)
const isNetlify = process.env.NETLIFY === "true";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  output: isNetlify ? "server" : "static", // 👈 en local = static, en Netlify = server
  adapter: netlify(),
});
