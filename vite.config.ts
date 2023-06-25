import { UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
const config: UserConfig = {
  plugins: [
    react(),
    wasm()
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          gpujs: ['gpu.js'],
          reactdom: ['react-dom']
        }
      },
    }
  },
  esbuild: {
    
  },
};

export default config;