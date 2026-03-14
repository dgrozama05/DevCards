// Clases disponibles
export type PlayerClass = 'Frontend' | 'Backend' | 'Fullstack' | 'DevOps';

// Entrada de tecnología individual
export interface TechEntry {
  name: string;
  score: number | '';
}

// Estado del formulario principal
export interface FormState {
  name: string;
  playerClass: PlayerClass;
  level: number | '';
  technologies: [TechEntry, TechEntry, TechEntry];
}

// Configuración del efecto especial calculado
export interface EffectConfig {
  active: boolean;
  type: 'golden' | 'holographic' | null;
}

// Regla evaluable por el Motor de Efectos
export interface EffectRule {
  id: string;
  evaluate: (form: FormState) => boolean;
  effectType: 'golden' | 'holographic';
}

// Configuración visual por clase
export interface ClassTheme {
  primaryColor: string;
  secondaryColor: string;
  icon: string;
  backgroundGradient: string;
}
