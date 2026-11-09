import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { useTmdb } from '../hooks/useTmdb';
import { useRegion } from '../hooks/useRegion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { construirParams, leerPagina } from '../utils/searchParams';
import { LISTADOS, RUTAS, TITULOS, resolverSeccion } from '../utils/secciones';
import { MAX_PAGE } from '../utils/constants';
import MediaCard from '../components/MediaCard';
import Pagination from '../components/Pagination';
import ErrorState from '../components/ErrorState';
import Loading from '../components/Loading';

import './cards.css';
import './MediaList.css';

function MediaList({ type }) {
    const { t, i18n } = useTranslation();
    const idioma = i18n.language;
    const { region } = useRegion();
    const [searchParams, setSearchParams] = useSearchParams();

    const prevIdiomaRef = useRef(idioma);
    const prevRegionRef = useRef(region);

    const titulo = t(TITULOS[type]);
    useDocumentTitle(titulo);

    const seccion = resolverSeccion(type, searchParams.get('seccion'));
    const page = Math.min(leerPagina(searchParams.get('page')), MAX_PAGE);

    const cambiarUrl = (params, replace) => {
        setSearchParams(construirParams(searchParams, params), { replace });
    };

    const irAPagina = (nueva) => cambiarUrl({ page: nueva }, false);

    const enlaceSeccion = (id) => {
        const params = construirParams(searchParams, {
            seccion: id === LISTADOS[type][0].id ? null : id,
            page: 1,
        }).toString();

        return params ? `${RUTAS[type]}?${params}` : RUTAS[type];
    };

    const { results, total_pages, error, loading, retry } = useTmdb(
        (signal) => seccion.fetch({ idioma, region, page, signal }),
        [type, seccion.id, idioma, region, page],
    );

    useEffect(() => {
        if (prevIdiomaRef.current === idioma && prevRegionRef.current === region) return;

        prevIdiomaRef.current = idioma;
        prevRegionRef.current = region;
        setSearchParams(construirParams(searchParams, { page: 1 }), { replace: true });
    }, [idioma, region, searchParams, setSearchParams]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page, idioma, region, seccion.id]);

    if (error) {
        return <ErrorState onRetry={retry} />;
    }

    const items = results ?? [];

    const conPestanas = LISTADOS[type].length > 1;

    return (
        <main className='container listPage'>
            <h1 className='sectionTitle'>{titulo}</h1>

            {conPestanas && (
                <nav className='seccionesListado' aria-label={titulo}>
                    {LISTADOS[type].map(({ id, etiqueta }) => (
                        <Link
                            key={id}
                            to={enlaceSeccion(id)}
                            className={id === seccion.id
                                ? 'seccionListado activo'
                                : 'seccionListado'}
                            aria-current={id === seccion.id ? 'page' : undefined}
                            onClick={id === seccion.id
                                ? (evento) => evento.preventDefault()
                                : undefined}
                        >
                            {t(etiqueta)}
                        </Link>
                    ))}
                </nav>
            )}

            {loading ? (
                <Loading variant='grid' />
            ) : (
                <>
                    <div className='cardGrid'>
                        {items.map((item) => (
                            <MediaCard key={item.id} item={item} type={type} />
                        ))}
                    </div>

                    <Pagination page={page} totalPages={Math.min(total_pages ?? 0, MAX_PAGE)} setPage={irAPagina} />
                </>
            )}
        </main>
    );
}

export default MediaList;
