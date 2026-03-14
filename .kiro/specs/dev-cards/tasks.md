# Plan de Implementación — DevCards

## Visión General

SPA en React 18 + TypeScript con Vite. Se implementa en capas: tipos e interfaces → lógica de dominio (validación, motor de efectos) → componentes UI (formulario, carta, exportador) → integración final.

## Tareas

- [x] 1. Scaffolding del proyecto y tipos base
  - Inicializar proyecto con `npm create vite@latest devCards -- --template react-ts`
  - Instalar dependencias: `html2canvas`, `fast-check`, `@testing-library/react`, `@testing-library/user-event`, `vitest`, `jsdom`
  - Crear `src/types.ts` con las interfaces `FormState`, `TechEntry`, `EffectConfig`, `EffectRule`, `ClassTheme` y el tipo `PlayerClass`
  - Crear `src/constants.ts` con `CLASS_THEMES` y `LEGENDARY_COMBOS`
  - _Requisitos: 1.1, 3.1, 3.3, 5.3_

- [x] 2. Módulo de validación
  - [x] 2.1 Implementar funciones de validación en `src/validation.ts`
    - `validateLevel(value: number | ''): { error: string | null }` — rango 0–50
    - `validateScore(value: number | ''): { error: string | null }` — rango 1–99
    - `validateForm(form: FormState): { canDownload: boolean; errors: Record<string, string> }`
    - _Requisitos: 1.2, 1.3, 1.4, 1.5_

  - [x]* 2.2 Test de propiedad: Validación de rango de Nivel
    - **Propiedad 1: Validación de rango de Nivel**
    - **Valida: Requisito 1.2**

  - [x]* 2.3 Test de propiedad: Validación de rango de Puntuación
    - **Propiedad 2: Validación de rango de Puntuación**
    - **Valida: Requisito 1.3**

  - [x]* 2.4 Test de propiedad: Descarga bloqueada con datos incompletos
    - **Propiedad 3: Descarga bloqueada con datos incompletos**
    - **Valida: Requisitos 1.4, 1.5, 4.4**

- [x] 3. Motor de Efectos
  - [x] 3.1 Implementar `src/effectsEngine.ts`
    - Función `evaluateEffects(form: FormState, rules: EffectRule[]): EffectConfig`
    - Función `registerRule(rule: EffectRule): void` con array de reglas mutable
    - Reglas built-in: suma > 270 (100%), suma 240–270 (40% probabilístico), combo legendaria
    - Exportar `DEFAULT_RULES` como array de reglas iniciales
    - _Requisitos: 5.1, 5.2, 5.3, 7.1_

  - [x]* 3.2 Test de propiedad: Activación por suma alta
    - **Propiedad 4: Activación de efecto especial por suma alta**
    - **Valida: Requisito 5.1**

  - [x]* 3.3 Test estadístico: Activación probabilística
    - **Propiedad 5: Activación probabilística de efecto especial**
    - Ejecutar `evaluateEffects` 1000 veces con suma en [240, 270] y verificar tasa entre 30%–50%
    - **Valida: Requisito 5.2**

  - [x]* 3.4 Test de propiedad: Activación por combinación legendaria
    - **Propiedad 6: Activación por combinación legendaria**
    - **Valida: Requisito 5.3**

  - [x]* 3.5 Test de propiedad: Sin efecto con puntuaciones bajas
    - **Propiedad 7: Sin efecto con puntuaciones bajas**
    - **Valida: Requisito 5.5**

  - [x]* 3.6 Test de propiedad: Extensibilidad del Motor de Efectos
    - **Propiedad 9: Extensibilidad del Motor de Efectos**
    - **Valida: Requisito 7.1**

- [x] 4. Checkpoint — Lógica de dominio completa
  - Asegurarse de que todos los tests de validación y motor de efectos pasan. Consultar al usuario si hay dudas.

