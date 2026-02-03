import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'url'

import tailwindcss from '@tailwindcss/vite'

import { nitro, NitroPluginConfig } from 'nitro/vite'

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    devtools(),
    // @ts-ignore - Conflicting Vite version types in monorepo
    nitro({
      routeRules: {
        "/api/**": {
          proxy: (process.env.VITE_API_URL || "http://localhost:8000") + "/**",
        },
      },
    }) as NitroPluginConfig,
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    allowedHosts: ["web.ahmedlotfy.site"],
  }
})

export default config
