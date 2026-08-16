import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

/**
 * Cifrado en reposo para archivos sensibles (fotos de progreso, fase 2).
 *
 * Envelope encryption:
 * - KEK (clave maestra): FILE_ENCRYPTION_KEY del entorno (base64).
 * - DEK (clave de datos): generada aleatoriamente por usuario y guardada
 *   envuelta (cifrada con la KEK) en la base de datos.
 * - Los archivos se cifran con la DEK usando AES-256-GCM (autenticado).
 *
 * Nunca se sirven URLs públicas: el acceso pasa por la API autenticada.
 */

const ALGORITMO = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getKek(): Buffer {
  const encoded = process.env.FILE_ENCRYPTION_KEY;
  if (!encoded) {
    throw new Error(
      "FILE_ENCRYPTION_KEY no está configurada. Genera una con: openssl rand -base64 32",
    );
  }
  const key = Buffer.from(encoded, "base64");
  if (key.length !== KEY_LENGTH) {
    throw new Error("FILE_ENCRYPTION_KEY debe ser de 32 bytes (base64)");
  }
  return key;
}

export interface EncryptedPackage {
  iv: Buffer;
  tag: Buffer;
  ciphertext: Buffer;
}

export function encryptData(plaintext: Buffer, key: Buffer): EncryptedPackage {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITMO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return { iv, tag: cipher.getAuthTag(), ciphertext };
}

export function desencryptData(
  paquete: EncryptedPackage,
  key: Buffer,
): Buffer {
  const decipher = createDecipheriv(ALGORITMO, key, paquete.iv);
  decipher.setAuthTag(paquete.tag);
  return Buffer.concat([
    decipher.update(paquete.ciphertext),
    decipher.final(),
  ]);
}

/** Formato de archivo cifrado: iv (12) + tag (16) + ciphertext. */
export function encryptFile(plaintext: Buffer, dek: Buffer): Buffer {
  const { iv, tag, ciphertext } = encryptData(plaintext, dek);
  return Buffer.concat([iv, tag, ciphertext]);
}

export function desencryptFile(archivo: Buffer, dek: Buffer): Buffer {
  const iv = archivo.subarray(0, IV_LENGTH);
  const tag = archivo.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = archivo.subarray(IV_LENGTH + TAG_LENGTH);
  return desencryptData({ iv, tag, ciphertext }, dek);
}

/** Genera una DEK aleatoria (32 bytes) para un usuario. */
export function generateDek(): Buffer {
  return randomBytes(KEY_LENGTH);
}

/** Envuelve la DEK con la KEK para guardarla en la DB. */
export function wrapDek(dek: Buffer): string {
  const kek = getKek();
  const { iv, tag, ciphertext } = encryptData(dek, kek);
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

/** Desenvuelve la DEK guardada usando la KEK. */
export function deswrapDek(envuelta: string): Buffer {
  const kek = getKek();
  const raw = Buffer.from(envuelta, "base64");
  const iv = raw.subarray(0, IV_LENGTH);
  const tag = raw.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = raw.subarray(IV_LENGTH + TAG_LENGTH);
  return desencryptData({ iv, tag, ciphertext }, kek);
}

/** Cifra un campo de metadata (texto) con la DEK. Devuelve base64. */
export function encryptField(texto: string, dek: Buffer): string {
  const { iv, tag, ciphertext } = encryptData(Buffer.from(texto, "utf8"), dek);
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

/** Descifra un campo de metadata cifrado con la DEK. */
export function desencryptField(campo: string, dek: Buffer): string {
  const raw = Buffer.from(campo, "base64");
  const iv = raw.subarray(0, IV_LENGTH);
  const tag = raw.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = raw.subarray(IV_LENGTH + TAG_LENGTH);
  return desencryptData({ iv, tag, ciphertext }, dek).toString("utf8");
}

/** Deriva una clave de 32 bytes desde una frase (para uso futuro, ej. E2E). */
export function deriveKey(frase: string, salt: Buffer): Buffer {
  return scryptSync(frase, salt, KEY_LENGTH);
}
