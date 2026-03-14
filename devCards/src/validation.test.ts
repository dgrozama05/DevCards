import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateLevel, validateScore, validateForm } from './validation';
import type { FormState } from './types';

// Helper para construir un FormState completo
function buildForm(overrides: Partial<FormState> = {}): FormState {
  return {
    name: 'Dev',
    playerClass: 'Frontend',
    level: 10,
    technologies: [
      { name: 'React', score: 80 },
      { name: 'TypeScript', score: 75 },
      { name: 'Node.js', score: 70 },
    ],
    ...overrides,
  };
}

describe('validateLevel', () => {
  // Feature: dev-cards, Property 1: Validación de rango de Nivel
  // Valida: Requisito 1.2
  it('Property 1: acepta valores en [0,50] y rechaza los que están fuera', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }),
        (level) => {
          const result = validateLevel(level);
          if (level < 0 || level > 50) return result.error !== null;
          return result.error === null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('devuelve error cuando el valor es cadena vacía', () => {
    expect(validateLevel('')).toEqual({ error: expect.any(String) });
  });
});

describe('validateScore', () => {
  // Feature: dev-cards, Property 2: Validación de rango de Puntuación
  // Valida: Requisito 1.3
  it('Property 2: acepta valores en [1,99] y rechaza los que están fuera', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }),
        (score) => {
          const result = validateScore(score);
          if (score < 1 || score > 99) return result.error !== null;
          return result.error === null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('devuelve error cuando el valor es cadena vacía', () => {
    expect(validateScore('')).toEqual({ error: expect.any(String) });
  });
});

describe('validateForm', () => {
  // Feature: dev-cards, Property 3: Descarga bloqueada con datos incompletos
  // Valida: Requisitos 1.4, 1.5, 4.4
  it('Property 3: canDownload es false cuando el nombre está vacío', () => {
    const result = validateForm(buildForm({ name: '' }));
    expect(result.canDownload).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('Property 3: canDownload es false cuando una tecnología no tiene nombre', () => {
    const form = buildForm();
    form.technologies[1].name = '';
    const result = validateForm(form);
    expect(result.canDownload).toBe(false);
  });

  it('Property 3: canDownload es false cuando una tecnología tiene puntuación vacía', () => {
    const form = buildForm();
    form.technologies[2].score = '';
    const result = validateForm(form);
    expect(result.canDownload).toBe(false);
  });

  it('Property 3: canDownload es false cuando una puntuación está fuera de rango', () => {
    const form = buildForm();
    form.technologies[0].score = 0; // fuera de [1,99]
    const result = validateForm(form);
    expect(result.canDownload).toBe(false);
  });

  it('canDownload es true con todos los datos válidos', () => {
    const result = validateForm(buildForm());
    expect(result.canDownload).toBe(true);
    expect(result.errors).toEqual({});
  });
});
