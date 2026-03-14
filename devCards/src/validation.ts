import type { FormState } from './types';

export function validateLevel(value: number | ''): { error: string | null } {
  if (value === '' || value < 0 || value > 50) {
    return { error: 'El nivel debe estar entre 0 y 50' };
  }
  return { error: null };
}

export function validateScore(value: number | ''): { error: string | null } {
  if (value === '' || value < 1 || value > 99) {
    return { error: 'La puntuación debe estar entre 1 y 99' };
  }
  return { error: null };
}

export function validateForm(form: FormState): { canDownload: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!form.name.trim()) {
    errors.name = 'El nombre es obligatorio';
  }

  form.technologies.forEach((tech, i) => {
    if (!tech.name.trim()) {
      errors[`tech${i}Name`] = 'El nombre de la tecnología es obligatorio';
    }
    const scoreResult = validateScore(tech.score);
    if (scoreResult.error) {
      errors[`tech${i}Score`] = scoreResult.error;
    }
  });

  const canDownload = Object.keys(errors).length === 0;
  return { canDownload, errors };
}
