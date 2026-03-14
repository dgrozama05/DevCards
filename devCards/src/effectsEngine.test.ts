import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { evaluateEffects, DEFAULT_RULES } from './effectsEngine';
import { LEGENDARY_COMBOS } from './constants';
import type { FormState, EffectRule } from './types';

// Helper: construye un FormState con las 3 puntuaciones dadas y tecnologías no legendarias
function buildFormWithScores([a, b, c]: [number, number, number]): FormState {
  return {
    name: 'Test',
    playerClass: 'Frontend',
    level: 10,
    technologies: [
      { name: 'TechA', score: a },
      { name: 'TechB', score: b },
      { name: 'TechC', score: c },
    ],
  };
}

// Helper: igual que buildFormWithScores pero garantiza tecnologías no legendarias
function buildFormNonLegendary([a, b, c]: [number, number, number]): FormState {
  return {
    name: 'Test',
    playerClass: 'Frontend',
    level: 10,
    technologies: [
      { name: 'NonLegendaryX', score: a },
      { name: 'NonLegendaryY', score: b },
      { name: 'NonLegendaryZ', score: c },
    ],
  };
}

describe('effectsEngine', () => {
  // Feature: dev-cards, Property 4: Activación de efecto especial por suma alta
  // Valida: Requisito 5.1
  it('Propiedad 4: activa efecto cuando la suma de puntuaciones supera 270', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 91, max: 99 }),
          fc.integer({ min: 91, max: 99 }),
          fc.integer({ min: 91, max: 99 })
        ),
        ([a, b, c]) => {
          const form = buildFormWithScores([a, b, c]);
          const result = evaluateEffects(form, DEFAULT_RULES);
          return result.active === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: dev-cards, Property 5: Activación probabilística de efecto especial
  // Valida: Requisito 5.2
  it('Propiedad 5: tasa de activación entre 30% y 50% para suma en [240, 270]', () => {
    // Usamos suma fija de 255 (85+85+85) que está en el rango [240, 270]
    const form = buildFormNonLegendary([85, 85, 85]);
    let activations = 0;
    const runs = 1000;
    for (let i = 0; i < runs; i++) {
      const result = evaluateEffects(form, DEFAULT_RULES);
      if (result.active) activations++;
    }
    const rate = activations / runs;
    expect(rate).toBeGreaterThanOrEqual(0.30);
    expect(rate).toBeLessThanOrEqual(0.50);
  });

  // Feature: dev-cards, Property 6: Activación por combinación legendaria
  // Valida: Requisito 5.3
  it('Propiedad 6: activa efecto para cada combinación legendaria con puntuaciones bajas', () => {
    for (const combo of LEGENDARY_COMBOS) {
      const form: FormState = {
        name: 'Test',
        playerClass: 'Frontend',
        level: 10,
        technologies: [
          { name: combo[0], score: 10 },
          { name: combo[1], score: 10 },
          { name: combo[2], score: 10 },
        ],
      };
      // suma = 30, muy por debajo de 240
      const result = evaluateEffects(form, DEFAULT_RULES);
      expect(result.active).toBe(true);
    }
  });

  // Feature: dev-cards, Property 7: Sin efecto con puntuaciones bajas
  // Valida: Requisito 5.5
  it('Propiedad 7: no activa efecto con puntuaciones bajas y tecnologías no legendarias', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 1, max: 79 }),
          fc.integer({ min: 1, max: 79 }),
          fc.integer({ min: 1, max: 79 })
        ).filter(([a, b, c]) => a + b + c < 240),
        ([a, b, c]) => {
          const form = buildFormNonLegendary([a, b, c]);
          const result = evaluateEffects(form, DEFAULT_RULES);
          return result.active === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: dev-cards, Property 9: Extensibilidad del Motor de Efectos
  // Valida: Requisito 7.1
  it('Propiedad 9: una nueva regla registrada es evaluada sin romper las reglas existentes', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          effectType: fc.constantFrom('golden' as const, 'holographic' as const),
        }),
        (ruleConfig) => {
          // Snapshot del comportamiento previo con puntuaciones bajas (sin efecto)
          const lowForm = buildFormNonLegendary([50, 50, 50]); // suma=150, sin combo
          const before = evaluateEffects(lowForm, DEFAULT_RULES);

          // Registrar nueva regla que siempre activa
          const newRule: EffectRule = {
            id: ruleConfig.id,
            effectType: ruleConfig.effectType,
            evaluate: () => true,
          };
          const extendedRules = [...DEFAULT_RULES, newRule];

          // La nueva regla activa el efecto
          const afterExtended = evaluateEffects(lowForm, extendedRules);

          // Las reglas originales no se ven afectadas
          const afterOriginal = evaluateEffects(lowForm, DEFAULT_RULES);

          return (
            before.active === false &&       // sin la nueva regla, no activa
            afterExtended.active === true &&  // con la nueva regla, activa
            afterOriginal.active === before.active // DEFAULT_RULES no mutado
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