- [x] 5. Módulo Exportador
  - [x] 5.1 Implementar `src/exporter.ts`
    - `exportCard(cardRef: HTMLDivElement, name: string): Promise<void>`
    - Usar `html2canvas` con `scale: 2` → resolución 800×1120px
    - Nombre de archivo: `devcard-[nombre].png`
    - Capturar errores y lanzar excepción descriptiva
    - _Requisitos: 4.1, 4.2, 4.3_

  - [ ]* 5.2 Test de propiedad: Nombre de archivo de exportación
    - **Propiedad 8: Nombre de archivo de exportación**
    - Extraer y testear la función `buildFilename(name: string): string` de forma aislada
    - **Valida: Requisito 4.2**

- [x] 6. Componente CardPreview
  - [x] 6.1 Crear `src/components/CardPreview.tsx` con CSS Module asociado
    - Dimensiones fijas 400×560px, `ref` forwarded para exportación
    - Renderizar: nombre, clase (con icono y tema de color), nivel, 3 tecnologías con barra de puntuación
    - Aplicar `CLASS_THEMES` para paleta de colores y fondo según clase seleccionada
    - Mostrar valores por defecto en gris/placeholder cuando los campos estén vacíos
    - _Requisitos: 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 6.2 Implementar efectos visuales en `CardPreview`
    - Añadir clase CSS condicional cuando `effect.active === true`
    - Efecto `golden`: `@keyframes` de borde dorado animado
    - Efecto `holographic`: `@keyframes` de gradiente iridiscente
    - Sin efecto adicional cuando `effect.active === false`
    - _Requisitos: 5.4, 5.5_

  - [ ]* 6.3 Tests unitarios de CardPreview
    - Renderizado con datos completos y verificación de elementos clave
    - Renderizado con datos vacíos y verificación de placeholders
    - Aplicación de clase CSS de efecto cuando `effect.active === true`
    - _Requisitos: 2.2, 2.3, 5.4, 5.5_

- [x] 7. Componente FormPanel
  - [x] 7.1 Crear `src/components/FormPanel.tsx`
    - Campos controlados: nombre (text), clase (select), nivel (number), 3 × (nombre tech + puntuación)
    - Validación inline en `onChange` usando funciones de `src/validation.ts`
    - Mensajes de error bajo cada campo con validación fallida
    - Emitir `onChange(FormState)` en cada cambio
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 7.2 Tests unitarios de FormPanel
    - Renderizado de todos los campos
    - Mensaje de error al introducir nivel fuera de rango
    - Mensaje de error al introducir puntuación fuera de rango
    - _Requisitos: 1.1, 1.2, 1.3_

- [x] 8. Integración en App y layout responsive
  - [x] 8.1 Actualizar `src/App.tsx`
    - Estado `formState` con `useState<FormState>`
    - Llamar a `evaluateEffects` en cada cambio de formulario (dentro de `useEffect` o derivado)
    - Pasar `formState` y `effectConfig` a `CardPreview`
    - Pasar `cardRef` a `CardPreview` y al botón de descarga
    - Botón de descarga: deshabilitado si `!canDownload`, llama a `exportCard` y muestra toast de error si falla
    - _Requisitos: 2.1, 4.3, 4.4, 5.6_

  - [x] 8.2 Implementar layout responsive en `src/App.css`
    - Disposición horizontal (formulario | carta) en pantallas ≥ 768px
    - Disposición vertical apilada en pantallas < 768px
    - _Requisito: 6.4_

  - [ ]* 8.3 Tests de integración en App
    - Que el botón de descarga esté deshabilitado con nombre vacío
    - Que el botón de descarga esté deshabilitado con tecnologías incompletas
    - Que el efecto visual se aplique cuando la suma supera 270
    - _Requisitos: 1.4, 1.5, 4.4, 5.1_

- [x] 9. Checkpoint final — Todos los tests pasan
  - Ejecutar `vitest --run` y verificar que todos los tests pasan. Consultar al usuario si hay dudas antes de cerrar.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido.
- Cada tarea referencia los requisitos específicos para trazabilidad.
- Los tests de propiedades usan `fast-check` con mínimo 100 iteraciones (1000 para la Propiedad 5).
- El comentario de cabecera en cada test de propiedad debe seguir el formato: `// Feature: dev-cards, Property N: <texto>`
