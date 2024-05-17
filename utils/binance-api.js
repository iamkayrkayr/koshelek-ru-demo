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

    constructor({
                    binanceApiDepthWsUrl,
                }) {
        this._binanceApiDepthWsUrl = binanceApiDepthWsUrl;
    }

    connect() {
        console.info('connect');
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
