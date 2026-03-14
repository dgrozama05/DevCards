import { useState, useRef, useCallback, useEffect } from 'react';
import type { FormState, EffectConfig } from './types';
import { evaluateEffects, DEFAULT_RULES } from './effectsEngine';
import { validateForm } from './validation';
import { exportCard } from './exporter';
import FormPanel from './components/FormPanel';
import CardPreview from './components/CardPreview';
import './App.css';

const INITIAL_FORM: FormState = {
  name: '',
  playerClass: 'Frontend',
  level: '',
  technologies: [
    { name: '', score: '' },
    { name: '', score: '' },
    { name: '', score: '' },
  ],
};

export default function App() {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [effectConfig, setEffectConfig] = useState<EffectConfig>({ active: false, type: null });
  // 'idle' | 'evolving' | 'revealed'
  const [evolutionPhase, setEvolutionPhase] = useState<'idle' | 'evolving' | 'revealed'>('idle');
  const cardRef = useRef<HTMLDivElement>(null);
  const effectLocked = useRef(false);
  const prevEffectKey = useRef('');

  // Cuando el efecto se activa, lanzar la secuencia de evolución
  useEffect(() => {
    if (!effectConfig.active) return;
    setEvolutionPhase('evolving');
    // Duración de la animación de evolución: 3.2s → luego revelar
    const t = setTimeout(() => setEvolutionPhase('revealed'), 3200);
    return () => clearTimeout(t);
  }, [effectConfig.active]);

  // Nivel = media de las puntuaciones válidas, reescalada de [1,99] a [0,50]
  function withAutoLevel(form: FormState): FormState {
    const validScores = form.technologies
      .map((t) => t.score)
      .filter((s): s is number => typeof s === 'number' && s >= 1 && s <= 99);
    const level =
      validScores.length > 0
        ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length / 99) * 50)
        : '';
    return { ...form, level };
  }

  const handleFormChange = useCallback((form: FormState) => {
    const updated = withAutoLevel(form);
    setFormState(updated);

    if (effectLocked.current) return;

    // Solo evaluar cuando las 3 tecnologías tienen nombre y puntuación válida
    const allComplete = updated.technologies.every(
      (t) => t.name.trim() !== '' && typeof t.score === 'number' && t.score >= 1 && t.score <= 99
    );
    if (!allComplete) return;

    // Clave basada en tecnologías y puntuaciones
    const key = updated.technologies
      .map((t) => `${t.name}:${t.score}`)
      .join('|');

    // No re-evaluar si la combinación no cambió
    if (key === prevEffectKey.current) return;
    prevEffectKey.current = key;

    // Evaluar el efecto una sola vez con las 3 techs completas
    const result = evaluateEffects(updated, DEFAULT_RULES);
    setEffectConfig(result);

    // Congelar hasta recarga
    effectLocked.current = true;
  }, []);

  const canDownload = validateForm(formState).canDownload;

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloadError(null);
    try {
      await exportCard(cardRef.current, formState.name);
    } catch (err) {
      setDownloadError(
        err instanceof Error ? err.message : 'La descarga no pudo completarse'
      );
    }
  }

  return (
    <div className="app">
      <h1 className="app-title">DevCards</h1>

      {/* Overlay de evolución — solo visible durante la animación */}
      {evolutionPhase === 'evolving' && (
        <div className="evolution-overlay" aria-hidden="true">
          <div className="evolution-flash" />
          <div className="evolution-card-wrap">
            <CardPreview form={formState} effect={{ active: false, type: null }} />
          </div>
        </div>
      )}

      <div className="app-layout">
        <div className="app-form">
          <FormPanel form={formState} onChange={handleFormChange} />
        </div>

        <div className="app-preview">
          <div
            className={[
              effectConfig.active && evolutionPhase === 'revealed' ? 'legendary-aura' : '',
              evolutionPhase === 'revealed' ? 'card-reveal' : '',
            ].join(' ')}
            style={{ position: 'relative' }}
          >
            {effectConfig.active && evolutionPhase === 'revealed' && (
              <div className="legendary-sparks" aria-hidden="true">
                {[
                  { top: '10%',  left: '-8px',  tx: '-15px', ty: '-35px', dur: '1.6s', delay: '0s'    },
                  { top: '30%',  left: '-12px', tx: '-20px', ty: '-25px', dur: '2.1s', delay: '0.3s'  },
                  { top: '70%',  left: '-8px',  tx: '-12px', ty: '-40px', dur: '1.8s', delay: '0.7s'  },
                  { top: '90%',  left: '10%',   tx: '-10px', ty: '-30px', dur: '2.3s', delay: '0.1s'  },
                  { top: '10%',  right: '-8px', tx: '15px',  ty: '-35px', dur: '1.9s', delay: '0.5s'  },
                  { top: '50%',  right: '-12px',tx: '20px',  ty: '-28px', dur: '1.5s', delay: '0.9s'  },
                  { top: '80%',  right: '-8px', tx: '12px',  ty: '-38px', dur: '2.0s', delay: '0.2s'  },
                  { top: '-8px', left: '20%',   tx: '-8px',  ty: '-20px', dur: '1.7s', delay: '0.4s'  },
                  { top: '-8px', left: '60%',   tx: '8px',   ty: '-22px', dur: '2.2s', delay: '0.8s'  },
                ].map((s, i) => (
                  <span key={i} style={{
                    top: s.top, left: s.left, right: (s as { right?: string }).right,
                    '--tx': s.tx, '--ty': s.ty,
                    '--dur': s.dur, '--delay': s.delay,
                  } as React.CSSProperties} />
                ))}
              </div>
            )}
            <CardPreview ref={cardRef} form={formState} effect={evolutionPhase === 'revealed' ? effectConfig : { active: false, type: null }} />
          </div>

          <button
            className="download-btn"
            onClick={handleDownload}
            disabled={!canDownload}
          >
            Descargar PNG
          </button>

          {downloadError !== null && (
            <p className="download-error">{downloadError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
