export function isClientSide() {
    return typeof window === 'object';
}

export function isServerSide() {
    return !isClientSide();
}
