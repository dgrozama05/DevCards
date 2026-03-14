import html2canvas from 'html2canvas';

/**
 * Construye el nombre de archivo PNG para una devcard.
 * Exportada para facilitar el testing aislado.
 */
export function buildFilename(name: string): string {
  return `devcard-${name}.png`;
}

/**
 * Captura el div de la carta y lo descarga como PNG.
 * Usa html2canvas con scale: 2 para resolución 2× (800×1120px).
 */
export async function exportCard(cardRef: HTMLDivElement, name: string): Promise<void> {
  try {
    const canvas = await html2canvas(cardRef, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = buildFilename(name);
    link.click();
  } catch (err) {
    throw new Error(
      `La descarga no pudo completarse: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
