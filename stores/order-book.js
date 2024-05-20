import {defineStore} from "pinia";
import BinanceApi from "~/utils/binance-api.js";

export const useOrderBookStore = defineStore('orderBookStore', {
    state: () => {
        return ({
            _binanceApiInstance: undefined,
            isWsConnected: false,
            isBusyWsConnecting: false,
            symbol: 'BTCUSDT',
            lastUpdateId: undefined,
            hadFirstMatchingEvent: false,
            bids: [],
            asks: [],
            displayConfig: {
                limit: 12,
            },
        });
    },
    actions: {
        async connect() {
            this.isBusyWsConnecting = true;
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
                    onMessage: (decoded) => this._onWsApiMessage(decoded),
                }));
            }
            this._binanceApiInstance.connect({
                symbol: this.symbol,
                onOpen: () => {
                    this.refreshSnapshot();
                    this.isWsConnected = true;
                    this.isBusyWsConnecting = false;
                },
            });
        },
        disconnect() {
            this.isWsConnected = false;
            this.lastUpdateId = undefined;
            this.hadFirstMatchingEvent = false;
            this.bids = [];
            this.asks = [];
            this._binanceApiInstance.disconnect();
        },
        async refreshSnapshot() {
            const {
                data,
            } = await this._binanceApiInstance.fetchDepthSnapshot({
                limit: this.displayConfig.limit,
            });
            const response = data.value;
            this.hadFirstMatchingEvent = false;
            this.lastUpdateId = response.lastUpdateId;
            this.bids = response.bids;
            this.asks = response.asks;
        },
        _onWsApiMessage(decoded) {
            if (!this.lastUpdateId) {
                return;
            }
            if (decoded.u <= this.lastUpdateId) {
                return;
            }
            if (!this.hadFirstMatchingEvent) {
                if ((decoded.U > (this.lastUpdateId + 1)) || (decoded.u < (this.lastUpdateId + 1))) {
                    return;
                }
            } else {
                if (decoded.U !== (this.lastUpdateId + 1)) {
                    return;
                }
            }
            this._patchOrders(decoded);
            this.lastUpdateId = decoded.u;
            this.hadFirstMatchingEvent = true;
        },
        _patchOrders(decoded) {
            this.bids = [
                ...decoded.b,
                ...this.bids,
            ].slice(0, this.displayConfig.limit);
            this.asks = [
                ...decoded.a,
                ...this.asks,
            ].slice(0, this.displayConfig.limit);
        },
    },
})
