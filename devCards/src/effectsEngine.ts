import type { FormState, EffectConfig, EffectRule } from './types';
import { LEGENDARY_COMBOS } from './constants';

function sumScores(form: FormState): number {
  return form.technologies.reduce((acc, tech) => {
    return acc + (tech.score === '' ? 0 : tech.score);
  }, 0);
}

function isLegendaryCombo(form: FormState): boolean {
  const techNames = form.technologies.map(t => t.name.trim().toLowerCase());
  return LEGENDARY_COMBOS.some(combo => {
    const comboLower = combo.map(c => c.toLowerCase());
    return (
      comboLower.length === 3 &&
      comboLower.every(c => techNames.includes(c))
    );
  });
}

export const DEFAULT_RULES: EffectRule[] = [
  {
    id: 'high-score',
    evaluate: (form: FormState) => sumScores(form) > 270,
    effectType: 'holographic',
  },
  {
    id: 'mid-score',
    evaluate: (form: FormState) => {
      const sum = sumScores(form);
      if (sum >= 200 && sum <= 270) {
        return Math.random() < 0.7;
      }
      return false;
    },
    effectType: 'golden',
  },
  {
    id: 'legendary-combo',
    evaluate: (form: FormState) => isLegendaryCombo(form),
    effectType: 'holographic',
  },
];

export function evaluateEffects(form: FormState, rules: EffectRule[]): EffectConfig {
  for (const rule of rules) {
    if (rule.evaluate(form)) {
      return { active: true, type: rule.effectType };
    }
  }
  return { active: false, type: null };
}

export function registerRule(rule: EffectRule): void {
  DEFAULT_RULES.push(rule);
}
