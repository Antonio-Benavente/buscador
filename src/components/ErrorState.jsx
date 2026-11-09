import { useTranslation } from 'react-i18next';
import './ErrorState.css';

function ErrorState({ message, onRetry }) {
    const { t } = useTranslation();

    return (
        <div className='containerError' role='alert'>
            <p>{message ?? t('error.carga')}</p>
            {onRetry && (
                <button type='button' className='btn' onClick={onRetry}>
                    {t('comunes.reintentar')}
                </button>
            )}
        </div>
    );
}

export default ErrorState;
