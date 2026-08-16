import type { WeightType } from "../lib/models/RoutineExercise";

export interface CatalogSeed {
  name: string;
  group: string;
  pattern: string;
  weightType: WeightType;
  description: string;
}

export const catalogoExercises: CatalogSeed[] = [
  // ── Espalda ──
  { name: "Remo con barra", group: "Espalda", pattern: "Tiro horizontal", weightType: "total", description: "Torso inclinado ~45°, tirar la barra al ombligo." },
  { name: "Remo Pendlay", group: "Espalda", pattern: "Tiro horizontal", weightType: "total", description: "Cada rep desde el suelo, torso paralelo, explosivo." },
  { name: "Remo con mancuerna a una mano", group: "Espalda", pattern: "Tiro horizontal", weightType: "total", description: "Apoyado en banco, tirar hacia la cadera." },
  { name: "Remo en polea baja sentado", group: "Espalda", pattern: "Tiro horizontal", weightType: "total", description: "Agarre neutro, tirar al ombligo con control." },
  { name: "Remo en máquina Hammer", group: "Espalda", pattern: "Tiro horizontal", weightType: "total", description: "Torso pegado al respaldo, tirar hacia el abdomen." },
  { name: "Jalón al pecho", group: "Espalda", pattern: "Tiro vertical", weightType: "total", description: "Barra al pecho con pecho afuera." },
  { name: "Jalón agarre neutro (triángulo)", group: "Espalda", pattern: "Tiro vertical", weightType: "total", description: "Agarre neutro, codos al costado." },
  { name: "Dominadas", group: "Espalda", pattern: "Tiro vertical", weightType: "total", description: "Peso corporal, mentón sobre la barra." },
  { name: "Dominadas con lastre", group: "Espalda", pattern: "Tiro vertical", weightType: "total", description: "Con cinturón de lastre, rango completo." },
  { name: "Pull-over en polea", group: "Espalda", pattern: "Tiro vertical", weightType: "total", description: "Brazos extendidos, arco amplio hacia las caderas." },

  // ── Pecho ──
  { name: "Press banca con barra", group: "Pecho", pattern: "Empuje horizontal", weightType: "total", description: "Bajar controlado al pecho, empujar explosivo." },
  { name: "Press banca con mancuernas", group: "Pecho", pattern: "Empuje horizontal", weightType: "porLado", description: "Más recorrido y estabilización que con barra." },
  { name: "Press inclinado con barra", group: "Pecho", pattern: "Empuje inclinado", weightType: "total", description: "Banco a 30-45°, énfasis en pecho superior." },
  { name: "Press inclinado con mancuernas", group: "Pecho", pattern: "Empuje inclinado", weightType: "porLado", description: "Variante con mayor rango de movimiento." },
  { name: "Press inclinado en Smith", group: "Pecho", pattern: "Empuje inclinado", weightType: "barraDiscos", description: "Trayectoria guiada, ideal cerca del fallo." },
  { name: "Aperturas planas con mancuernas", group: "Pecho", pattern: "Apertura", weightType: "porLado", description: "Estiramiento profundo, codos semi-flexionados." },
  { name: "Aperturas en polea", group: "Pecho", pattern: "Apertura", weightType: "total", description: "Tensión constante en todo el recorrido." },
  { name: "Pec Deck / Contractora", group: "Pecho", pattern: "Apertura", weightType: "total", description: "Máquina de apertura, apretar en el centro." },
  { name: "Fondos en paralelas", group: "Pecho", pattern: "Empuje horizontal", weightType: "total", description: "Torso inclinado hacia adelante para pecho." },
  { name: "Flexiones con lastre", group: "Pecho", pattern: "Empuje horizontal", weightType: "total", description: "Con disco en la espalda, core firme." },

  // ── Hombro ──
  { name: "Press militar con barra", group: "Hombro", pattern: "Empuje vertical", weightType: "total", description: "De pie o sentado, barra a la clavícula." },
  { name: "Press militar con mancuernas", group: "Hombro", pattern: "Empuje vertical", weightType: "porLado", description: "Mayor recorrido y menos tensión en hombro." },
  { name: "Press Arnold", group: "Hombro", pattern: "Empuje vertical", weightType: "porLado", description: "Rotación desde neutro a prono durante el empuje." },
  { name: "Elevaciones laterales", group: "Hombro", pattern: "Hombro lateral", weightType: "porLado", description: "Subir hasta la línea del hombro, codos suaves." },
  { name: "Elevaciones laterales en polea", group: "Hombro", pattern: "Hombro lateral", weightType: "total", description: "Tensión constante, ideal para rango final." },
  { name: "Face pull", group: "Hombro", pattern: "Hombro posterior", weightType: "total", description: "Cuerda hacia la cara, rotación externa al final." },
  { name: "Pájaros con mancuernas", group: "Hombro", pattern: "Hombro posterior", weightType: "porLado", description: "Torso inclinado, abrir brazos sin balanceo." },
  { name: "Pájaros en máquina", group: "Hombro", pattern: "Hombro posterior", weightType: "total", description: "Dorsal pegado al respaldo, abrir hacia atrás." },

  // ── Bíceps ──
  { name: "Curl con barra recta", group: "Bíceps", pattern: "Aislamiento bíceps", weightType: "total", description: "Codos fijos al costado, sin balanceo." },
  { name: "Curl con barra Z", group: "Bíceps", pattern: "Aislamiento bíceps", weightType: "total", description: "Más cómodo para muñecas que la recta." },
  { name: "Curl con mancuernas", group: "Bíceps", pattern: "Aislamiento bíceps", weightType: "porLado", description: "Con supinación al subir, un brazo a la vez." },
  { name: "Curl martillo", group: "Bíceps", pattern: "Aislamiento bíceps", weightType: "porLado", description: "Agarre neutro, énfasis en braquial y antebrazo." },
  { name: "Curl predicador", group: "Bíceps", pattern: "Aislamiento bíceps", weightType: "total", description: "Brazos apoyados, máxima tensión en la parte baja." },
  { name: "Curl en polea", group: "Bíceps", pattern: "Aislamiento bíceps", weightType: "total", description: "Tensión constante, ideal para series al fallo." },

  // ── Tríceps ──
  { name: "Extensión de tríceps en polea", group: "Tríceps", pattern: "Aislamiento tríceps", weightType: "total", description: "Codos pegados, extender hasta bloquear." },
  { name: "Extensión en polea con cuerda", group: "Tríceps", pattern: "Aislamiento tríceps", weightType: "total", description: "Abrir la cuerda al final del recorrido." },
  { name: "Press francés con barra Z", group: "Tríceps", pattern: "Aislamiento tríceps", weightType: "total", description: "Bajar la barra a la frente con codos cerrados." },
  { name: "Press francés con mancuerna", group: "Tríceps", pattern: "Aislamiento tríceps", weightType: "total", description: "Una mancuerna a dos manos, o una por lado." },
  { name: "Fondos con lastre", group: "Tríceps", pattern: "Aislamiento tríceps", weightType: "total", description: "Torso vertical, codos hacia atrás." },
  { name: "Extensión sobre cabeza con mancuerna", group: "Tríceps", pattern: "Aislamiento tríceps", weightType: "total", description: "Cabeza larga del tríceps en estiramiento." },

  // ── Cuádriceps ──
  { name: "Sentadilla con barra", group: "Cuádriceps", pattern: "Rodilla dominante", weightType: "total", description: "Barra en espalda alta, bajar a paralelo o más." },
  { name: "Sentadilla en Smith", group: "Cuádriceps", pattern: "Rodilla dominante", weightType: "barraDiscos", description: "Trayectoria guiada, pies algo adelantados." },
  { name: "Prensa de piernas", group: "Cuádriceps", pattern: "Rodilla dominante", weightType: "total", description: "Pies al centro, bajar sin despegar glúteos." },
  { name: "Sentadilla hack", group: "Cuádriceps", pattern: "Rodilla dominante", weightType: "total", description: "Espalda al respaldo, rango profundo." },
  { name: "Extensión de cuádriceps", group: "Cuádriceps", pattern: "Rodilla dominante", weightType: "total", description: "Apretar arriba 1 segundo, bajar controlado." },
  { name: "Sentadilla búlgara", group: "Cuádriceps", pattern: "Rodilla dominante", weightType: "porLado", description: "Pie trasero elevado, una pierna a la vez." },

  // ── Glúteo / Isquiotibiales ──
  { name: "Peso muerto rumano", group: "Glúteo / Isquiotibiales", pattern: "Bisagra de cadera", weightType: "total", description: "Cadera atrás, barra pegada a las piernas." },
  { name: "Peso muerto convencional", group: "Glúteo / Isquiotibiales", pattern: "Bisagra de cadera", weightType: "total", description: "Desde el suelo, espalda neutra." },
  { name: "Hip Thrust con barra", group: "Glúteo / Isquiotibiales", pattern: "Bisagra de cadera", weightType: "total", description: "Espalda alta en banco, apretar glúteo arriba." },
  { name: "Hip Thrust en polea", group: "Glúteo / Isquiotibiales", pattern: "Bisagra de cadera", weightType: "total", description: "Variante con tensión constante." },
  { name: "Curl femoral tumbado", group: "Glúteo / Isquiotibiales", pattern: "Aislamiento femoral", weightType: "total", description: "Talones a glúteos sin levantar caderas." },
  { name: "Curl femoral sentado", group: "Glúteo / Isquiotibiales", pattern: "Aislamiento femoral", weightType: "total", description: "Caderas fijas, rango completo." },
  { name: "Patada de glúteo en polea", group: "Glúteo / Isquiotibiales", pattern: "Aislamiento glúteo", weightType: "total", description: "Extensión de cadera hacia atrás, apretar glúteo." },

  // ── Core ──
  { name: "Plancha abdominal", group: "Core", pattern: "Anti-extensión", weightType: "total", description: "Cuerpo recto, glúteo y abdomen firmes." },
  { name: "Dead bug", group: "Core", pattern: "Anti-extensión", weightType: "total", description: "Espalda baja pegada al suelo, brazos y piernas alternados." },
  { name: "Pallof press", group: "Core", pattern: "Anti-rotación", weightType: "total", description: "Resistir la rotación empujando la polea al frente." },
  { name: "Crunch en polea", group: "Core", pattern: "Flexión de tronco", weightType: "total", description: "Enrollar el tronco con la cuerda tras la nuca." },
  { name: "Rueda abdominal", group: "Core", pattern: "Anti-extensión", weightType: "total", description: "Deslizar hacia adelante sin arquear la lumbar." },

  // ── Trapecio ──
  { name: "Encogimientos con mancuernas", group: "Trapecio", pattern: "Elevación escapular", weightType: "porLado", description: "Subir hombros a las orejas, pausa arriba." },
  { name: "Encogimientos con barra", group: "Trapecio", pattern: "Elevación escapular", weightType: "total", description: "Agarre a lo ancho, rango completo." },

  // ── Gemelos ──
  { name: "Elevación de gemelos de pie", group: "Gemelos", pattern: "Flexión plantar", weightType: "total", description: "Pausa arriba y abajo, rango completo." },
  { name: "Elevación de gemelos sentado", group: "Gemelos", pattern: "Flexión plantar", weightType: "total", description: "Énfasis en sóleo, rodilla flexionada." },
];
