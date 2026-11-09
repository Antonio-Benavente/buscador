import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { search } from '../services/tmdb';
import { construirParams, leerPagina } from '../utils/searchParams';
import { MAX_PAGE } from '../utils/constants';
import { logError } from '../utils/log';
import { useRequestState } from '../hooks/useRequest';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import MediaCard from '../components/MediaCard';
import ErrorState from '../components/ErrorState';
import Loading from '../components/Loading';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

import './Search.css';
import './cards.css';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t, i18n } = useTranslation();
    const idioma = i18n.language;

    const texto = searchParams.get('q') ?? '';

    const page = Math.min(leerPagina(searchParams.get('page')), MAX_PAGE);

    useDocumentTitle(t('busqueda.titulo'));

    const { reloadKey, result: respuesta, setResult: setRespuesta, retry } = useRequestState();

    const prevTextoRef = useRef(texto);
    const prevIdiomaRef = useRef(idioma);

    const clave = JSON.stringify([texto.toLowerCase(), page, idioma, reloadKey]);
    const vigente = respuesta?.clave === clave;

    const cambiarTexto = (valor) => {
        setSearchParams(construirParams(searchParams, { query: valor, page: 1 }), { replace: true });
    };

    const irAPagina = (nueva) => {
        setSearchParams(construirParams(searchParams, { query: texto, page: nueva }), { replace: false });
    };

    useEffect(() => {
        if (prevIdiomaRef.current === idioma) return;

        prevIdiomaRef.current = idioma;
        setSearchParams(construirParams(searchParams, { query: texto, page: 1 }), { replace: true });
    }, [idioma, searchParams, texto, setSearchParams]);

    useEffect(() => {
        const textoCambio = prevTextoRef.current !== texto;
        prevTextoRef.current = texto;

        const controller = new AbortController();
        const consulta = texto.trim();
        const clavePeticion = clave;

        const timer = setTimeout(async () => {
            if (consulta.length < MIN_QUERY_LENGTH) return;

            try {
                const data = await search(consulta, page, idioma, controller.signal);

                if (controller.signal.aborted) return;

                setRespuesta({
                    clave: clavePeticion,
                    error: null,
                    items: data.results ?? [],

                    totalResults: data.total_results ?? 0,
                    totalPages: Math.min(data.total_pages ?? 0, MAX_PAGE),
                });
            } catch (err) {
                if (controller.signal.aborted) return;

                logError(err, 'search');
                setRespuesta({ clave: clavePeticion, error: err, items: [], totalPages: 0 });
            }
        }, textoCambio ? DEBOUNCE_MS : 0);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [clave, texto, page, idioma, setRespuesta]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    const consulta = texto.trim();
    const hayConsulta = consulta.length >= MIN_QUERY_LENGTH;
    const consultaCorta = consulta.length > 0 && !hayConsulta;
    const cargando = hayConsulta && !vigente;
    const items = vigente ? (respuesta.items ?? []) : [];

    const esInicio = !hayConsulta;

    return (
        <main className={esInicio ? 'container searchPage searchPageInicio' : 'container searchPage'}>
            <h1 className='sectionTitle'>{t('busqueda.titulo')}</h1>

            <SearchBar
                id='search'
                value={texto}
                onChange={cambiarTexto}
                focusOnMount
                showSubmit={false}
            />

            {consultaCorta && (
                <p className='searchHint' role='status'>
                    {t('busqueda.minCaracteres')}
                </p>
            )}

            {cargando ? (
                <Loading variant='grid' />
            ) : vigente && respuesta.error ? (
                <ErrorState
                    message={t('busqueda.error')}
                    onRetry={retry}
                />
            ) : items.length > 0 ? (
                <>
                    <h2 className='searchResultsTitle'>
                        {t('busqueda.recuento', { count: respuesta.totalResults ?? 0, query: consulta })}
                    </h2>

                    <div className='cardGrid'>
                        {items.map((result) => (
                            <MediaCard
                                key={`${result.media_type}-${result.id}`}
                                item={result}
                                type={result.media_type}
                            />
                        ))}
                    </div>

                    <Pagination page={page} totalPages={respuesta.totalPages} setPage={irAPagina} />
                </>
            ) : hayConsulta ? (
                <div className='searchMessage' role='status'>
                    <p>{t('busqueda.sinResultados', { query: consulta })}</p>
                </div>
            ) : null}
        </main>
    );
}

export default Search;
