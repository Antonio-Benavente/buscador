import { tmdbFetch } from './tmdbClient.js';

export function popularSeries(idioma, page = 1, signal, extra = {}) {
  return tmdbFetch('/tv/popular', { idioma, page, signal, ...extra });
}

export function onTheAirSeries(idioma, page = 1, signal, extra = {}) {
  return tmdbFetch('/tv/on_the_air', { idioma, page, signal, ...extra });
}

export function airingTodaySeries(idioma, page = 1, signal, extra = {}) {
  return tmdbFetch('/tv/airing_today', { idioma, page, signal, ...extra });
}

export function topRatedSeries(idioma, page = 1, signal, extra = {}) {
  return tmdbFetch('/tv/top_rated', { idioma, page, signal, ...extra });
}

export function serieDetails(id, idioma, signal, extra = {}) {
  return tmdbFetch(`/tv/${id}`, { idioma, signal, ...extra });
}

export function serieCreditsDetails(id, idioma, signal, extra = {}) {
  return tmdbFetch(`/tv/${id}/credits`, { idioma, signal, ...extra });
}

export function serieTrailersDetails(id, idioma, signal, extra = {}) {
  return tmdbFetch(`/tv/${id}/videos`, { idioma, signal, ...extra });
}

export function serieRecommendationsDetails(id, idioma, signal, extra = {}) {
  return tmdbFetch(`/tv/${id}/recommendations`, { idioma, signal, ...extra });
}
