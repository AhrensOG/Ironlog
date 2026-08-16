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
npm test             # motor de progresión + cifrado + fechas + i18n
```

## Datos de ejemplo

- `scripts/ejemplo_rutina.csv`: rutina genérica con datos ficticios para
  probar el import desde /rutina
- Al registrarte se crea automáticamente tu metodología por defecto
  ("Evidencia 6+1")

## Despliegue (VPS)

```bash
# En el VPS (una vez):
mkdir -p /var/lib/ironlog/storage /var/backups/ironlog
git clone <repo> /root/IronLog && cd /root/IronLog
npm install && npm run build
pm2 start npm --name IronLog -- start
# .env en /root/IronLog con DATABASE_URL (Postgres del VPS), AUTH_SECRET,
# FILE_ENCRYPTION_KEY, STORAGE_PATH=/var/lib/ironlog/storage

# Backups cifrados diarios (cron):
# 30 3 * * * cd /root/IronLog && set -a && . ./.env && set +a && BACKUP_KEY=<clave> ./scripts/backup.sh
```

El workflow `.github/workflows/main.yml` despliega automáticamente en cada
push a `main` (secrets: VPS_HOST, VPS_USER, VPS_SSH_KEY, VPS_PORT).

## Seguridad

- Fotos de progreso (fase 2): cifrado en reposo AES-256-GCM con envelope
  encryption (KEK en entorno + DEK por usuario), fuera del webroot, acceso
  solo vía API autenticada. Módulo listo en `lib/crypto.ts`.
- Backups de base de datos cifrados con AES-256 (`scripts/backup.sh`).
