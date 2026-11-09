import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import tmdbLogo from '../assets/tmdb.svg';
import { useRegion, MERCADOS_INCLUIDOS } from '../hooks/useRegion';

const MERCADOS = MERCADOS_INCLUIDOS;

function Footer() {
    const { t, i18n } = useTranslation();
    const { region, cambiarRegion } = useRegion();

    const nombreDe = useMemo(() => {
        let displayNames = null;
        try {
            displayNames = new Intl.DisplayNames([i18n.language], { type: 'region' });
        } catch {
            displayNames = null;
        }

        return (codigo) => displayNames?.of(codigo) ?? codigo;
    }, [i18n.language]);

    const paises = useMemo(() => {
        const collator = new Intl.Collator(i18n.language, { sensitivity: 'base' });

        return MERCADOS
            .map((codigo) => ({ codigo, nombre: nombreDe(codigo) }))
            .sort((a, b) => collator.compare(a.nombre, b.nombre));
    }, [nombreDe, i18n.language]);

    const regionFueraDeLista = !paises.some((pais) => pais.codigo === region);

    const alVolverArriba = () => {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        window.scrollTo({ top: 0, behavior: reduce?.matches ? 'auto' : 'smooth' });
    };

    return (
        <footer className='footer'>
            <div className='footerGrid container'>
                <div className='footerMarca'>
                    <p className='footerTitulo'>{t('app.titulo')}</p>
                    <p className='footerTagline'>{t('home.heroSubtitulo')}</p>
                    <p className='footerStack'>React · Vite · TMDB API</p>
                </div>

                <div className='footerUtilidades'>
                    <div className='footerRegionRow'>
                        <label className='footerHeading' htmlFor='footerRegion'>
                            {t('footer.region')}
                        </label>
                        <span className='languageWrap footerRegion'>
                            <select
                                id='footerRegion'
                                className='language'
                                value={region}
                                onChange={(evento) => cambiarRegion(evento.target.value)}
                            >
                                {regionFueraDeLista && <option value={region}>{nombreDe(region)}</option>}

                                {paises.map((pais) => (
                                    <option key={pais.codigo} value={pais.codigo}>
                                        {pais.nombre}
                                    </option>
                                ))}
                            </select>
                        </span>
                    </div>

                    <button type='button' className='btn footerArriba' onClick={alVolverArriba}>
                        {t('footer.arriba')}
                    </button>
                </div>
            </div>

            <div className='footerLegal container'>
                <p className='footerCopy'>
                    © {new Date().getFullYear()} {t('app.titulo')}
                </p>

                <a
                    className='footerTmdb'
                    href='https://www.themoviedb.org/'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <img src={tmdbLogo} alt='TMDB' />
                    <span>{t('footer.avisoTmdb')}</span>
                </a>
            </div>
        </footer>
    );
}

export default Footer;
