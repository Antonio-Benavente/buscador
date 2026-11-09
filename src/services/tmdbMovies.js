import { tmdbFetch } from './tmdbClient.js';

export function popularMovies(idioma, region, page = 1, signal, extra = {}) {
  return tmdbFetch('/movie/popular', { idioma, region, page, signal, ...extra });
}

export function nowPlayingMovies(idioma, region, page = 1, signal, extra = {}) {
  return tmdbFetch('/movie/now_playing', { idioma, region, page, signal, ...extra });
}

export function upcomingMovies(idioma, region, page = 1, signal, extra = {}) {
  return tmdbFetch('/movie/upcoming', { idioma, region, page, signal, ...extra });
}

export function topRatedMovies(idioma, region, page = 1, signal, extra = {}) {
  return tmdbFetch('/movie/top_rated', { idioma, region, page, signal, ...extra });
}

export function movieDetails(id, idioma, signal, extra = {}) {
  return tmdbFetch(`/movie/${id}`, { idioma, signal, ...extra });
}

export function movieCreditsDetails(id, idioma, signal, extra = {}) {
  return tmdbFetch(`/movie/${id}/credits`, { idioma, signal, ...extra });
}

export function movieTrailersDetails(id, idioma, signal, extra = {}) {
  return tmdbFetch(`/movie/${id}/videos`, { idioma, signal, ...extra });
}

export function movieRecommendationsDetails(id, idioma, signal, extra = {}) {
  return tmdbFetch(`/movie/${id}/recommendations`, { idioma, signal, ...extra });
}
