/** Perfiles alineados con `UserPerfil` del backend NestJS. */
export const USER_PERFIL = {
  TODO: 'TODO',
  INGRESAR: 'INGRESAR',
}

/**
 * Perfiles que pueden crear exhortos (legacy: menú "INGRESAR EXHORTO").
 * @param {string | null | undefined} perfil
 */
export function canIngresarExhorto(perfil) {
  return perfil === USER_PERFIL.TODO || perfil === USER_PERFIL.INGRESAR
}

/**
 * @param {string | null | undefined} perfil
 */
export function canAdministrarUsuarios(perfil) {
  return perfil === USER_PERFIL.TODO
}

/**
 * Panel HOME con estadísticas y mapa regional.
 * @param {string | null | undefined} perfil
 */
export function canVerHomeDashboard(perfil) {
  return perfil === USER_PERFIL.TODO || perfil === USER_PERFIL.INGRESAR
}

/**
 * @param {string | null | undefined} perfil
 */
export function canVerHonorarios(perfil) {
  return perfil === USER_PERFIL.TODO
}

/**
 * @param {string | null | undefined} perfil
 */
export function canBuscarExhortos(perfil) {
  return perfil === USER_PERFIL.TODO || perfil === USER_PERFIL.INGRESAR
}
