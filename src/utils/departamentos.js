export function traducirDepartamento(valor, t) {
    if (!valor) return valor;
    return t(`departamentos.${valor}`, { defaultValue: valor });
}
