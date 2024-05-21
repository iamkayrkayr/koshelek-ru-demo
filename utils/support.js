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

export function sortArrayBy(arr, key, isDesc = false) {
    arr.sort((e1, e2) => ((e1[key] - e2[key]) * (isDesc ? -1 : 1)));
    return arr;
}

export function jsonDecodeSafe(input, fallback = undefined) {
    try {
        return JSON.parse(input);
    } catch (err) {
        //
    }
    return fallback;
}
