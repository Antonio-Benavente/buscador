import { Fragment, cloneElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Carousel({
    items = [],
    renderItem,
    className = '',
    interval = 3200,
    scrollAmount,
    paused = false,
}) {
    const containerRef = useRef(null);
    const [interactuando, setInteractuando] = useState(false);
    const [overflowing, setOverflowing] = useState(false);
    const itemCount = items.length;
    const { t } = useTranslation();

    useLayoutEffect(() => {
        const container = containerRef.current;

        if (!container) return undefined;

        const measure = () => {
            const children = container.children;

            if (!children.length) {
                setOverflowing(false);
                return;
            }

            const first = children[0];

            const setSize = overflowing ? children.length / 2 : children.length;
            const last = children[setSize - 1] ?? children[children.length - 1];
            const anchoOriginal = last.offsetLeft + last.offsetWidth - first.offsetLeft;

            setOverflowing(anchoOriginal > container.clientWidth + 1);
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(container);

        return () => observer.disconnect();
    }, [itemCount, overflowing]);

    const pasoActual = useCallback(() => {
        const container = containerRef.current;
        const primerHijo = container?.firstElementChild;

        if (scrollAmount) return scrollAmount;

        return primerHijo ? primerHijo.offsetWidth + 16 : 300;
    }, [scrollAmount]);

    const mover = useCallback((direccion) => {
        const container = containerRef.current;

        if (!container) return;

        container.scrollBy({
            left: direccion * pasoActual(),
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
    }, [pasoActual]);

    const handleScroll = () => {
        const container = containerRef.current;

        if (!container) return;

        const mitad = container.scrollWidth / 2;

        if (container.scrollLeft >= mitad) {
            container.scrollLeft -= mitad;
        } else if (container.scrollLeft <= 0) {
            container.scrollLeft += mitad;
        }
    };

    useEffect(() => {
        const container = containerRef.current;

        if (!container || !overflowing || paused || interactuando || itemCount === 0) return undefined;
        if (prefersReducedMotion()) return undefined;

        const id = setInterval(() => mover(1), interval);

        return () => clearInterval(id);
    }, [overflowing, paused, interactuando, itemCount, interval, mover]);

    return (
        <div className='carousel'>

            {overflowing && (
                <button
                    type='button'
                    className='carouselButton carouselButtonLeft'
                    aria-label={t('comunes.anterior')}
                    onClick={() => mover(-1)}
                >
                    ‹
                </button>
            )}

            <div
                ref={containerRef}
                className={`carouselContainer ${className}`}
                onScroll={overflowing ? handleScroll : undefined}
                onMouseEnter={() => setInteractuando(true)}
                onMouseLeave={() => setInteractuando(false)}
                onFocusCapture={() => setInteractuando(true)}
                onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setInteractuando(false);
                }}
            >
                {items.map((item, index) => (
                    <Fragment key={`lead-${item.id ?? index}`}>
                        {renderItem(item, index)}
                    </Fragment>
                ))}

                {overflowing && items.map((item, index) => (
                    <Fragment key={`dup-${item.id ?? index}`}>
                        {cloneElement(renderItem(item, index), { inert: true })}
                    </Fragment>
                ))}
            </div>

            {overflowing && (
                <button
                    type='button'
                    className='carouselButton carouselButtonRight'
                    aria-label={t('comunes.siguiente')}
                    onClick={() => mover(1)}
                >
                    ›
                </button>
            )}

        </div>
    );
}

export default Carousel;
