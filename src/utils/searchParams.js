export function leerPagina(valor) {
    const numero = Number(valor);
    return Number.isInteger(numero) && numero > 0 ? numero : 1;
}

export function construirParams(actual, { query, seccion, page } = {}) {
    const siguiente = new URLSearchParams(actual);

    if (query !== undefined) {
        const consulta = query.trim();
        if (consulta) siguiente.set('q', query);
        else siguiente.delete('q');
    }

    if (seccion !== undefined) {
        if (seccion) siguiente.set('seccion', seccion);
        else siguiente.delete('seccion');
    }

    if (page > 1) siguiente.set('page', String(page));
    else siguiente.delete('page');

    return siguiente;
}
