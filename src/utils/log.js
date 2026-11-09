export function logError(error, contexto = 'app') {
    if (import.meta.env.DEV) {
        console.error(`[${contexto}]`, error);
    }
}
