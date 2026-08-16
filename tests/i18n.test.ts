import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = process.cwd();

function flatten(d: Record<string, unknown>, prefix = ""): Set<string> {
  const out = new Set<string>();
  for (const [k, v] of Object.entries(d)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null) {
      for (const sub of flatten(v as Record<string, unknown>, key)) out.add(sub);
    } else {
      out.add(key);
    }
  }
  return out;
}

/** Prefijos de claves construidas dinámicamente en runtime (ej. nivel_xxx). */
const PREFIJOS_DINAMICOS = ["nivel_", "estado_", "acc"];

function listarTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listarTsx(path));
    else if (entry.name.endsWith(".tsx")) out.push(path);
  }
  return out;
}

const msgs = JSON.parse(
  readFileSync(resolve(ROOT, "messages", "es.json"), "utf-8"),
) as Record<string, unknown>;
const defined = flatten(msgs);

test("i18n: toda clave t() usada en componentes existe en messages/es.json", () => {
  const faltantes: string[] = [];

  for (const file of listarTsx(resolve(ROOT, "components"))) {
    const src = readFileSync(file, "utf-8");
    const namespaces = new Set(
      [...src.matchAll(/useTranslations\(["']([^"']+)["']\)/g)].map((m) => m[1]),
    );
    for (const ns of namespaces) {
      if (!(ns in msgs)) {
        faltantes.push(`${file}: namespace "${ns}" no existe`);
        continue;
      }
      for (const m of src.matchAll(/\bt\(["']([^"']+)["']/g)) {
        const key = m[1];
        const full = `${ns}.${key}`;
        if (!defined.has(full) && !PREFIJOS_DINAMICOS.some((p) => key.startsWith(p))) {
          faltantes.push(`${file}: falta ${full}`);
        }
      }
    }
  }

  assert.deepEqual(
    faltantes,
    [],
    `Claves i18n faltantes (${faltantes.length}):\n${faltantes.join("\n")}`,
  );
});

test("i18n: los placeholders de cada mensaje coinciden con las variables pasadas", () => {
  const problemas: string[] = [];

  for (const file of listarTsx(resolve(ROOT, "components"))) {
    const src = readFileSync(file, "utf-8");
    const nsMatch = [...src.matchAll(/useTranslations\(["']([^"']+)["']\)/g)];
    const namespaces = new Set(nsMatch.map((m) => m[1]));

    for (const ns of namespaces) {
      // Busca llamadas t("clave", { vars }) en el archivo.
      const regex = /\bt\(["']([^"']+)["']\s*,\s*\{([\s\S]*?)\}/g;
      for (const m of src.matchAll(regex)) {
        const key = m[1];
        const argsBody = m[2];
        const full = `${ns}.${key}`;
        if (PREFIJOS_DINAMICOS.some((p) => key.startsWith(p))) continue;
        if (!defined.has(full)) continue; // ya lo cubre el test anterior

        const mensaje = String(
          (msgs[ns] as Record<string, unknown> | undefined)?.[key] ?? "",
        );
        if (!mensaje) {
          problemas.push(`${file}: ${full} no es un texto`);
          continue;
        }

        // Variables pasadas en el objeto (shorthand o key: value).
        const pasadas = new Set<string>();
        for (const part of argsBody.split(",")) {
          const trimmed = part.trim();
          if (!trimmed) continue;
          const [varName] = trimmed.split(":")[0].trim().split(/\s+/);
          if (varName) pasadas.add(varName);
        }

        // Placeholders presentes en el mensaje.
        const esperadas = new Set(
          [...mensaje.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map((x) => x[1]),
        );

        const faltanEnMensaje = [...pasadas].filter((v) => !esperadas.has(v));
        const sobranEnMensaje = [...esperadas].filter((v) => !pasadas.has(v));

        if (faltanEnMensaje.length > 0 || sobranEnMensaje.length > 0) {
          problemas.push(
            `${file}: ${full} — pasadas: [${[...pasadas].join(", ")}] vs placeholders: [${[...esperadas].join(", ")}]`,
          );
        }
      }
    }
  }

  assert.deepEqual(
    problemas,
    [],
    `Placeholders i18n desalineados (${problemas.length}):\n${problemas.join("\n")}`,
  );
});
