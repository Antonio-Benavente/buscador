import { useTranslation } from 'react-i18next';
import { useColumnas } from '../hooks/useColumnas';
import './Loading.css';

function CardSkeleton() {
    return (
        <div className='skeletonCard' aria-hidden='true'>
            <div className='skeleton skeletonPoster' />
            <div className='skeleton skeletonLine' />
            <div className='skeleton skeletonLine skeletonLineShort' />
        </div>
    );
}

function Loading({ variant = 'page', count }) {
    const { t } = useTranslation();
    const columnas = useColumnas();

    if (variant === 'row' || variant === 'grid') {
        const cantidad = count ?? columnas;

        return (
            <div className={variant === 'row' ? 'skeletonRow' : 'skeletonGrid'} role='status'>
                <span className='sr-only'>{t('comunes.cargando')}</span>
                {Array.from({ length: cantidad }, (_, index) => (
                    <CardSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className='containerLoading' role='status'>
            <div className='spinner' aria-hidden='true' />
            <p>{t('comunes.cargando')}</p>
        </div>
    );
}

export default Loading;
