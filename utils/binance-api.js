import {useFetch} from "#app";
import {replaceWildcards, urlWithQuery} from "~/utils/support.js";

class BinanceApi {
    /**
     * @type {WebSocket}
     * @private
     */
    _socketInstance = undefined;

    /**
     * @type {String}
     * @private
     */
    _binanceApiDepthWsUrl = undefined;

    /**
     * @type {String}
     * @private
     */
    _binanceApiDepthSnapshotUrl = undefined;

    /**
     * @type {Function}
     * @private
     */
    _onMessageListener = undefined;

    constructor({
                    binanceApiDepthWsUrl,
                    binanceApiDepthSnapshotUrl,
                    onMessage = undefined,
                }) {
        this._binanceApiDepthWsUrl = binanceApiDepthWsUrl;
        this._binanceApiDepthSnapshotUrl = binanceApiDepthSnapshotUrl;
        this._onMessageListener = onMessage || (() => {
        });
    }

    connect({
                symbol,
                onOpen = undefined,
            }) {
        if (this._socketInstance) {
            return;
        }

        const wsUrl = replaceWildcards(this._binanceApiDepthWsUrl, {
            symbol: symbol.toLowerCase(),
        });
        let socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            onOpen && onOpen();
        };
        socket.onmessage = (ev) => this._onMessage(ev);
        socket.onerror = (ev) => this._onError(ev);
        socket.onclose = (ev) => this._onClose(ev);

        this._socketInstance = socket;
    }

    disconnect() {
        if (!this._socketInstance) {
            return;
        }

        this._socketInstance.close();
        this._socketInstance = undefined;
    }

    async fetchDepthSnapshot({
                                 limit = 16,
                             } = {}) {
        return useFetch(
            urlWithQuery(
                this._binanceApiDepthSnapshotUrl,
                q => {
                    q.set('symbol', 'BTCUSDT');
                    q.set('limit', limit);
                }
            )
        );
    }

    _onMessage(ev) {
        const {
            data,
        } = ev;
        const decoded = JSON.parse(data);
        this._onMessageListener(decoded, ev);
    }

    _onError(ev) {
        console.log('_onError', ev);
    }

    _onClose(ev) {
        console.log('_onClose', ev);
    }
}

export default BinanceApi;
