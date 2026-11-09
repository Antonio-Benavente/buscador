export const API_URL = import.meta.env.VITE_TMDB_PROXY_URL || 'https://api.themoviedb.org/3';

export const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const USA_PROXY = !API_URL.startsWith('https://api.themoviedb.org');

if (import.meta.env.DEV && !TOKEN && !USA_PROXY) {
    console.warn('[TMDB] Falta VITE_TMDB_TOKEN — revisa tu archivo .env');
}
