import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import noImage from '../assets/noimagen.webp';
import { img } from '../utils/images';
import { MEDIA_TYPES } from '../utils/constants';
import { traducirDepartamento } from '../utils/departamentos';
import './MediaCard.css';

const PERSONA = new Set([MEDIA_TYPES.person, 'people', 'persons']);

function MediaCard({ item, type, inert = false }) {
    const { t } = useTranslation();
    const isMovie = type === MEDIA_TYPES.movie;
    const isPerson = PERSONA.has(type);

    const titulo = isMovie ? item.title : item.name;
    const poster = img(isPerson ? item.profile_path : item.poster_path, 'w500');
    const detalle = isMovie ? 'movies' : isPerson ? 'people' : 'series';
    const meta = isPerson ? traducirDepartamento(item.known_for_department, t) : null;

    return (
        <article className='mediaCard' inert={inert}>
            <Link to={`/${detalle}/${item.id}`} className='mediaCardLink'>
                <div className='posterContainer'>
                    <img
                        className='poster'
                        src={poster ?? noImage}
                        srcSet={poster ? `${img(isPerson ? item.profile_path : item.poster_path, 'w342')} 342w, ${poster} 500w, ${img(isPerson ? item.profile_path : item.poster_path, 'w780')} 780w` : undefined}
                        sizes='(max-width: 600px) 45vw, 190px'
                        alt={titulo || t('comunes.sinTitulo')}
                        width='250'
                        height='355'
                        loading='lazy'
                        decoding='async'
                    />
                </div>

                <h2 className='cardTitle'>{titulo}</h2>

                {isPerson && meta && <p className='cardMeta'>{meta}</p>}
            </Link>
        </article>
    );
}

export default MediaCard;
