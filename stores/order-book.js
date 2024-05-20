import {defineStore} from "pinia";
import BinanceApi from "~/utils/binance-api.js";

export const useOrderBookStore = defineStore('orderBookStore', {
    state: () => {
        return ({
            _binanceApiInstance: undefined,
            isWsConnected: false,
            lastUpdateId: undefined,
            bids: [],
            asks: [],
        });
    },
    actions: {
        async connect() {
            if (this._binanceApiInstance === undefined) {
                const {
                    public: {
                        binanceApiDepthWsUrl,
                        binanceApiDepthSnapshotUrl,
                    },
                } = useRuntimeConfig();
                this._binanceApiInstance = markRaw(new BinanceApi({
                    binanceApiDepthWsUrl,
                    binanceApiDepthSnapshotUrl,
                }));
            }
            await this.refreshSnapshot();
            this._binanceApiInstance.connect();
            this.isWsConnected = true;
        },
        disconnect() {
            this.isWsConnected = false;
            this._binanceApiInstance.disconnect();
        },
        async refreshSnapshot() {
            const {
                data,
            } = await this._binanceApiInstance.fetchDepthSnapshot();
            const response = data.value;
            this.lastUpdateId = response.lastUpdateId;
            this.bids = response.bids;
            this.asks = response.asks;
        },
    },
})
