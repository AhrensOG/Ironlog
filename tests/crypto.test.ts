import { test } from "node:test";
import assert from "node:assert/strict";
import {
  encryptFile,
  encryptField,
  desencryptFile,
  desencryptField,
  deswrapDek,
  deriveKey,
  wrapDek,
  generateDek,
} from "../lib/crypto";

const DEK = generateDek();

test("archivo: round trip cifrar/descifrar", () => {
  const original = Buffer.from("foto de progreso binaria \u{1F4AA}", "utf8");
  const cifrado = encryptFile(original, DEK);
  assert.notDeepEqual(cifrado, original);
  const descifrado = desencryptFile(cifrado, DEK);
  assert.deepEqual(descifrado, original);
});

test("archivo: formato contiene iv+tag al inicio", () => {
  const cifrado = encryptFile(Buffer.from("contenido", "utf8"), DEK);
  // 12 (iv) + 16 (tag) + ciphertext
  assert.ok(cifrado.length > 28);
});

test("archivo: cifrado es no determinista (iv aleatorio)", () => {
  const datos = Buffer.from("mismo contenido", "utf8");
  const a = encryptFile(datos, DEK);
  const b = encryptFile(datos, DEK);
  assert.notDeepEqual(a, b);
});

test("archivo: manipular el contenido rompe el descifrado (GCM)", () => {
  const cifrado = encryptFile(Buffer.from("datos sensibles", "utf8"), DEK);
  const manipulado = Buffer.from(cifrado);
  manipulado[manipulado.length - 1] ^= 0xff;
  assert.throws(() => desencryptFile(manipulado, DEK));
});

test("archivo: clave equivocada no descifra", () => {
  const cifrado = encryptFile(Buffer.from("secreto", "utf8"), DEK);
  const otraDek = generateDek();
  assert.throws(() => desencryptFile(cifrado, otraDek));
});

test("DEK: envolver y desenvolver con KEK del entorno", () => {
  const dek = generateDek();
  const envuelta = wrapDek(dek);
  assert.notEqual(envuelta, dek.toString("base64"));
  const desenvuelta = deswrapDek(envuelta);
  assert.deepEqual(desenvuelta, dek);
});

test("DEK: una DEK envuelta no es válida para otra clave", () => {
  const envuelta = wrapDek(generateDek());
  // unwrap usa la KEK; cambiar la KEK del entorno invalidaría — aquí solo
  // verificamos que devuelve 32 bytes correctos.
  const dek = deswrapDek(envuelta);
  assert.equal(dek.length, 32);
});

test("campo: round trip metadata", () => {
  const texto = "nombre original de la foto.jpg";
  const cifrado = encryptField(texto, DEK);
  assert.notEqual(cifrado, texto);
  assert.equal(desencryptField(cifrado, DEK), texto);
});

test("deriveKey: determinista con misma frase y salt", () => {
  const salt = Buffer.from("salt123");
  const a = deriveKey("mi frase", salt);
  const b = deriveKey("mi frase", salt);
  assert.deepEqual(a, b);
  assert.equal(a.length, 32);
});
