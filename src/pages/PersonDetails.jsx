import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { personDetails, personCombinedCredits } from '../services/tmdb';
import { useTmdb } from '../hooks/useTmdb';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { img } from '../utils/images';
import MediaCard from '../components/MediaCard';
import Carousel from '../components/Carousel';
import ErrorState from '../components/ErrorState';
import Loading from '../components/Loading';
import Page404 from './Page404';
import { esNoEncontrado } from '../utils/apiError';
import { buildPersonFacts } from '../utils/facts';
import { traducirDepartamento } from '../utils/departamentos';
import chevronLeft from '../assets/chevronLeft.svg';
import noImage from '../assets/noimagen.webp';

import '../components/MediaDetails.css';
import './cards.css';

const MAX_CREDITOS = 18;
const MAX_ALIAS = 8;

function PersonDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const idioma = i18n.language;

    const { detalles, creditos, error, loading, retry } = useTmdb(async (signal) => {
        const [detallesResultado, creditosResultado] = await Promise.allSettled([
            personDetails(id, idioma, signal),
            personCombinedCredits(id, idioma, signal),
        ]);

        if (detallesResultado.status === 'rejected') throw detallesResultado.reason;

        return {
            detalles: detallesResultado.value,
            creditos: creditosResultado.status === 'fulfilled' ? creditosResultado.value : null,
        };
    }, [id, idioma]);

    const persona = detalles;
    const credits = creditos;

    useDocumentTitle(persona?.name || t('detalles.persona'));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id, idioma]);

    if (error) {
        if (esNoEncontrado(error)) return <Page404 />;

        return <ErrorState onRetry={retry} />;
    }

    if (!persona || loading) {
        return <Loading />;
    }

    const hechos = buildPersonFacts(persona, t, traducirDepartamento);

    const alias = persona.also_known_as?.filter(Boolean) ?? [];

    const seen = new Set();
    const creditosFiltrados = (credits?.cast ?? []).filter((item) => {
        if (!item.title && !item.name) return false;
        const clave = `${item.media_type}-${item.id}`;
        if (seen.has(clave)) return false;
        seen.add(clave);
        return true;
    }).slice(0, MAX_CREDITOS);

    return (
        <main className='detailPage'>
            <div className='detailHero detailHeroPlain'>
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
                        <img
                            className='detailPoster'
                            src={persona.profile_path ? img(persona.profile_path, 'w342') : noImage}
                            alt={persona.name}
                            width='250'
                            height='355'
                        />

                        <div className='detailContent'>
                            <div className='detailHeadline'>
                                <h1>{persona.name}</h1>

                                {hechos.length > 0 && (
                                    <ul className='detailFacts'>
                                        {hechos.map((hecho) => (
                                            <li key={hecho.clave}>
                                                <strong>{hecho.texto}</strong> {hecho.valor}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {alias.length > 0 && (
                                    <div className='chipRow detailGenres'>
                                        {alias.slice(0, MAX_ALIAS).map((nombre) => (
                                            <span key={nombre} className='chip'>{nombre}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <section className='detailSection'>
                                <h2>{t('detalles.biografia')}</h2>
                                <p className='detailBiography'>
                                    {persona.biography?.trim() ? persona.biography : t('detalles.sinBiografia')}
                                </p>
                            </section>

                            {creditosFiltrados.length > 0 && (
                                <section className='detailSection'>
                                    <h2>{t('detalles.creditos')}</h2>

                                    <Carousel
                                        items={creditosFiltrados}
                                        renderItem={(item) => (
                                            <MediaCard item={item} type={item.media_type} />
                                        )}
                                    />
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default PersonDetails;
