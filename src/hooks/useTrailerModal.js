import { useEffect } from 'react';

export function useTrailerModal({ open, onClose, modalRef, closeRef }) {
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;

        const previousFocus = document.activeElement;
        closeRef.current?.focus();

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }

            if (event.key !== 'Tab' || !modalRef.current) return;

            const focusables = modalRef.current.querySelectorAll('button, iframe');
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && (active === first || !modalRef.current.contains(active))) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (active === last || !modalRef.current.contains(active))) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            previousFocus?.focus?.();
        };
    }, [open, onClose, modalRef, closeRef]);
}
