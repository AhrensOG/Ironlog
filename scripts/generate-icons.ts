import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "public", "icons");

// Paths del icono Dumbbell de lucide-react (viewBox 0 0 24 24, stroke).
const DUMBBELL_PATHS = [
  "M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z",
  "m2.5 21.5 1.4-1.4",
  "m20.1 3.9 1.4-1.4",
  "M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z",
  "m9.6 14.4 4.8-4.8",
];

const GRADIENT_TOP = "#f97316";
const GRADIENT_BOTTOM = "#ea580c";
const STROKE = "#ffffff";

function dumbbellSvg(size: number, iconSize: number, iconX: number, iconY: number): string {
  const strokeWidth = (1.6 * iconSize) / 24;
  const pathElements = DUMBBELL_PATHS.map(
    (d) =>
      `<path d="${d}" fill="none" stroke="${STROKE}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GRADIENT_TOP}"/>
      <stop offset="100%" stop-color="${GRADIENT_BOTTOM}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="url(#bg)"/>
  <g transform="translate(${iconX} ${iconY}) scale(${iconSize / 24})">${pathElements}</g>
</svg>`;
}

async function render(file: string, size: number, iconSize: number) {
  const iconX = (size - iconSize) / 2;
  const svg = dumbbellSvg(size, iconSize, iconX, iconX);
  await sharp(Buffer.from(svg)).png().toFile(join(OUT_DIR, file));
  console.log(`Generated ${file} (${size}x${size})`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  // 180px: icono al 70% para que iOS no recorte (zona segura).
  await render("apple-touch-icon.png", 180, Math.round(180 * 0.7));
  // 192/512: zona segura maskable (icono al 60%).
  await render("icon-192.png", 192, Math.round(192 * 0.6));
  await render("icon-512.png", 512, Math.round(512 * 0.6));
}

main().catch((err) => {
  console.error("Icon generation failed:", err);
  process.exit(1);
});
