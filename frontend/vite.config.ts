import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@trader': path.resolve(__dirname, '../trader/src'),
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
});
