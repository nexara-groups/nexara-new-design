// Intrinsic sizes of the static brand images, so <img> can carry width/height and reserve space (no layout shift).
// Every rule that styles these images sets width/height explicitly or to auto, so the attributes only supply the aspect ratio.
const SIZES: Record<string, [number, number]> = {
  '/brand/nexara-mark.svg': [1, 1],
  '/brand/clients/happy-farms.svg': [1024, 1024],
  '/brand/clients/iarsa.png': [772, 256],
  '/brand/clients/qualigene.png': [480, 105],
  '/brand/clients/rise-medical-hub.png': [240, 240],
  '/brand/clients/sai-nirmaan.png': [400, 201],
  '/brand/clients/sri-engineering-works.png': [268, 300],
  '/brand/labs/voice.jpg': [400, 790],
  '/brand/labs/agency.jpg': [400, 790],
  '/brand/labs/grow.jpg': [400, 790],
  '/brand/labs/forms.jpg': [600, 903],
  '/brand/labs/hr.jpg': [870, 528],
  '/brand/labs/lms.jpg': [280, 720],
  '/brand/labs/workflows.jpg': [280, 720],
};

export function imgSize(src: string): { width?: number; height?: number } {
  const size = SIZES[src];
  return size ? { width: size[0], height: size[1] } : {};
}
