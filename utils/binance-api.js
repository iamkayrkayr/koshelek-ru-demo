import {useFetch} from "#app";
import {replaceWildcards, sortArrayBy, urlWithQuery} from "~/utils/support.js";

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
     * @type {Number}
     * @private
     */
    _hardLimit = 1000;

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

        this._socketInstance = socket;
    }

    disconnect({
                   onClose = undefined,
               } = {}) {
        if (!this._socketInstance) {
            return;
        }

        this._socketInstance.onclose = () => {
            onClose && onClose();
        };
        this._socketInstance.close();
        this._socketInstance = undefined;
    }

    async fetchDepthSnapshot({
                                 symbol,
                                 limit = this._hardLimit,
                             } = {}) {
        return useFetch(
            urlWithQuery(
                this._binanceApiDepthSnapshotUrl,
                q => {
                    q.set('symbol', symbol.toUpperCase());
                    q.set('limit', limit);
                }
            )
        );
    }

    sanitizeEntries(entries) {
        return entries.filter(entry => (entry[1] > 0));
    }

    mergeEntries(original, append, {
        isDesc = false,
    } = {}) {
        const resultMap = new Map(original.map(e => [e[0], e]));
        append.forEach(entry => {
            resultMap.set(entry[0], entry);
        });
        const cleanMergedEntries = this.sanitizeEntries([...resultMap.values()]);
        const sortedEntries = sortArrayBy(cleanMergedEntries, 0, isDesc);
        return sortedEntries.slice(0, this._hardLimit);
    }

    _onMessage(ev) {
        const {
            data,
        } = ev;
        const decoded = JSON.parse(data);
        this._onMessageListener(decoded, ev);
    }

    _onError(ev) {
        console.error('error connecting to ws:', ev);
    }
}

export default BinanceApi;
