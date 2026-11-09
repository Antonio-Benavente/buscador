import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import searchIcon from '../assets/search.svg';
import XIcon from '../assets/x.svg';
import './SearchBar.css';

function SearchBar({
    value,
    onChange,
    onSubmit,
    id = 'search',
    focusOnMount = false,
    showSubmit = true,
}) {
    const { t } = useTranslation();
    const inputRef = useRef(null);

    useEffect(() => {
        if (focusOnMount) inputRef.current?.focus();
    }, [focusOnMount]);

    const limpiar = () => {
        onChange('');
        inputRef.current?.focus();
    };

    return (
        <form
            className='searchBar'
            role='search'
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit?.(value);
            }}
        >
            <img className='searchBarIcon' src={searchIcon} alt='' aria-hidden='true' />

            <label htmlFor={id} className='sr-only'>{t('busqueda.label')}</label>
            <input
                id={id}
                ref={inputRef}
                type='search'
                value={value}
                autoComplete='off'
                spellCheck='false'
                placeholder={t('busqueda.placeholder')}
                onChange={(event) => onChange(event.target.value)}
            />

            {value.length > 0 && (
                <button type='button' className='searchBarClear' onClick={limpiar} aria-label={t('busqueda.limpiar')}>
                    <img src={XIcon} alt='' aria-hidden='true' />
                </button>
            )}

            {showSubmit && (
                <button type='submit' className='searchBarSubmit btn'>
                    {t('header.buscar')}
                </button>
            )}
        </form>
    );
}

export default SearchBar;
