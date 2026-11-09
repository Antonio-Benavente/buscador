# Buscador de Películas y Series

SPA para buscar y explorar películas, series y personas usando la API de [The Movie Database (TMDB)](https://www.themoviedb.org/). Incluye carruseles automáticos, paginación, ficha de detalle con reparto, tráilers y recomendaciones, y selector de idioma.

## Tecnologías

- [React 19](https://react.dev/) con [React Compiler](https://react.dev/learn/react-compiler)
- [Vite 8](https://vite.dev/)
- [React Router 7](https://reactrouter.com/)
- [i18next](https://www.i18next.com/) con `react-i18next` para la internacionalización (9 idiomas)
- [ESLint 10](https://eslint.org/) con `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` y `eslint-plugin-jsx-a11y`
- [pnpm](https://pnpm.io/) como gestor de paquetes

## Requisitos

- Node.js 20.19+ o 22.12+
- Una cuenta de TMDB con un **API Read Access Token** (v4)

## Puesta en marcha

1. Instala las dependencias:

   ```bash
   pnpm install
   ```

2. Crea un archivo `.env` en la raíz con tu token de TMDB (hay un
   `.env.example` para copiar). Puedes obtenerlo en
   https://www.themoviedb.org/settings/api (sección *API Read Access Token*):

   ```env
   VITE_TMDB_TOKEN=tu_api_read_access_token
   ```

   Opcional: define `VITE_TMDB_PROXY_URL` apuntando a un proxy propio (una
   function de Netlify/Vercel, un backend ligero...) que reenvíe las peticiones
   a TMDB añadiendo el token en el servidor. Así el token nunca viaja en el
   bundle del cliente y `VITE_TMDB_TOKEN` puede quedar vacío.

3. Arranca el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

## Scripts

| Comando             | Descripción                                    |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Servidor de desarrollo con HMR                 |
| `pnpm build`        | Genera la build de producción en `dist/`       |
| `pnpm preview`      | Sirve localmente la build de producción        |
| `pnpm lint`         | Analiza el código con ESLint                   |

## Despliegue en Netlify

El repo incluye `netlify.toml` con el comando de build, la carpeta `dist` y la
redirección SPA (para que rutas como `/movies/123` funcionen al recargar).

1. En Netlify: **Add new site → Import an existing project** y elige el repo.
2. Netlify detecta `pnpm-lock.yaml` y usa la configuración de `netlify.toml`.
3. En **Site configuration → Environment variables** define:
   - `VITE_TMDB_TOKEN` con tu token de TMDB, o
   - `VITE_TMDB_PROXY_URL` si usas un proxy que guarda el token en el servidor.
4. Deploy. Cada push a la rama principal genera una nueva build.

## Estructura del proyecto

```
├── package.json         Dependencias y scripts (dev/build/lint/preview)
├── pnpm-lock.yaml       Versión exacta de dependencias
├── index.html           Entry point de la SPA (meta SEO, fuentes, #root)
├── vite.config.js       Plugins de React y React Compiler
├── eslint.config.js     Config plana de ESLint (recommended + jsx-a11y + react-hooks)
├── .env                 VITE_TMDB_TOKEN (no se versiona)
├── .env.example         Plantilla de variables de entorno
└── src/
    ├── main.jsx          createRoot + StrictMode + BrowserRouter
    ├── App.jsx           Layout, ScrollToTop y definición de rutas
    ├── App.css           Estilos del shell: header sticky, footer, paginación y carrusel
    ├── index.css         Reset, variables CSS, tema claro/oscuro, utilidades y tipografías
    │
    ├── assets/           Imágenes e iconos
    │   ├── 404.webp          Ilustración de la página 404
    │   ├── noimagen.webp     Placeholder cuando no hay póster
    │   ├── chevronLeft.svg   Flechas (volver, carrusel, paginación)
    │   ├── chevronRight.svg  Flecha derecha de paginación
    │   ├── search.svg        Icono del buscador
    │   ├── x.svg             Botón de limpiar búsqueda
    │   └── tmdb.svg          Logo de TMDB (footer)
    │
    ├── components/       Componentes reutilizables
    │   ├── Header.jsx / Footer.jsx      Cabecera sticky (nav activa + menú móvil) y pie con selector de país y aviso TMDB
    │   ├── SearchBar.jsx (+.css)        Campo de búsqueda controlado, compartido por portada y /search
    │   ├── MediaCard.jsx (+.css)        Tarjeta enlazada con srcSet responsive y puntuación
    │   ├── MediaDetails.jsx (+.css)     Ficha completa: panel único con póster, datos, reparto y recomendaciones
    │   ├── Carousel.jsx                 Carrusel infinito con autoplay, ResizeObserver y copias inertes
    │   ├── Pagination.jsx               Botones anterior/siguiente
    │   ├── Loading.jsx (+.css)          Spinner de página y esqueletos (`variant` page/grid/row)
    │   ├── ErrorBoundary.jsx            Captura errores de render y muestra PageError; se reinicia al navegar
    │   ├── ErrorState.jsx (+.css)       Estado de error con botón reintentar
    │   └── ScrollToTop.jsx              Restaura el scroll al cambiar de ruta
    │
    ├── pages/            Vistas asignadas a rutas
    │   ├── Home.jsx (+Home.css)         Portada con hero y 4 carruseles (cartelera, próximos, populares)
    │   ├── MediaList.jsx (+cards.css)   Listado paginado genérico (películas/series/personas)
    │   ├── Search.jsx (+Search.css)     Buscador multi con debounce, abort y paginación
    │   ├── MovieDetails.jsx             Wrapper → MediaDetails (type="movie")
    │   ├── SerieDetails.jsx             Wrapper → MediaDetails (type="tv")
    │   ├── PersonDetails.jsx            Ficha de persona (bio y créditos) con el mismo panel
    │   ├── Page404.jsx                 Ruta o contenido inexistente (compartido con las fichas)
    │   ├── PageError.jsx               Error inesperado: la muestra ErrorBoundary
    │   └── errorPage.css               Estilo compartido de Page404 y PageError
    │
    ├── i18n/
    │   └── index.js                   Configuración de i18next, detección y cambio de idioma
    │
    ├── locales/           Traducciones (9 idiomas, una carpeta por locale)
    │   └── <locale>/translation.json   Claves de UI; es-MX es la referencia
    │
    ├── hooks/
    │   ├── useRequest.js                 Estado base de peticiones: clave de vigencia + retry (compartido)
    │   ├── useTmdb.js                    Fetch genérico con abort, error, loading y retry (solo deps primitivas)
    │   ├── useMediaDetails.js            Carga detalle + créditos + vídeos + recomendaciones
    │   ├── useTrailerModal.js            Modal de tráiler: scroll lock, focus trap y Escape
    │   ├── useRegion.js                  Región detectada del navegador, persistida y compartida
    │   └── useDocumentTitle.js           Actualiza document.title según la página
    │
    ├── services/        Cliente de la API de TMDB
    │   ├── tmdbClient.js                 tmdbFetch: Bearer, params, signal, caché en memoria (TTL 5 min) y errores HTTP
    │   ├── tmdbMovies.js                 Endpoints de películas (region donde aplica)
    │   ├── tmdbSeries.js                 Endpoints de series
    │   ├── tmdbPeople.js                 Endpoints de personas
    │   └── tmdb.js                       Buscador multi + re-export del resto
    │
    └── utils/
        ├── config.js                      API_URL (o proxy via VITE_TMDB_PROXY_URL) y TOKEN, aviso si falta
        ├── constants.js                   MEDIA_TYPES, MAX_PAGE y NAV_MEDIA_QUERY (valores compartidos)
        ├── log.js                         logError: consola de errores en desarrollo
        ├── images.js                      IMAGE_BASE_URL y helper img(path, size)
        ├── apiError.js                    esNoEncontrado: ¿TMDB respondió 404? (error.status)
        ├── searchParams.js                leerPagina + construirParams (query y page de la URL)
        ├── trailer.js                     findTrailer: elección de tráiler con prioridad
        └── facts.js                       buildMediaFacts + buildPersonFacts: fichas sin datos ausentes
```

## Región

La región de TMDB (`region`) es independiente del idioma: `es-MX` significa "textos en
español latino", no "contenido de México". Por eso se gestiona aparte.

- `src/hooks/useRegion.js` detecta la región automáticamente en este orden:
  **1)** huso horario del sistema (`America/Lima` → `PE` — es la mejor señal
  de ubicación sin pedir permiso; punta del mapa best-effort de los mercados
  relevantes). Cuando Windows agrupa varios países bajo un mismo identificador
  (p. ej. "(UTC-05:00) Bogotá, Lima, Quito, Río Branco" → `America/Bogota`),
  el huso se desambigua con los idiomas preferidos del navegador
  (`es-PE` → `PE`) o el país por defecto del grupo. **2)** región del locale
  del navegador (`es-CO` → `CO`), **3)** región máxima con
  `Intl.Locale.maximize()` (`en` → `en-US`), **4)** aproximación por idioma
  (`es` → `ES`). Sin resultado, termina en `US`. La elección manual se guarda en
  `localStorage` bajo la clave `region` y prevalece; puede restablecerse desde
  la opción *Auto* del footer. El estado se comparte con `useSyncExternalStore`
  y se sincroniza entre pestañas.
- El selector de país vive en el **footer** y muestra los mercados que la
  detección automática puede resolver (los países del mapa de husos horarios,
  ~28) con los nombres traducidos vía `Intl.DisplayNames`, sin peticiones de
  red. En la primera visita se preselecciona el país detectado por el sistema
  (huso horario, con desambiguación de las zonas que Windows agrupa); si el
  huso del equipo no coincide con la ubicación real, el usuario simplemente
  elige su país y queda guardado en `localStorage`. Si la región detectada no
  está en el listado, aparece como opción dedicada para que el selector
  siempre refleje el estado real.
- `region` solo se envía a los endpoints donde TMDB lo soporta:

  | Endpoint | Parámetro |
  | --- | --- |
  | `/movie/popular`, `/movie/now_playing`, `/movie/upcoming` | `region` |
  | `/search/movie` | `region` |
  | `/discover/movie` | `region` (vía `filters`) |

- `/search/multi` es **global**: TMDB no acepta `region` ahí, así que el buscador no filtra por
  país ni forma parte de su clave de petición en `Search.jsx`.
- Cambiar de región o de idioma resetea `page` a 1 y añade `region` a las dependencias de
  `useTmdb` en las vistas que sí la usan; `/search/movie` y `/discover/movie` ya aceptan `region`
  mediante su parámetro `extra`/`filters`, listos para cuando se consuman desde esos flujos.
- La región **solo** se guarda en `localStorage`; no se refleja en la URL.

## Rutas

| Ruta              | Página                                 |
| ----------------- | -------------------------------------- |
| `/`               | Inicio: portada con hero y carruseles   |
| `/search`         | Buscador multi (película/serie/persona) |
| `/movies`         | Películas populares paginadas          |
| `/movies/:id`     | Detalle de película                    |
| `/series`         | Series populares paginadas             |
| `/series/:id`     | Detalle de serie                       |
| `/people`         | Personas populares paginadas           |
| `/people/:id`     | Detalle de persona                     |

`/person` y `/persons` se mantienen como alias de `/people` para no romper enlaces guardados.

### Notas de implementación

- La URL es la fuente de verdad de `/search` (`?q=` y `?page=`), por lo que el botón atrás del
  navegador restaura consulta y página. Escribir sustituye la entrada del historial; paginar la añade.
- Cambiar de idioma o de región también vuelve a la página 1 en los listados paginados, y se
  refleja en `useTmdb` y en la clave de la petición. En `/search` solo el cambio de idioma
  (la consulta es global y no depende de la región).
- La paginación se acota a `MAX_PAGE` (500, el límite duro de TMDB) tanto en la página derivada
  de la URL como en `total_pages`, de modo que una URL a mano con `?page=900` no muestra resultados vacíos.
- El estado de las peticiones (clave de vigencia, reintento, abort) vive en `useRequestState` y lo
  comparten `useTmdb`, `useMediaDetails` y la búsqueda con debounce: cualquier arreglo de race
  conditions se hace en un único sitio.
- `tmdbFetch` mantiene una caché en memoria de respuestas correctas con TTL de 5 minutos:
  reentrar a un listado o ficha no repite las peticiones ni vuelve a mostrar esqueletos. Las
  peticiones abortadas nunca se guardan, así que el reintento del effect es una petición limpia.
- El carrusel duplica sus elementos para poder repetir en bucle; las copias se marcan con `inert`
  para que sigan siendo visibles pero no entren en el orden de tabulación.
- Las páginas muestran esqueletos de carga en lugar de reemplazar todo por un spinner, de modo que el
  título y la navegación no desaparecen mientras llegan los datos.

## Notas

- Capas de manejo de errores, de fuera hacia dentro: `ErrorBoundary` (main.jsx) captura errores de
  renderizado de cualquier componente y muestra `PageError` con "Inicio"/"Recargar" (se reinicia al
  navegar); la ruta comodín `*` y los 404 de TMDB en fichas (`error.status === 404`, `esNoEncontrado`)
  muestran `Page404`; los fallos de red se pintan con `ErrorState` y "Reintentar" en cada página.
- `VITE_TMDB_TOKEN` se incrusta en el bundle del cliente (comportamiento de Vite). Para producción
  conviene definir `VITE_TMDB_PROXY_URL` y delegar las llamadas a la API en un backend/proxy que
  oculte el token; el cliente ya soporta ese modo (envía el header Bearer solo si hay token).
- Los errores de red y de render no se van a paraíso: `utils/log.js` los imprime en consola en
  desarrollo (`logError`) y es el único punto a cambiar si se integra un reporte de errores real.
- Este producto utiliza la API de TMDB, pero no está respaldado ni certificado por TMDB.