import {defineStore} from "pinia";
import BinanceApi from "~/utils/binance-api.js";

export const useOrderBookStore = defineStore('orderBookStore', {
    state: () => {
        return ({
            _binanceApiInstance: undefined,
            isWsConnected: false,
        });
    },
    actions: {
        connect() {
            if (this._binanceApiInstance === undefined) {
                const {
                    public: {
                        binanceApiDepthWsUrl,
                    },
                } = useRuntimeConfig();
                this._binanceApiInstance = markRaw(new BinanceApi({
                    binanceApiDepthWsUrl,
                }));
            }
            this._binanceApiInstance.connect();
            this.isWsConnected = true;
        },
        disconnect() {
            this.isWsConnected = false;
            this._binanceApiInstance.disconnect();
        },
    },
})
