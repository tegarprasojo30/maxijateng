import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // ⬅️ WAJIB untuk Cloudflare Pages biar path tidak error

  build: {
    outDir: 'dist', // default Vite, tapi kita pertegas
    emptyOutDir: true
  },

  server: {
    port: 5173,
    open: true
  }
});
