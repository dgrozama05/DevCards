import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { buildFilename } from './exporter';

describe('exporter', () => {
  // Feature: dev-cards, Property 8: Nombre de archivo de exportación
  // Valida: Requisito 4.2
  it('Propiedad 8: el nombre de archivo sigue el patrón devcard-[nombre].png', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (name) => {
          const filename = buildFilename(name);
          return filename === `devcard-${name}.png`;
        }
      ),
      { numRuns: 100 }
    );
  });
});
