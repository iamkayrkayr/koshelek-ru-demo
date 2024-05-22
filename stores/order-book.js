import {defineStore} from "pinia";
import BinanceApi from "~/utils/binance-api.js";
import {isClientSide, jsonDecodeSafe} from "~/utils/support.js";

export const useOrderBookStore = defineStore('orderBookStore', {
    state: () => {

        const orderBookLimitOptions = [
            20,
            100,
            500,
            1000,
        ];
        const orderBookLimit = orderBookLimitOptions[0];

        return ({
            _binanceApiInstance: undefined,
            isWsConnected: false,
            isBusyWsConnecting: false,
            //
            symbolOptions: [
                {
                    title: 'BTC/USDT',
                    value: 'btcusdt',
                    pricePrecision: 2,
                },
                {
                    title: 'BNB/BTC',
                    value: 'bnbbtc',
                    pricePrecision: 6,
                },
                {
                    title: 'ETH/BTC',
                    value: 'ethbtc',
                    pricePrecision: 5,
                },
            ],
            selectedSymbolKey: 'btcusdt',
            isBusyChangingSymbol: false,
            symbolChangeLog: {
                items: [],
                hardLimit: 256,
                perPage: 10,
            },
            //
            lastUpdateId: undefined,
            hadFirstMatchingEvent: false,
            bids: [],
            asks: [],
            orderBookDisplayConfig: {
                limit: orderBookLimit,
                limitOptions: orderBookLimitOptions,
            },
        });
    },
    getters: {
        bidsSlice: state => state.bids.slice(0, state.orderBookDisplayConfig.limit),
        asksSlice: state => state.asks.slice(0, state.orderBookDisplayConfig.limit),
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
                    isDesc: true,
                },
            );
            this.asks = this._binanceApiInstance.mergeEntries(
                toRaw(this.asks),
                decoded.a,
                {
                    isDesc: false,
                },
            );
        },
        updateSymbol(symbol) {
            this.isBusyChangingSymbol = true;
            const prevSymbolKey = toRaw(this.selectedSymbolKey);
            this.selectedSymbolKey = symbol;
            this.disconnect(() => {
                this.connect(() => {
                    this.isBusyChangingSymbol = false;
                });
            });
            //
            const changedAt = (new Date()).getTime();
            this.symbolChangeLog.items.unshift({
                id: `${changedAt}:${this.symbolChangeLog.items.length}`,
                from: prevSymbolKey,
                to: symbol,
                at: changedAt,
            });
            while (this.symbolChangeLog.items.length > this.symbolChangeLog.hardLimit) {
                this.symbolChangeLog.items.pop();
            }
            this._persistState();
        },
        clearSymbolChangeLog() {
            this.symbolChangeLog.items = [];
            this._persistState();
        },
        _persistState() {
            if (!isClientSide()) {
                return;
            }
            localStorage.setItem('symbolChangeLog', JSON.stringify(this.symbolChangeLog.items.map(e => {
                return [e.from, e.to, e.at];
            })));
        },
        loadPersistedState() {
            if (!isClientSide()) {
                return;
            }
            const symbolChangeLog = jsonDecodeSafe(localStorage.getItem('symbolChangeLog')) || [];
            this.symbolChangeLog.items = symbolChangeLog.map((e, i) => {
                return {
                    id: `${e[2]}:${i}`,
                    from: e[0],
                    to: e[1],
                    at: e[2],
                };
            });
        },
    },
})
