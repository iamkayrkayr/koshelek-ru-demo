import {useFetch} from "#app";
import {urlWithQuery} from "~/utils/support.js";

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

    constructor({
                    binanceApiDepthWsUrl,
                    binanceApiDepthSnapshotUrl,
                }) {
        this._binanceApiDepthWsUrl = binanceApiDepthWsUrl;
        this._binanceApiDepthSnapshotUrl = binanceApiDepthSnapshotUrl;
    }

    connect() {
        if (this._socketInstance) {
            return;
        }

        let socket = new WebSocket(this._binanceApiDepthWsUrl);

        socket.onopen = () => this._onOpen();
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

    async fetchDepthSnapshot() {
        return useFetch(
            urlWithQuery(
                this._binanceApiDepthSnapshotUrl,
                q => {
                    q.set('symbol', 'BTCUSDT');
                    q.set('limit', 16);
                }
            )
        );
    }

    _onOpen() {
        console.log('_onOpen');
    }

    _onMessage(ev) {
        console.log('_onMessage');
    }

    _onError(ev) {
        console.log('_onError', ev);
    }

    _onClose(ev) {
        console.log('_onClose', ev);
    }
}

export default BinanceApi;
