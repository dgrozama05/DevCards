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
    const scale = 2;
    const radius = 18 * scale; // border-radius × scale

    const raw = await html2canvas(cardRef, {
      scale,
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      onclone: (_doc, el) => {
        // Quitar box-shadow y border durante la captura para evitar artefactos
        (el as HTMLElement).style.boxShadow = 'none';
        (el as HTMLElement).style.animation = 'none';
      },
    });

    // Recortar esquinas redondeadas en un canvas intermedio
    const clipped = document.createElement('canvas');
    clipped.width = raw.width;
    clipped.height = raw.height;
    const ctx = clipped.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(clipped.width - radius, 0);
    ctx.quadraticCurveTo(clipped.width, 0, clipped.width, radius);
    ctx.lineTo(clipped.width, clipped.height - radius);
    ctx.quadraticCurveTo(clipped.width, clipped.height, clipped.width - radius, clipped.height);
    ctx.lineTo(radius, clipped.height);
    ctx.quadraticCurveTo(0, clipped.height, 0, clipped.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(raw, 0, 0);

    const url = clipped.toDataURL('image/png');
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
