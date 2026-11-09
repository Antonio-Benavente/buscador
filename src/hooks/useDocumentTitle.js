import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useDocumentTitle(title) {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const base = t('app.titulo');
        document.title = title ? `${title} | ${base}` : base;
    }, [title, t, i18n.language]);
}
