// src/utils/userPresentation.ts — Presenta datos reales sin fabricar fechas ni roles.
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
