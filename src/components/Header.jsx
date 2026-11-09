import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cambiarIdioma } from '../i18n';
import { NAV_MEDIA_QUERY } from '../utils/constants';

const ENLACES = [
    { to: '/search', key: 'header.buscar' },
    { to: '/movies', key: 'header.peliculas' },
    { to: '/series', key: 'header.series' },
    { to: '/people', key: 'header.personas' },
];

function Header() {
    const { t, i18n } = useTranslation();
    const [menuAbierto, setMenuAbierto] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(NAV_MEDIA_QUERY);
        const cerrar = (evento) => {
            if (evento.matches) setMenuAbierto(false);
        };

        mql.addEventListener('change', cerrar);
        return () => mql.removeEventListener('change', cerrar);
    }, []);

    return (
        <header className='header'>
            <div className='headerInner container'>
                <Link to='/' className='brand' onClick={() => setMenuAbierto(false)}>
                    <span className='logo'>{t('header.logo')}</span>
                </Link>

                <nav
                    id='navPrincipal'
                    className={`navLinks${menuAbierto ? ' isOpen' : ''}`}
                    aria-label={t('header.navegacion')}
                >
                    {ENLACES.map(({ to, key }) => (
                        <NavLink key={to} to={to} onClick={() => setMenuAbierto(false)}>
                            {t(key)}
                        </NavLink>
                    ))}
                </nav>

                <div className='headerTools'>
                    <span className='languageWrap'>
                        <select
                            className='language'
                            aria-label={t('header.idioma')}
                            value={i18n.language}
                            onChange={(e) => cambiarIdioma(e.target.value)}
                        >
                            <option value="de-DE">Deutsch</option>
                            <option value="en-US">English (United States)</option>
                            <option value="es-ES">Español (España)</option>
                            <option value="es-MX">Español (Latinoamérica)</option>
                            <option value="fr-FR">Français</option>
                            <option value="it-IT">Italiano</option>
                            <option value="ja-JP">日本語</option>
                            <option value="ko-KR">한국어</option>
                            <option value="pt-BR">Português</option>
                        </select>
                    </span>

                    <button
                        type='button'
                        className='navToggle'
                        aria-expanded={menuAbierto}
                        aria-controls='navPrincipal'
                        aria-label={t('header.menu')}
                        onClick={() => setMenuAbierto((abierto) => !abierto)}
                    >
                        <span className='navToggleBars' aria-hidden='true' />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
