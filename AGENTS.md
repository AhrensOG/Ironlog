<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reglas de datos del proyecto

- `DATABASE_URL` solo puede apuntar a bases de datos aprobadas explícitamente para IronLog. NUNCA copiar credenciales ni acceder a bases de datos de otros proyectos (p. ej. Solbyt Expense Manager) sin pedir permiso al usuario antes.
- Los secretos (.env) no se muestran ni se copian fuera de este proyecto.

# Convenciones de código

- Identificadores, funciones, tipos, atributos de modelos, claves JSON de API y columnas de la base de datos: SIEMPRE en inglés.
- Textos visibles para el usuario (i18n en messages/*.json), cabeceras de CSV, URLs y contenido educativo: en español.
- No mezclar idiomas en el código. El test `tests/i18n.test.ts` audita las claves i18n; mantenerlo verde.
