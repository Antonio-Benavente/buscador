import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esMX from '../locales/es-MX/translation.json';

export const IDIOMAS = ['de-DE', 'en-US', 'es-ES', 'es-MX', 'fr-FR', 'it-IT', 'ja-JP', 'ko-KR', 'pt-BR'];
export const IDIOMA_DEFECTO = 'es-MX';

const CARGADORES = {
  'de-DE': () => import('../locales/de-DE/translation.json'),
  'en-US': () => import('../locales/en-US/translation.json'),
  'es-ES': () => import('../locales/es-ES/translation.json'),
  'fr-FR': () => import('../locales/fr-FR/translation.json'),
  'it-IT': () => import('../locales/it-IT/translation.json'),
  'ja-JP': () => import('../locales/ja-JP/translation.json'),
  'ko-KR': () => import('../locales/ko-KR/translation.json'),
  'pt-BR': () => import('../locales/pt-BR/translation.json'),
};

const IDIOMA_POR_PREFIJO = {
  de: 'de-DE',
  en: 'en-US',
  es: 'es-MX',
  fr: 'fr-FR',
  it: 'it-IT',
  ja: 'ja-JP',
  ko: 'ko-KR',
  pt: 'pt-BR',
};

function idiomaGuardado() {
  try {
    return localStorage.getItem('idioma');
  } catch {
    return null;
  }
}

function guardarIdioma(idioma) {
  try {
    localStorage.setItem('idioma', idioma);
    return true;
  } catch {
    return false;
  }
}

function detectarIdioma() {
  const guardado = idiomaGuardado();
  if (guardado && IDIOMAS.includes(guardado)) return guardado;

  const navegador = (typeof navigator !== 'undefined' && navigator.language ? navigator.language : '').toLowerCase();
  return (
    IDIOMAS.find((idioma) => idioma.toLowerCase() === navegador)
    ?? IDIOMA_POR_PREFIJO[navegador.split('-')[0]]
    ?? IDIOMA_DEFECTO
  );
}

i18n.use(initReactI18next).init({
  resources: { [IDIOMA_DEFECTO]: { translation: esMX } },
  lng: detectarIdioma(),
  fallbackLng: IDIOMA_DEFECTO,
  supportedLngs: IDIOMAS,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

document.documentElement.lang = i18n.language;

i18n.on('languageChanged', (idioma) => {
  document.documentElement.lang = idioma;
});

export async function cargarIdioma(idioma) {
  if (!IDIOMAS.includes(idioma) || i18n.hasResourceBundle(idioma, 'translation')) return;

  const cargar = CARGADORES[idioma];
  if (!cargar) return;

  const { default: recursos } = await cargar();
  i18n.addResourceBundle(idioma, 'translation', recursos, true, true);
}

export async function cambiarIdioma(idioma) {
  await cargarIdioma(idioma);
  guardarIdioma(idioma);
  await i18n.changeLanguage(idioma);
}

export default i18n;
