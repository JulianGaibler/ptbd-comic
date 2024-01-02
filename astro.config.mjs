import svelte from '@astrojs/svelte'
import { defineConfig } from 'astro/config'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { FULLDOMAIN } from './src/constants'

// https://astro.build/config
export default defineConfig({
  site: FULLDOMAIN,
  images: {
    formats: ['avif', 'png'],
  },
  vite: {
    ssr: {
      noExternal: ['tint*'],
    },
    resolve: {
      alias: {
        '~tint': '/node_modules/tint/dist',
        '@src': '/src',
      },
    },
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: (d) => {
            const prepend = `@use "src/styles/utils.sass" as tint\n`
            const match = d.match(/^\s*/)
            const spaces = match ? match[0] : ''
            return `${spaces}${prepend}\n${d}`
          },
        },
      },
    },
    plugins: [
      // copy every /comic/[num]/share.png to /share/[num].png
      viteStaticCopy({
        targets: [
          {
            src: 'comics/*/share.png',
            dest: 'share',
            rename: (_name, _ext, fullPath) => {
              const num = fullPath.split('/')[1]
              return `${num}.png`
            }
          },
        ],
      }),
    ],
  },
  integrations: [svelte()],
})
