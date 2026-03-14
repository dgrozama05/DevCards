import type { FormState, PlayerClass } from '../types';
import { validateScore } from '../validation';
import { TECH_LIST } from '../constants';
import styles from './FormPanel.module.css';

interface FormPanelProps {
  form: FormState;
  onChange: (form: FormState) => void;
}

const CLASSES: PlayerClass[] = ['Frontend', 'Backend', 'Fullstack', 'DevOps'];

export default function FormPanel({ form, onChange }: FormPanelProps) {
  function handleName(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...form, name: e.target.value });
  }

  function handleClass(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ ...form, playerClass: e.target.value as PlayerClass });
  }

  function handleTechName(index: number, value: string) {
    const technologies = form.technologies.map((t, i) =>
      i === index ? { ...t, name: value } : t
    ) as FormState['technologies'];
    onChange({ ...form, technologies });
  }

  function handleTechScore(index: number, value: string) {
    const technologies = form.technologies.map((t, i) =>
      i === index ? { ...t, score: value === '' ? '' : Number(value) } : t
    ) as FormState['technologies'];
    onChange({ ...form, technologies });
  }

  // Tecnologías ya seleccionadas (para evitar duplicados)
  const selectedTechs = form.technologies.map((t) => t.name);

  return (
    <div className={styles.panel}>
      {/* Nombre */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="fp-name">Nombre</label>
        <input
          id="fp-name"
          type="text"
          className={styles.input}
          value={form.name}
          onChange={handleName}
          placeholder="Tu nombre"
          autoComplete="off"
        />
      </div>

      <div className={styles.divider} />

      {/* Clase */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="fp-class">Clase</label>
        <select
          id="fp-class"
          className={styles.select}
          value={form.playerClass}
          onChange={handleClass}
        >
          {CLASSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className={styles.divider} />

      {/* Nivel — calculado automáticamente, solo lectura */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Nivel</label>
        <div className={styles.levelDisplay}>
          {form.level === '' ? '—' : `${form.level}`}
          <span className={styles.levelHint}>media de tus puntuaciones</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Tecnologías */}
      <div>
        <p className={styles.sectionTitle}>Tecnologías</p>
        <div className={styles.techSection}>
          {form.technologies.map((tech, i) => {
            const scoreError =
              tech.score !== '' ? validateScore(tech.score).error : null;
            return (
              <div key={i} className={styles.techRow}>
                <span className={styles.techIndex}>{i + 1}</span>
                <div className={styles.techFields}>
                  <div className={styles.techNameField}>
                    <select
                      aria-label={`Tecnología ${i + 1}`}
                      className={styles.select}
                      value={tech.name}
                      onChange={(e) => handleTechName(i, e.target.value)}
                    >
                      <option value="">Selecciona...</option>
                      {TECH_LIST.map((t) => (
                        <option
                          key={t}
                          value={t}
                          disabled={selectedTechs.includes(t) && tech.name !== t}
                        >
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.techScoreField}>
                    <input
                      type="number"
                      aria-label={`Puntuación ${i + 1}`}
                      className={`${styles.input} ${scoreError ? styles.error : ''}`}
                      value={tech.score}
                      onChange={(e) => handleTechScore(i, e.target.value)}
                      min={1}
                      max={99}
                      placeholder="1–99"
                    />
                    {scoreError && (
                      <span className={styles.errorMsg}>{scoreError}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
