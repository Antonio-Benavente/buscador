export function esNoEncontrado(error) {
    return error?.status === 404;
}
