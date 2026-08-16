# IronLog

Registra tu entrenamiento y progresa con evidencia científica.

App web (Next.js 16 + PostgreSQL + Sequelize) para registrar sesiones de
gimnasio con progresión autorregulada: doble progresión con saltos reales de
equipo, bloques 6+1 con RIR periodizado, descarga y test AMRAP, auditoría de
volumen MEV/MAV/MRV, plantillas de rutina y apartado educativo.

## Desarrollo

```bash
npm install
# Configura .env (ver .env.example)
npm run db:seed      # crea schema + seeds (grupos, contenido, plantillas)
npm run dev          # http://localhost:3000
```

## Verificación

```bash
npm run lint
npm run typecheck
npm test             # motor de progresión + fechas + i18n
```

## Datos de ejemplo

- `scripts/ejemplo_rutina.csv`: rutina genérica con datos ficticios para
  probar el import desde /rutina
- Al registrarte se crea automáticamente tu metodología por defecto
  ("Evidencia 6+1")

## Despliegue (VPS)

```bash
# En el VPS (una vez):
git clone <repo> /root/IronLog && cd /root/IronLog
npm install && npm run build
pm2 start npm --name IronLog -- start
# .env en /root/IronLog con DATABASE_URL (Postgres del VPS) y AUTH_SECRET
```

El workflow `.github/workflows/main.yml` despliega automáticamente en cada
push a `main` (secrets: VPS_HOST, VPS_USER, VPS_SSH_KEY, VPS_PORT).

## Seguridad

- Contraseñas con hash bcrypt y sesiones JWT firmadas (AUTH_SECRET)
- Toda la comunicación vía HTTPS en producción
- Sin archivos sensibles en la base de datos ni en el repositorio
