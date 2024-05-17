export default function () {
    function connect() {
        if (orderBookStore.socketInstance) {
            return;
        }


        let socket = new WebSocket(binanceApiDepthWsUrl);

        socket.onopen = () => _onOpen();
        socket.onmessage = (ev) => _onMessage(ev);
        socket.onerror = (ev) => _onError(ev);
        socket.onclose = (ev) => _onClose(ev);

        orderBookStore.replaceSocketInstance(socket);
    }
}
