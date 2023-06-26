import { UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import wasm from 'vite-plugin-wasm';
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
const config: UserConfig = {
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
  ],
  build: {
    target: 'es6',
    rollupOptions: {
      output: {
        manualChunks: {
          gpujs: ['gpu.js'],
          reactdom: ['react-dom']
        }
      },
    }
  }
};

export default config;