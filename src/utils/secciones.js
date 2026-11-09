import {
    popularMovies,
    nowPlayingMovies,
    upcomingMovies,
    topRatedMovies,
    popularSeries,
    onTheAirSeries,
    airingTodaySeries,
    topRatedSeries,
    popularPeople,
} from '../services/tmdb';

export const LISTADOS = {
    movie: [
        {
            id: 'populares',
            etiqueta: 'listas.secciones.populares',
            fetch: ({ idioma, region, page, signal }) =>
                popularMovies(idioma, region, page, signal),
        },
        {
            id: 'en-cartelera',
            etiqueta: 'listas.secciones.enCartelera',
            fetch: ({ idioma, region, page, signal }) =>
                nowPlayingMovies(idioma, region, page, signal),
        },
        {
            id: 'proximamente',
            etiqueta: 'listas.secciones.proximamente',
            fetch: ({ idioma, region, page, signal }) =>
                upcomingMovies(idioma, region, page, signal),
        },
        {
            id: 'mejor-valoradas',
            etiqueta: 'listas.secciones.mejorValoradas',
            fetch: ({ idioma, region, page, signal }) =>
                topRatedMovies(idioma, region, page, signal),
        },
    ],
    tv: [
        {
            id: 'populares',
            etiqueta: 'listas.secciones.populares',
            fetch: ({ idioma, page, signal }) => popularSeries(idioma, page, signal),
        },
        {
            id: 'en-emision',
            etiqueta: 'listas.secciones.enEmision',
            fetch: ({ idioma, page, signal }) => onTheAirSeries(idioma, page, signal),
        },
        {
            id: 'al-aire-hoy',
            etiqueta: 'listas.secciones.alAireHoy',
            fetch: ({ idioma, page, signal }) => airingTodaySeries(idioma, page, signal),
        },
        {
            id: 'mejor-valoradas',
            etiqueta: 'listas.secciones.mejorValoradas',
            fetch: ({ idioma, page, signal }) => topRatedSeries(idioma, page, signal),
        },
    ],

    person: [
        {
            id: 'populares',
            etiqueta: 'listas.secciones.populares',
            fetch: ({ idioma, page, signal }) => popularPeople(idioma, page, signal),
        },
    ],
};

export const TITULOS = {
    movie: 'header.peliculas',
    tv: 'header.series',
    person: 'header.personas',
};

export const RUTAS = {
    movie: '/movies',
    tv: '/series',
    person: '/people',
};

export function resolverSeccion(type, valorUrl) {
    const secciones = LISTADOS[type] ?? LISTADOS.person;
    return secciones.find((seccion) => seccion.id === valorUrl) ?? secciones[0];
}
