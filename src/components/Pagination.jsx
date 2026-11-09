import { useTranslation } from 'react-i18next';
import chevronLeft from '../assets/chevronLeft.svg';
import chevronRight from '../assets/chevronRight.svg';

const HACIA = { anterior: -1, siguiente: 1 };

function Pagination({ page, totalPages, setPage }) {
    const { t } = useTranslation();

    function onPaginar(direccion) {
        const destino = page + HACIA[direccion];
        if (destino < 1 || destino > totalPages) return;

        setPage(destino);
    }

    return (
        <div className='paginacion'>
            <button
                type="button"
                onClick={() => onPaginar('anterior')}
                disabled={page <= 1}
                aria-label={t('paginacion.anterior')}
            >
                <img className='chevronLeft' src={chevronLeft} alt="" />
            </button>

            <p>
                {t('paginacion.actual', { page, total: totalPages })}
            </p>

            <button
                type="button"
                onClick={() => onPaginar('siguiente')}
                disabled={page >= totalPages}
                aria-label={t('paginacion.siguiente')}
            >
                <img src={chevronRight} alt="" />
            </button>
        </div>
    );
}

export default Pagination;
