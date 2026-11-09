import { tmdbFetch } from './tmdbClient.js';

export function popularPeople(idioma, page = 1, signal, extra = {}) {
  return tmdbFetch('/person/popular', { idioma, page, signal, ...extra });
}

export function personDetails(id, idioma, signal, extra = {}) {
  return tmdbFetch(`/person/${id}`, { idioma, signal, ...extra });
}

export function personCombinedCredits(id, idioma, signal, extra = {}) {
  return tmdbFetch(`/person/${id}/combined_credits`, { idioma, signal, ...extra });
}
