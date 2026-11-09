import { useSyncExternalStore } from 'react';

const CLAVE_ALMACEN = 'region';
const REGION_POR_DEFECTO = 'US';

const REGION_POR_IDIOMA = {
    de: 'DE',
    en: 'US',
    es: 'ES',
    fr: 'FR',
    it: 'IT',
    ja: 'JP',
    ko: 'KR',
    pt: 'BR',
};

const REGION_POR_HUSO = {

    'America/Mexico_City': 'MX', 'America/Monterrey': 'MX', 'America/Cancun': 'MX', 'America/Tijuana': 'MX',

    'America/Buenos_Aires': 'AR', 'America/Cordoba': 'AR', 'America/Mendoza': 'AR',
    'America/Santiago': 'CL', 'America/Punta_Arenas': 'CL', 'America/Montevideo': 'UY', 'America/Asuncion': 'PY',

    'America/Bogota': 'CO', 'America/Lima': 'PE', 'America/Guayaquil': 'EC', 'America/La_Paz': 'BO',
    'America/Caracas': 'VE', 'America/Havana': 'CU', 'America/Santo_Domingo': 'DO', 'America/Puerto_Rico': 'PR',
    'America/Guatemala': 'GT', 'America/Panama': 'PA', 'America/Costa_Rica': 'CR', 'America/Tegucigalpa': 'HN',
    'America/El_Salvador': 'SV', 'America/Managua': 'NI',

    'America/Sao_Paulo': 'BR', 'America/Fortaleza': 'BR', 'America/Recife': 'BR',
    'America/Bahia': 'BR', 'America/Manaus': 'BR', 'America/Belem': 'BR',

    'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Halifax': 'CA',
    'America/Winnipeg': 'CA', 'America/Edmonton': 'CA',
    'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
    'America/Phoenix': 'US', 'America/Los_Angeles': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US',

    'Europe/Madrid': 'ES', 'Atlantic/Canary': 'ES', 'Europe/Lisbon': 'PT',
    'Europe/Berlin': 'DE', 'Europe/Paris': 'FR', 'Europe/Rome': 'IT', 'Europe/London': 'GB',
    'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR',
};

const HUSOS_AGRUPADOS = {
    'America/Bogota': { paises: ['CO', 'PE', 'EC', 'BO'] },
};

export const MERCADOS_INCLUIDOS = [...new Set(Object.values(REGION_POR_HUSO))];

function normalizarRegion(valor) {
    const region = String(valor ?? '').trim().toUpperCase();
    return /^[A-Z]{2}$/.test(region) ? region : null;
}

function regionGuardada() {
    try {
        return normalizarRegion(localStorage.getItem(CLAVE_ALMACEN));
    } catch {
        return null;
    }
}

function regionDelHusoHorario() {
    if (typeof Intl === 'undefined') return null;

    let huso;
    try {
        huso = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return null;
    }

    const directa = REGION_POR_HUSO[huso];
    if (!directa) return null;

    const grupo = HUSOS_AGRUPADOS[huso];
    if (!grupo) return directa;

    return regionDelGrupo(grupo) ?? directa;
}

function regionDelGrupo(grupo) {
    if (typeof navigator === 'undefined') return null;

    for (const idioma of navigator.languages ?? []) {
        try {
            const region = normalizarRegion(new Intl.Locale(idioma).region)
                ?? normalizarRegion(idioma.split('-')[1]);
            if (region && grupo.paises.includes(region)) return region;
        } catch {
            continue;
        }
    }

    return null;
}

function regionDelLocale() {
    if (typeof navigator === 'undefined') return null;

    const idioma = navigator.language || navigator.languages?.[0];
    if (!idioma) return null;

    const [prefijo, sufijo] = idioma.split('-');

    try {
        const locale = new Intl.Locale(idioma);

        return normalizarRegion(locale.region)
            ?? normalizarRegion(locale.maximize().region)
            ?? REGION_POR_IDIOMA[prefijo.toLowerCase()]
            ?? null;
    } catch {
        return normalizarRegion(sufijo)
            ?? REGION_POR_IDIOMA[prefijo.toLowerCase()]
            ?? null;
    }
}

function regionDelNavegador() {
    return regionDelHusoHorario() ?? regionDelLocale();
}

function detectarRegion() {
    return regionGuardada() ?? regionDelNavegador() ?? REGION_POR_DEFECTO;
}

let regionActual = detectarRegion();
const oyentes = new Set();

function notificar() {
    oyentes.forEach((oyente) => oyente());
}

function suscribir(oyente) {
    oyentes.add(oyente);
    return () => oyentes.delete(oyente);
}

const obtenerRegion = () => regionActual;

function guardarRegion(region) {
    try {
        localStorage.setItem(CLAVE_ALMACEN, region);
        return true;
    } catch {
        return false;
    }
}

export function cambiarRegion(valor) {
    const region = normalizarRegion(valor);
    if (!region || region === regionActual) return;

    regionActual = region;
    guardarRegion(region);
    notificar();
}

if (typeof window !== 'undefined') {
    window.addEventListener('storage', (evento) => {
        if (evento.key !== CLAVE_ALMACEN) return;

        const region = normalizarRegion(evento.newValue);
        if (!region || region === regionActual) return;

        regionActual = region;
        notificar();
    });
}

export function useRegion() {
    const region = useSyncExternalStore(suscribir, obtenerRegion, () => REGION_POR_DEFECTO);

    return { region, cambiarRegion };
}

export { obtenerRegion };
