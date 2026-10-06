// src/styles/typography.ts — Jerarquía tipográfica que conserva el escalado accesible.
import type { Typography } from '@/types/theme';

export const TYPOGRAPHY: Typography = {
  title: { fontSize: 32, lineHeight: 40, fontWeight: '800' },
  heading: { fontSize: 22, lineHeight: 30, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 25 },
  caption: { fontSize: 14, lineHeight: 21 },
  eyebrow: { fontSize: 12, lineHeight: 18, fontWeight: '800', letterSpacing: 2 },
};
