import {
    movieDetails,
    movieCreditsDetails,
    movieTrailersDetails,
    movieRecommendationsDetails,
    serieDetails,
    serieCreditsDetails,
    serieTrailersDetails,
    serieRecommendationsDetails,
} from '../services/tmdb';
import { useTmdb } from './useTmdb.js';

const LOADERS = {
    movie: [movieDetails, movieCreditsDetails, movieTrailersDetails, movieRecommendationsDetails],
    tv: [serieDetails, serieCreditsDetails, serieTrailersDetails, serieRecommendationsDetails],
};

export function useMediaDetails(id, type, idioma) {
    return useTmdb(async (signal) => {
        const [fetchDetails, fetchCredits, fetchTrailers, fetchSimilar] =
            LOADERS[type] ?? LOADERS.movie;

        const [details, credits, trailers, similar] = await Promise.allSettled([
            fetchDetails(id, idioma, signal),
            fetchCredits(id, idioma, signal),
            fetchTrailers(id, idioma, signal),
            fetchSimilar(id, idioma, signal),
        ]);

        if (signal.aborted) {
            throw new DOMException('Petición abortada', 'AbortError');
        }

        if (details.status === 'rejected') throw details.reason;

        return {
            data: details.value,
            credits: credits.status === 'fulfilled' ? credits.value : null,
            trailers: trailers.status === 'fulfilled' ? trailers.value : null,
            similar: similar.status === 'fulfilled' ? similar.value : null,
        };
    }, [id, type, idioma]);
}
