import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MediaCard from '../components/MediaCard';
import Carousel from '../components/Carousel';
import SearchBar from '../components/SearchBar';
import ErrorState from '../components/ErrorState';
import Loading from '../components/Loading';
import { popularMovies, nowPlayingMovies, upcomingMovies, popularSeries } from '../services/tmdb';
import { useTmdb } from '../hooks/useTmdb';
import { useRegion } from '../hooks/useRegion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

import './Home.css';

function Home() {
    const { t, i18n } = useTranslation();
    const idioma = i18n.language;
    const { region } = useRegion();
    const navigate = useNavigate();
    const [texto, setTexto] = useState('');

    useDocumentTitle(t('comunes.inicio'));

    const { moviesPopular, seriesPopular, moviesUpcoming, moviesNowPlaying, error, loading, retry } =
        useTmdb(async (signal) => {
            const [moviesPopular, seriesPopular, moviesUpcoming, moviesNowPlaying] = await Promise.all([
                popularMovies(idioma, region, 1, signal),
                popularSeries(idioma, 1, signal),
                upcomingMovies(idioma, region, 1, signal),
                nowPlayingMovies(idioma, region, 1, signal),
            ]);

            return {
                moviesPopular: moviesPopular.results ?? [],
                seriesPopular: seriesPopular.results ?? [],
                moviesUpcoming: moviesUpcoming.results ?? [],
                moviesNowPlaying: moviesNowPlaying.results ?? [],
            };
        }, [idioma, region]);

    const irABusqueda = () => {
        const q = texto.trim();
        navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
    };

    const secciones = useMemo(() => [
        {
            clave: 'moviesNowPlaying',
            titulo: t('home.enCartelera'),
            items: moviesNowPlaying ?? null,
            renderItem: (movie) => <MediaCard item={movie} type='movie' />,
        },
        {
            clave: 'moviesUpcoming',
            titulo: t('home.proximamente'),
            items: moviesUpcoming ?? null,
            renderItem: (movie) => <MediaCard item={movie} type='movie' />,
        },
        {
            clave: 'moviesPopular',
            titulo: t('home.peliculasPopulares'),
            items: moviesPopular ?? null,
            renderItem: (movie) => <MediaCard item={movie} type='movie' />,
        },
        {
            clave: 'seriesPopular',
            titulo: t('home.seriesPopulares'),
            items: seriesPopular ?? null,
            renderItem: (serie) => <MediaCard item={serie} type='tv' />,
        },
    ], [t, moviesNowPlaying, moviesUpcoming, moviesPopular, seriesPopular]);

    return (
        <div className='home'>
            <section className='hero'>
                <div className='heroInner container'>
                    <h1 className='heroTitle'>{t('app.titulo')}</h1>
                    <p className='heroSubtitle'>{t('home.heroSubtitulo')}</p>

                    <SearchBar
                        id='searchHome'
                        value={texto}
                        onChange={setTexto}
                        onSubmit={irABusqueda}
                    />
                </div>
            </section>

            {error ? (
                <ErrorState onRetry={retry} />
            ) : (
                secciones.map((seccion, indice) => (
                    <section
                        key={seccion.clave}
                        className={`homeSection${indice === 0 ? ' homeSectionAire' : ''}`}
                    >
                        <div className='sectionHead container'>
                            <h2>{seccion.titulo}</h2>
                        </div>

                        <div className='container'>
                            {loading ? (
                                <Loading variant='row' />
                            ) : (
                                <Carousel items={seccion.items} renderItem={seccion.renderItem} />
                            )}
                        </div>
                    </section>
                ))
            )}
        </div>
    );
}

export default Home;
