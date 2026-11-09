import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './errorPage.css';
import Image404 from '../assets/404.webp';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function Page404() {
    const { t } = useTranslation();

    useDocumentTitle(t('noEncontrado.titulo'));

    return (
        <main className='containerErrorPage'>
            <img src={Image404} alt='' aria-hidden='true' />
            <h1>{t('noEncontrado.titulo')}</h1>
            <p className='containerErrorPageTexto'>{t('noEncontrado.descripcion')}</p>
            <Link className='btn' to='/'>{t('comunes.inicio')}</Link>
        </main>
    );
}

export default Page404;
