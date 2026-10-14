/**
 * frontend/src/utils/userPresentation.ts
 * Formatea fecha UTC y etiqueta de rol para la interfaz, sin inventar valores ausentes ni modificar datos del servidor.
 */
export function formatLoginDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value));
}
export function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    student: 'Estudiante',
  };
  return labels[role] ?? role;
}
