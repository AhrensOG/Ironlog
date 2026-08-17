import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "public", "icons");

// Línea de tendencia del icono TrendingUp de lucide-react (viewBox 24).
const TRENDING_UP_PATHS = [
  "m22 7-8.5 8.5-5-5L2 17",
];

const BG = "#ea580c";
const STROKE = "#ffffff";

function iconSvg(size: number, { rounded }: { rounded: boolean }): string {
  const pad = Math.round(size * 0.245);
  const inner = size - pad * 2;
  const scale = inner / 24;
  const radius = rounded ? Math.round(size * 0.223) : 0;
  const paths = TRENDING_UP_PATHS.map((d) => `<path d="${d}"/>`).join("");
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${BG}"/>
  <g transform="translate(${pad} ${pad}) scale(${scale})" fill="none" stroke="${STROKE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
</svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  // iOS: esquinas rectas, el sistema las redondea.
  await sharp(Buffer.from(iconSvg(180, { rounded: false })))
    .png()
    .toFile(join(OUT_DIR, "apple-touch-icon.png"));
  // Android/Chrome: esquinas redondeadas + zona segura maskable.
  await sharp(Buffer.from(iconSvg(192, { rounded: true })))
    .png()
    .toFile(join(OUT_DIR, "icon-192.png"));
  await sharp(Buffer.from(iconSvg(512, { rounded: true })))
    .png()
    .toFile(join(OUT_DIR, "icon-512.png"));
  console.log(
    "Icons generated: apple-touch-icon.png (180), icon-192.png, icon-512.png",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
