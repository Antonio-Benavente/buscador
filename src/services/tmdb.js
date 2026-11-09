import { tmdbFetch } from './tmdbClient.js';

export function search(query, page = 1, idioma, signal, extra = {}) {
    return tmdbFetch('/search/multi', { query, page, idioma, signal, ...extra });
}

export {
    popularMovies,
    nowPlayingMovies,
    upcomingMovies,
    topRatedMovies,
    movieDetails,
    movieCreditsDetails,
    movieTrailersDetails,
    movieRecommendationsDetails,
} from './tmdbMovies';

export {
    popularSeries,
    onTheAirSeries,
    airingTodaySeries,
    topRatedSeries,
    serieDetails,
    serieCreditsDetails,
    serieTrailersDetails,
    serieRecommendationsDetails,
} from './tmdbSeries';

export { popularPeople, personDetails, personCombinedCredits } from './tmdbPeople';
