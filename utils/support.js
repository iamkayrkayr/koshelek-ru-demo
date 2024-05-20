export function isClientSide() {
    return typeof window === 'object';
}

export function isServerSide() {
    return !isClientSide();
}

export function urlWithQuery(url, queryCb = undefined) {
    const urlObj = new URL(url);
    queryCb && queryCb(urlObj.searchParams);
    return urlObj.toString();
}
