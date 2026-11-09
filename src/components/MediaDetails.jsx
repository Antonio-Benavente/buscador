import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMediaDetails } from '../hooks/useMediaDetails';
import { useTrailerModal } from '../hooks/useTrailerModal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { buildMediaFacts } from '../utils/facts';
import { findTrailer } from '../utils/trailer';
import { img } from '../utils/images';
import Carousel from './Carousel';
import MediaCard from './MediaCard';
import ErrorState from './ErrorState';
import Loading from './Loading';
import Page404 from '../pages/Page404';
import { esNoEncontrado } from '../utils/apiError';
import chevronLeft from '../assets/chevronLeft.svg';
import noImage from '../assets/noimagen.webp';
import './MediaDetails.css';

const MAX_REPARTO = 12;

function MediaDetails({ type }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const idioma = i18n.language;
    const { data, credits, trailers, similar, error, retry } = useMediaDetails(id, type, idioma);
    const [showTrailer, setShowTrailer] = useState(false);
    const modalRef = useRef(null);
    const closeRef = useRef(null);

    const isMovie = type === 'movie';
    const titulo = data ? (isMovie ? data.title : data.name) : '';

    const trailer = findTrailer(trailers?.results);
    const abrirTrailer = useCallback(() => setShowTrailer(true), []);
    const cerrarTrailer = useCallback(() => setShowTrailer(false), []);

    useDocumentTitle(titulo || (isMovie ? t('detalles.pelicula') : t('detalles.serie')));

    useTrailerModal({
        open: showTrailer && Boolean(trailer),
        onClose: cerrarTrailer,
        modalRef,
        closeRef,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id, idioma]);

    if (error) {
        if (esNoEncontrado(error)) return <Page404 />;

        return <ErrorState onRetry={retry} />;
    }

    if (!data) {
        return <Loading />;
    }

    const hechos = buildMediaFacts(data, isMovie, t);

    const generos = data.genres?.length ? data.genres.map((genero) => genero.name) : [];
    const productoras = data.production_companies?.length ? data.production_companies.map((c) => c.name) : [];
    const reparto = credits?.cast?.filter((actor) => actor.profile_path).slice(0, MAX_REPARTO) ?? [];
    const recomendaciones = similar?.results ?? [];

    return (
        <main className='detailPage'>
            <div className='detailHero'>
                {data.backdrop_path && (
                    <img
                        className='detailBackdrop'
                        src={img(data.backdrop_path, 'w1280')}
                        alt=''
                        aria-hidden='true'
                    />
                )}

                <button
                    type='button'
                    className='back'
                    onClick={() => navigate(-1)}
                    aria-label={t('comunes.volver')}
                >
                    <img className='chevronLeft' src={chevronLeft} alt='' />
                </button>

                <div className='detailIntroWrap'>
                    <div className='detailIntro'>
                        {data.poster_path ? (
                            <img
                                className='detailPoster'
                                src={img(data.poster_path, 'w500')}
                                srcSet={`${img(data.poster_path, 'w342')} 342w, ${img(data.poster_path, 'w500')} 500w, ${img(data.poster_path, 'w780')} 780w`}
                                sizes='(max-width: 768px) 45vw, 250px'
                                alt={titulo}
                                width='250'
                                height='355'
                            />
                        ) : (
                            <p className='detailPosterMissing'>{t('detalles.sinImagen')}</p>
                        )}

                        <div className='detailContent'>
                            <div className='detailHeadline'>
                                <h1>{titulo}</h1>

                                {hechos.length > 0 && (
                                    <ul className='detailFacts'>
                                        {hechos.map((hecho) => (
                                            <li key={hecho.clave}>
                                                {hecho.valor
                                                    ? <><strong>{hecho.texto}</strong> {hecho.valor}</>
                                                    : hecho.texto}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <h2 className='detailSubheading'>{t('detalles.sinopsis')}</h2>
                                <p className='detailOverview'>
                                    {data.overview?.trim() ? data.overview : t('detalles.sinopsis')}
                                </p>

                                {generos.length > 0 && (
                                    <ul className='chipRow detailGenres'>
                                        {generos.map((genero) => (
                                            <li key={genero} className='chip'>{genero}</li>
                                        ))}
                                    </ul>
                                )}

                                <div className='detailActions'>
                                    {trailers && (trailer ? (
                                        <button type='button' className='btn' onClick={abrirTrailer}>
                                            {t('detalles.verTrailer')}
                                        </button>
                                    ) : (
                                        <p className='detailNote'>{t('detalles.sinTrailer')}</p>
                                    ))}

                                    {isMovie && data.homepage && (
                                        <a
                                            className='btn'
                                            href={data.homepage}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            {t('detalles.visitar')}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {productoras.length > 0 && (
                                <section className='detailSection'>
                                    <h2>{t('detalles.productoras')}</h2>
                                    <ul className='chipRow'>
                                        {productoras.map((company) => (
                                            <li key={company} className='chip'>{company}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {reparto.length > 0 && (
                                <section className='detailSection'>
                                    <h2>{t('detalles.reparto')}</h2>

                                    <Carousel
                                        items={reparto}
                                        paused={showTrailer}
                                        renderItem={(actor) => (
                                            <Link to={`/people/${actor.id}`} className='castCard'>
                                                <img
                                                    className='castCardImg'
                                                    src={img(actor.profile_path, 'w185') ?? noImage}
                                                    alt={actor.name}
                                                    loading='lazy'
                                                    decoding='async'
                                                />
                                                <span className='castCardName'>{actor.name}</span>
                                                <span className='castCardRole'>{actor.character}</span>
                                            </Link>
                                        )}
                                    />
                                </section>
                            )}

                            {recomendaciones.length > 0 && (
                                <section className='detailSection'>
                                    <h2>
                                        {isMovie ? t('detalles.peliculasRecomendadas') : t('detalles.seriesRecomendadas')}
                                    </h2>

                                    <Carousel
                                        items={recomendaciones}
                                        paused={showTrailer}
                                        renderItem={(item) => <MediaCard item={item} type={type} />}
                                    />
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showTrailer && trailer && (
                <div
                    className='modalOverlay'
                    role='presentation'
                >
                    <div
                        ref={modalRef}
                        className='modalTrailer'
                        role='dialog'
                        aria-modal='true'
                        aria-label={t('detalles.trailerDe', { title: titulo })}
                    >
                        <button
                            ref={closeRef}
                            type='button'
                            className='closeModal'
                            onClick={cerrarTrailer}
                            aria-label={t('detalles.cerrarTrailer')}
                        >
                            ×
                        </button>

                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title={trailer.name}
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </main>
    );
}

export default MediaDetails;
