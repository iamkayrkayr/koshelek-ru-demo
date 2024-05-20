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

export function replaceWildcards(s, replace) {
    return Object.keys(replace)
        .reduce((carryString, key) => {
            return carryString.replaceAll(`{${key}}`, replace[key]);
        }, s);
}
