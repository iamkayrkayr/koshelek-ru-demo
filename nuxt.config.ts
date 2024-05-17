// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, {transformAssetUrls} from "vite-plugin-vuetify";

export default defineNuxtConfig({
    app: {
        pageTransition: {
            name: 'page',
            mode: 'out-in',
        },
    },
    build: {
        transpile: ['vuetify'],
    },
    devtools: {
        enabled: true,
    },
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({autoImport: true}))
            })
        },
        '@pinia/nuxt',
    ],
    pages: true,
    runtimeConfig: {
        public: {
            binanceApiDepthWsUrl: 'wss://stream.binance.com:9443/ws/bnbbtc@depth',
        },
    },
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
})
