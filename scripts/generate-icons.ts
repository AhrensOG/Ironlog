import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "public", "icons");
const SPLASH_DIR = join(process.cwd(), "public", "splash");

// Línea de tendencia del icono TrendingUp de lucide-react (viewBox 24).
const TRENDING_UP_PATHS = [
  "m22 7-8.5 8.5-5-5L2 17",
];

const BG = "#ea580c";
const STROKE = "#ffffff";

// Splash: pantalla completa, icono centrado. Variantes light/dark.
const SPLASH_VARIANTS = {
  light: { bg: "#fff7ed", stroke: "#ea580c" },
  dark: { bg: "#0c0a09", stroke: "#f97316" },
} as const;

// Tamaños físicos (px) por modelo iOS/iPad, retrato.
const SPLASH_SIZES: Array<{ w: number; h: number }> = [
  { w: 750, h: 1334 }, // iPhone SE / 8
  { w: 828, h: 1792 }, // iPhone 11 / XR
  { w: 1080, h: 2340 }, // iPhone 12/13 mini
  { w: 1125, h: 2436 }, // iPhone X / XS / 11 Pro
  { w: 1170, h: 2532 }, // iPhone 12 / 13 / 14
  { w: 1179, h: 2556 }, // iPhone 14 Pro / 15 / 16
  { w: 1290, h: 2796 }, // iPhone 14/15/16 Pro Max
  { w: 1536, h: 2048 }, // iPad
  { w: 2048, h: 2732 }, // iPad Pro 12.9
];

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

function splashSvg(width: number, height: number, variant: "light" | "dark"): string {
  const { bg, stroke } = SPLASH_VARIANTS[variant];
  // Icono al 38% del ancho (los splashes retrato son altos; el ancho manda).
  const iconSize = Math.round(width * 0.38);
  const pad = Math.round(iconSize * 0.245);
  const inner = iconSize - pad * 2;
  const scale = inner / 24;
  const x = (width - iconSize) / 2;
  const y = Math.round((height - iconSize) / 2.6);
  const paths = TRENDING_UP_PATHS.map((d) => `<path d="${d}"/>`).join("");
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bg}"/>
  <g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
</svg>`;
}

async function renderSplashes() {
  await mkdir(SPLASH_DIR, { recursive: true });
  for (const variant of ["light", "dark"] as const) {
    for (const { w, h } of SPLASH_SIZES) {
      await sharp(Buffer.from(splashSvg(w, h, variant)))
        .png()
        .toFile(join(SPLASH_DIR, `splash-${w}x${h}-${variant}.png`));
      console.log(`Generated splash-${w}x${h}-${variant}.png`);
    }
  }
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
  await renderSplashes();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
