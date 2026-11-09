export function buildMediaFacts(data, isMovie, t) {
    if (isMovie) {
        return [
            data.release_date && { clave: 'estreno', texto: t('detalles.fechaEstreno'), valor: data.release_date },
            data.runtime && { clave: 'duracion', texto: t('detalles.duracion'), valor: t('detalles.minutos', { min: data.runtime }) },
        ].filter(Boolean);
    }

    return [
        data.first_air_date && { clave: 'primera', texto: t('detalles.primeraEmision', { date: data.first_air_date }) },
        data.last_air_date && { clave: 'ultima', texto: t('detalles.ultimaEmision', { date: data.last_air_date }) },
        data.status && { clave: 'estado', texto: t('detalles.estado', { status: data.status }) },
        data.number_of_seasons != null && { clave: 'temporadas', texto: t('detalles.temporadas', { count: data.number_of_seasons }) },
        data.number_of_episodes != null && { clave: 'episodios', texto: t('detalles.episodios', { count: data.number_of_episodes }) },
    ].filter(Boolean);
}

export function buildPersonFacts(persona, t, traducirDepartamento) {
    return [
        persona.birthday && { clave: 'nacimiento', texto: t('detalles.fechaNacimiento'), valor: persona.birthday },
        persona.deathday && { clave: 'fallecimiento', texto: t('detalles.fechaFallecimiento'), valor: persona.deathday },
        persona.place_of_birth && { clave: 'lugar', texto: t('detalles.lugarNacimiento'), valor: persona.place_of_birth },
        persona.known_for_department && {
            clave: 'departamento',
            texto: t('detalles.departamento'),
            valor: traducirDepartamento ? traducirDepartamento(persona.known_for_department, t) : persona.known_for_department,
        },
    ].filter(Boolean);
}
