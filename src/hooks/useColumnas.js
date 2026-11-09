import { useSyncExternalStore } from 'react';

function columnasDeAncho(ancho) {
    if (ancho <= 600) return 2;
    if (ancho <= 835) return 3;
    if (ancho <= 1086) return 4;
    if (ancho <= 1294) return 5;
    return 6;
}

const obtenerColumnas = () => columnasDeAncho(window.innerWidth);

function suscribir(notificar) {
    window.addEventListener('resize', notificar);
    return () => window.removeEventListener('resize', notificar);
}

export function useColumnas() {
    return useSyncExternalStore(suscribir, obtenerColumnas, () => 6);
}
