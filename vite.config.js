import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  // Dynamically set the base path for GitHub Pages deployment from package.json
  const repoName = env.npm_package_homepage ? new URL(env.npm_package_homepage).pathname : '/';
  
  return {
    base: repoName,
    plugins: [react()],
    define: {
      // Expose environment variables to the client
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})