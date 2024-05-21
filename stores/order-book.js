import {defineStore} from "pinia";
import BinanceApi from "~/utils/binance-api.js";

export const useOrderBookStore = defineStore('orderBookStore', {
    state: () => {
        return ({
            _binanceApiInstance: undefined,
            isWsConnected: false,
            isBusyWsConnecting: false,
            //
            symbolOptions: [
                {
                    title: 'BTC/USDT',
                    value: 'btcusdt',
                },
                {
                    title: 'BNB/BTC',
                    value: 'bnbbtc',
                },
                {
                    title: 'ETH/BTC',
                    value: 'ethbtc',
                },
            ],
            selectedSymbolKey: 'btcusdt',
            isBusyChangingSymbol: false,
            //
            lastUpdateId: undefined,
            hadFirstMatchingEvent: false,
            bids: [],
            asks: [],
            displayConfig: {
                limit: 15,
            },
        });
    },
    getters: {
        bidsSlice: state => state.bids.slice(0, state.displayConfig.limit),
        asksSlice: state => state.asks.slice(0, state.displayConfig.limit),
        symbol: state => state.selectedSymbolKey,
        selectedSymbolInfo: state => state.symbolOptions.find(option => (option.value === state.selectedSymbolKey)),
    },
    actions: {
        async connect(onOpen = undefined) {
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
                onOpen: async () => {
                    await this.refreshSnapshot();
                    this.isWsConnected = true;
                    this.isBusyWsConnecting = false;
                    onOpen && onOpen();
                },
            });
        },
        disconnect(onClose = undefined) {
            this.isWsConnected = false;
            this.lastUpdateId = undefined;
            this.hadFirstMatchingEvent = false;
            this.bids = [];
            this.asks = [];
            this._binanceApiInstance.disconnect({
                onClose: () => {
                    onClose && onClose();
                }
            });
        },
        async refreshSnapshot() {
            const {
                data,
            } = await this._binanceApiInstance.fetchDepthSnapshot({
                symbol: this.symbol,
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
            this.bids = this._binanceApiInstance.mergeEntries(
                toRaw(this.bids),
                decoded.b,
                {
                    limit: this.displayConfig.limit,
                    isDesc: true,
                },
            );
            this.asks = this._binanceApiInstance.mergeEntries(
                toRaw(this.asks),
                decoded.a,
                {
                    limit: this.displayConfig.limit,
                    isDesc: false,
                },
            );
        },
        updateSymbol(symbol) {
            this.isBusyChangingSymbol = true;
            this.selectedSymbolKey = symbol;
            this.disconnect(() => {
                this.connect(() => {
                    this.isBusyChangingSymbol = false;
                });
            });
        },
    },
})
