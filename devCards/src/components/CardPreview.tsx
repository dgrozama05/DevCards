import React, { useRef, useCallback } from 'react';
import type { FormState, EffectConfig } from '../types';
import { CLASS_THEMES } from '../constants';
import styles from './CardPreview.module.css';

interface CardPreviewProps {
  form: FormState;
  effect: EffectConfig;
}

const CardPreview = React.forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ form, effect }, ref) => {
    const theme = CLASS_THEMES[form.playerClass];
    const wrapperRef = useRef<HTMLDivElement>(null);

    const effectClass =
      effect.active && effect.type === 'golden'
        ? styles.golden
        : effect.active && effect.type === 'holographic'
        ? styles.holographic
        : '';

    const levelDisplay =
      form.level === '' ? 'LVL --' : `LVL ${String(form.level).padStart(2, '0')}`;

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const el = wrapperRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;   // -0.5 → 0.5
      const y = (e.clientY - top) / height - 0.5;    // -0.5 → 0.5
      el.style.setProperty('--tilt-x', `${(-y * 20).toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${(x * 20).toFixed(2)}deg`);
      el.style.setProperty('--shine-x', `${(x * 100 + 50).toFixed(1)}%`);
      el.style.setProperty('--shine-y', `${(y * 100 + 50).toFixed(1)}%`);
    }, []);

    const handleMouseLeave = useCallback(() => {
      const el = wrapperRef.current;
      if (!el) return;
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    }, []);

    return (
      <div
        ref={wrapperRef}
        className={styles.tiltWrapper}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
      <div
        ref={ref}
        className={`${styles.card} ${effectClass}`}
        style={{ background: theme.backgroundGradient }}
      >
        {/* Header: clase + icono */}
        <div className={styles.header}>
          <span className={styles.classIcon}>{theme.icon}</span>
          <span className={styles.className}>{form.playerClass}</span>
          <span className={styles.level}>{levelDisplay}</span>
        </div>

        {/* Zona central: avatar + nombre */}
        <div className={styles.nameZone}>
          {/* Avatar con iniciales */}
          <div
            className={styles.avatar}
            style={{
              background: `radial-gradient(circle at 35% 35%, ${theme.primaryColor}, ${theme.secondaryColor})`,
              boxShadow: `0 0 0 3px rgba(255,255,255,0.15), 0 0 24px ${theme.primaryColor}66`,
            }}
          >
            <span className={styles.avatarInitials}>
              {form.name
                ? form.name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
                : '?'}
            </span>
            <span className={styles.avatarIcon}>{theme.icon}</span>
          </div>

          {/* Nombre */}
          {form.name ? (
            <span className={styles.devName}>{form.name}</span>
          ) : (
            <span className={`${styles.devName} ${styles.placeholder}`}>Tu Nombre</span>
          )}

          {/* Overall stat */}
          {form.level !== '' && (
            <div className={styles.overallBadge}>
              <span className={styles.overallValue}>{form.level}</span>
              <span className={styles.overallLabel}>OVR</span>
            </div>
          )}
        </div>

        {/* Divisor decorativo */}
        <div
          className={styles.divider}
          style={{ backgroundColor: theme.primaryColor }}
        />

        {/* Tecnologías */}
        <div className={styles.techList}>
          {form.technologies.map((tech, i) => {
            const hasName = tech.name.trim() !== '';
            const hasScore = tech.score !== '';
            const score = hasScore ? Number(tech.score) : 0;

            return (
              <div key={i} className={styles.techRow}>
                <span
                  className={`${styles.techName} ${!hasName ? styles.placeholder : ''}`}
                >
                  {hasName ? tech.name : `Tecnología ${i + 1}`}
                </span>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: hasScore ? `${score}%` : '0%',
                      backgroundColor: theme.primaryColor,
                    }}
                  />
                </div>
                <span
                  className={`${styles.techScore} ${!hasScore ? styles.placeholder : ''}`}
                >
                  {hasScore ? score : '--'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer decorativo */}
        <div className={`${styles.footer} ${effect.active ? styles.footerLegendary : ''}`}>
          {effect.active ? (
            <span className={styles.footerTextLegendary}>⚡ Dev Card Legendary ⚡</span>
          ) : (
            <span className={styles.footerText}>DEV CARD</span>
          )}
        </div>

        {/* Shine highlight que sigue el ratón */}
        <div className={styles.shine} />
      </div>
      </div>
    );
  }
);

CardPreview.displayName = 'CardPreview';

export default CardPreview;
