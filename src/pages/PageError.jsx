import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './errorPage.css';
import Image404 from '../assets/404.webp';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function PageError() {
    const { t } = useTranslation();

    useDocumentTitle(t('error.titulo'));

    return (
        <main className='containerErrorPage'>
            <img src={Image404} alt='' aria-hidden='true' />
            <h1>{t('error.titulo')}</h1>
            <p className='containerErrorPageTexto'>{t('error.descripcion')}</p>

            <div className='containerErrorPageAcciones'>
                <Link className='btn' to='/'>{t('comunes.inicio')}</Link>
                <button type='button' className='btn' onClick={() => window.location.reload()}>
                    {t('error.recargar')}
                </button>
            </div>
        </main>
    );
}

export default PageError;
