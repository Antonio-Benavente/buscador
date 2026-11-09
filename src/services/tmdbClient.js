import { API_URL, TOKEN } from '../utils/config.js';

const TTL_MS = 5 * 60 * 1000;

const MAX_ENTRADAS = 200;

const cache = new Map();

export function limpiarCacheTmdb() {
    cache.clear();
}

function leerCache(url) {
    const entrada = cache.get(url);
    if (!entrada) return null;

    if (Date.now() > entrada.caduca) {
        cache.delete(url);
        return null;
    }

    return entrada.datos;
}

async function pedir(url, signal) {
    const response = await fetch(url, {
        headers: TOKEN
            ? {
                  Authorization: `Bearer ${TOKEN}`,
                  accept: 'application/json',
              }
            : { accept: 'application/json' },
        signal,
    });

    if (!response.ok) {
        let detail = response.statusText;
        try {
            const body = await response.json();
            if (body?.status_message) detail = body.status_message;
            else if (body) detail = JSON.stringify(body);
        } catch {
            try {
                detail = await response.text();
            } catch {
                detail = response.statusText;
            }
        }

        const error = new Error(`TMDB ${response.status}: ${detail}`);
        error.status = response.status;
        throw error;
    }

    return response.json();
}

export async function tmdbFetch(path, { idioma, page, query, signal, cache: usarCache = true, ...extra } = {}) {
    const params = new URLSearchParams();

    if (query !== undefined) params.set('query', query);
    if (idioma) params.set('language', idioma);
    if (page) params.set('page', page);

    for (const [key, value] of Object.entries(extra)) {
        if (value !== undefined && value !== null && value !== '' && key !== 'signal') {
            params.set(key, String(value));
        }
    }

    const queryString = params.toString();
    const url = `${API_URL}${path}${queryString ? `?${queryString}` : ''}`;

    if (!usarCache) return pedir(url, signal);

    const cached = leerCache(url);
    if (cached) return cached;

    const datos = await pedir(url, signal);

    if (cache.size >= MAX_ENTRADAS) {
        const masAntigua = cache.keys().next().value;
        if (masAntigua !== undefined) cache.delete(masAntigua);
    }

    cache.set(url, { caduca: Date.now() + TTL_MS, datos });

    return datos;
}
