#!/usr/bin/env bash
# Backup cifrado de la base de datos de IronLog.
# Uso: BACKUP_KEY=<clave> BACKUP_DIR=/ruta ./scripts/backup.sh
# En el VPS se ejecuta vía cron a diario, ej:
#   30 3 * * * BACKUP_KEY=$(cat /root/.ironlog-backup-key) BACKUP_DIR=/var/backups/ironlog /root/IronLog/scripts/backup.sh
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/ironlog}"
KEEP_DAYS="${KEEP_DAYS:-30}"
STAMP="$(date +%Y%m%d_%H%M%S)"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL no está definida. Carga el .env primero." >&2
  exit 1
fi

if [ -z "${BACKUP_KEY:-}" ]; then
  echo "ERROR: BACKUP_KEY no está definida. Genera una con: openssl rand -base64 32" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
TMP_SQL="$(mktemp)"

echo "[ironlog-backup] Volcando base de datos..."
pg_dump "$DATABASE_URL" --no-owner > "$TMP_SQL"

# Cifrado AES-256-CBC con clave derivada (salt aleatorio incluido en el archivo).
SALT="$(openssl rand -hex 8)"
KEY="$(printf '%s' "$BACKUP_KEY" | openssl dgst -sha256 -binary | xxd -p -c 64)"

OUT="$BACKUP_DIR/ironlog_${STAMP}.sql.enc"
echo "[ironlog-backup] Cifrando -> $OUT"
echo "$SALT" > "$OUT"
openssl enc -aes-256-cbc -pbkdf2 -iter 100000 -pass pass:"$BACKUP_KEY" -S "$SALT" -in "$TMP_SQL" >> "$OUT"

rm -f "$TMP_SQL"

echo "[ironlog-backup] Rotación: eliminando backups de más de $KEEP_DAYS días"
find "$BACKUP_DIR" -name "ironlog_*.sql.enc" -mtime +"$KEEP_DAYS" -delete

echo "[ironlog-backup] OK. Backups actuales:"
ls -lh "$BACKUP_DIR" | tail -5
