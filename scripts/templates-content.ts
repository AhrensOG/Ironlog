import type {
  TemplateLevel,
  TemplateContent,
} from "../lib/models/RoutineTemplate";

export interface TemplateSeed {
  name: string;
  description: string;
  level: TemplateLevel;
  tags: string[];
  articles: string[];
  content: TemplateContent;
}

const metodologia = (name: string, rirPerWeek: number[] = [3, 3, 2, 2, 1, 1]) => ({ name,
  blockLength: 6,
  rirPerWeek,
  deloadVolumePct: 0.6,
  failureRules: { semanasFalloSeguidas: 2, ajustePct: -5 },
  progressionStyle: "doble" as const,
});

export const templateSeeds: TemplateSeed[] = [
  {
    name: "Evidencia 6+1",
    description:
      "Split de 5 días (tracción / empuje / piernas / empuje accesorio / tracción accesorio) con frecuencia 2x por grupo muscular, volumen calibrado contra rangos MEV/MAV/MRV y RIR periodizado (3→1 en 6 semanas) con semana 7 de descarga y test AMRAP. La plantilla insignia de IronLog.",
    level: "intermedio",
    tags: ["split-5-dias", "hipertrofia", "rir", "frecuencia-2x"],
    articles: [
      "que-es-la-hipertrofia",
      "que-es-el-rir-y-como-usarlo",
      "volumen-mev-mav-mrv",
      "descarga-y-test",
    ],
    content: {
      methodConfig: metodologia("Evidencia 6+1"),
      exercises: [
        { weekday: 1, name: "Dominadas con lastre", order: 1, sets: 4, minReps: 8, maxReps: 8, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 1, name: "Remo en barra", order: 2, sets: 4, minReps: 8, maxReps: 8, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 1, name: "Jalón supino triángulo", order: 3, sets: 3, minReps: 10, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 1, name: "Curl con barra recta", order: 4, sets: 3, minReps: 10, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 15, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Bíceps" },
        { weekday: 1, name: "Face pull", order: 5, sets: 3, minReps: 15, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 10, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 2, name: "Press banca", order: 1, sets: 4, minReps: 8, maxReps: 8, weightType: "total", fixedBar: null, currentLoad: 50, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Pecho" },
        { weekday: 2, name: "Press militar con mancuernas", order: 2, sets: 4, minReps: 8, maxReps: 8, weightType: "porLado", fixedBar: null, currentLoad: 14, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 2, name: "Fondos con lastre", order: 3, sets: 3, minReps: 8, maxReps: 8, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Tríceps" },
        { weekday: 2, name: "Extensión en polea (tríceps)", order: 4, sets: 3, minReps: 12, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 15, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Tríceps" },
        { weekday: 2, name: "Elevaciones laterales", order: 5, sets: 3, minReps: 12, maxReps: 12, weightType: "porLado", fixedBar: null, currentLoad: 6, equipmentIncrement: 1, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 3, name: "Sentadilla Smith", order: 1, sets: 3, minReps: 8, maxReps: 8, weightType: "barraDiscos", fixedBar: 20, currentLoad: 20, equipmentIncrement: 1.25, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 3, name: "Hip Thrust (polea)", order: 2, sets: 4, minReps: 8, maxReps: 8, weightType: "total", fixedBar: null, currentLoad: 50, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Glúteo / Isquiotibiales" },
        { weekday: 3, name: "Prensa", order: 3, sets: 4, minReps: 8, maxReps: 8, weightType: "total", fixedBar: null, currentLoad: 100, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 3, name: "Extensión de cuádriceps", order: 4, sets: 3, minReps: 12, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 30, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 3, name: "Curl femoral", order: 5, sets: 3, minReps: 12, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 25, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Glúteo / Isquiotibiales" },
        { weekday: 4, name: "Aperturas planas con mancuernas", order: 1, sets: 3, minReps: 12, maxReps: 12, weightType: "porLado", fixedBar: null, currentLoad: 10, equipmentIncrement: 2, baseRir: 3, muscleGroup: "Pecho" },
        { weekday: 4, name: "Press inclinado Smith", order: 2, sets: 3, minReps: 10, maxReps: 10, weightType: "barraDiscos", fixedBar: 20, currentLoad: 12, equipmentIncrement: 1.25, baseRir: 3, muscleGroup: "Pecho" },
        { weekday: 4, name: "Elevaciones laterales (2ª sesión)", order: 3, sets: 3, minReps: 12, maxReps: 12, weightType: "porLado", fixedBar: null, currentLoad: 8, equipmentIncrement: 1, baseRir: 3, muscleGroup: "Hombro" },
        { weekday: 4, name: "Pec Deck / Contractora", order: 4, sets: 3, minReps: 12, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 25, equipmentIncrement: 2, baseRir: 3, muscleGroup: "Pecho" },
        { weekday: 4, name: "Press francés con mancuerna", order: 5, sets: 3, minReps: 12, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 8, equipmentIncrement: 1, baseRir: 3, muscleGroup: "Tríceps" },
        { weekday: 5, name: "Jalón supino triángulo (2ª sesión)", order: 1, sets: 3, minReps: 10, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 5, baseRir: 3, muscleGroup: "Espalda" },
        { weekday: 5, name: "Curl martillo", order: 2, sets: 4, minReps: 12, maxReps: 12, weightType: "porLado", fixedBar: null, currentLoad: 10, equipmentIncrement: 2, baseRir: 3, muscleGroup: "Bíceps" },
        { weekday: 5, name: "Remo polea baja agarre ancho", order: 3, sets: 3, minReps: 12, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 35, equipmentIncrement: 2.5, baseRir: 3, muscleGroup: "Espalda" },
        { weekday: 5, name: "Encogimientos / Shrugs", order: 4, sets: 3, minReps: 12, maxReps: 15, weightType: "porLado", fixedBar: null, currentLoad: 18, equipmentIncrement: 2, baseRir: 3, muscleGroup: "Trapecio" },
        { weekday: 5, name: "Core (plancha, dead bug, pallof)", order: 5, sets: 3, minReps: 10, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 0, baseRir: 3, muscleGroup: "Core" },
      ],
    },
  },
  {
    name: "Full Body 3 días",
    description:
      "Rutina de cuerpo completo para principiantes: 3 sessions por semana (mondayExercises, miércoles, viernes) con los movimientos básicos y doble progresión. Aprende la técnica de los ejercicios principales mientras cada músculo recibe estímulo frecuente. Ideal para tu primer año de gimnasio.",
    level: "principiante",
    tags: ["full-body", "principiante", "3-dias", "doble-progresion"],
    articles: [
      "que-es-la-hipertrofia",
      "sobrecarga-progresiva-motor",
      "doble-progresion-cuando-el-equipo-no-deja",
    ],
    content: {
      methodConfig: metodologia("Full Body 3 días"),
      exercises: [
        { weekday: 1, name: "Sentadilla con barra", order: 1, sets: 3, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 1, name: "Press banca", order: 2, sets: 3, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Pecho" },
        { weekday: 1, name: "Remo con barra", order: 3, sets: 3, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 35, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 1, name: "Press militar", order: 4, sets: 3, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 25, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 1, name: "Curl de bíceps con barra", order: 5, sets: 2, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 15, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Bíceps" },
        { weekday: 1, name: "Dead bug", order: 6, sets: 3, minReps: 10, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 0, baseRir: 3, muscleGroup: "Core" },
        { weekday: 3, name: "Peso muerto rumano", order: 1, sets: 3, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Glúteo / Isquiotibiales" },
        { weekday: 3, name: "Press inclinado con mancuernas", order: 2, sets: 3, minReps: 8, maxReps: 12, weightType: "porLado", fixedBar: null, currentLoad: 12, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Pecho" },
        { weekday: 3, name: "Jalón al pecho", order: 3, sets: 3, minReps: 8, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 3, name: "Elevaciones laterales", order: 4, sets: 3, minReps: 12, maxReps: 15, weightType: "porLado", fixedBar: null, currentLoad: 6, equipmentIncrement: 1, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 3, name: "Curl femoral", order: 5, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 25, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Glúteo / Isquiotibiales" },
        { weekday: 3, name: "Extensión de tríceps en polea", order: 6, sets: 2, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 15, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Tríceps" },
        { weekday: 5, name: "Prensa de piernas", order: 1, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 80, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 5, name: "Dominadas o jalón agarre neutro", order: 2, sets: 3, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 5, name: "Press militar sentado", order: 3, sets: 3, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 25, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 5, name: "Remo en polea baja", order: 4, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 35, equipmentIncrement: 5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 5, name: "Curl martillo", order: 5, sets: 2, minReps: 10, maxReps: 12, weightType: "porLado", fixedBar: null, currentLoad: 8, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Bíceps" },
        { weekday: 5, name: "Pallof press", order: 6, sets: 3, minReps: 10, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 0, baseRir: 3, muscleGroup: "Core" },
      ],
    },
  },
  {
    name: "Upper / Lower 4 días",
    description:
      "Split de torso y pierna 4 días por semana (2 upper, 2 lower) con frecuencia 2x por grupo muscular. Equilibra fuerza e hipertrofia con días de rangos bajos (6-8) y días de rangos medios (8-12). La opción intermedia más popular entre 3 y 5 días.",
    level: "intermedio",
    tags: ["upper-lower", "4-dias", "frecuencia-2x", "hipertrofia"],
    articles: [
      "frecuencia-2x-semana",
      "doble-progresion-cuando-el-equipo-no-deja",
      "volumen-mev-mav-mrv",
    ],
    content: {
      methodConfig: metodologia("Upper / Lower 4 días"),
      exercises: [
        { weekday: 1, name: "Press banca", order: 1, sets: 4, minReps: 6, maxReps: 8, weightType: "total", fixedBar: null, currentLoad: 50, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Pecho" },
        { weekday: 1, name: "Remo en barra", order: 2, sets: 4, minReps: 6, maxReps: 8, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 1, name: "Press militar", order: 3, sets: 3, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 30, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 1, name: "Jalón al pecho", order: 4, sets: 3, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 1, name: "Curl con barra recta", order: 5, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 15, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Bíceps" },
        { weekday: 1, name: "Extensión de tríceps en polea", order: 6, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 15, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Tríceps" },
        { weekday: 2, name: "Sentadilla con barra", order: 1, sets: 4, minReps: 6, maxReps: 8, weightType: "total", fixedBar: null, currentLoad: 50, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 2, name: "Peso muerto rumano", order: 2, sets: 4, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Glúteo / Isquiotibiales" },
        { weekday: 2, name: "Prensa de piernas", order: 3, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 80, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 2, name: "Curl femoral", order: 4, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 25, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Glúteo / Isquiotibiales" },
        { weekday: 2, name: "Elevación de gemelos", order: 5, sets: 3, minReps: 12, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 30, equipmentIncrement: 5, baseRir: 2, muscleGroup: "Gemelos" },
        { weekday: 2, name: "Plancha abdominal", order: 6, sets: 3, minReps: 10, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 0, baseRir: 3, muscleGroup: "Core" },
        { weekday: 4, name: "Press inclinado con mancuernas", order: 1, sets: 4, minReps: 8, maxReps: 10, weightType: "porLado", fixedBar: null, currentLoad: 14, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Pecho" },
        { weekday: 4, name: "Dominadas con lastre", order: 2, sets: 4, minReps: 6, maxReps: 8, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 4, name: "Elevaciones laterales", order: 3, sets: 3, minReps: 12, maxReps: 15, weightType: "porLado", fixedBar: null, currentLoad: 8, equipmentIncrement: 1, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 4, name: "Remo en polea baja", order: 4, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 35, equipmentIncrement: 5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 4, name: "Curl martillo", order: 5, sets: 3, minReps: 10, maxReps: 12, weightType: "porLado", fixedBar: null, currentLoad: 8, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Bíceps" },
        { weekday: 4, name: "Press francés con mancuerna", order: 6, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 8, equipmentIncrement: 1, baseRir: 2, muscleGroup: "Tríceps" },
        { weekday: 5, name: "Hip Thrust", order: 1, sets: 4, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 50, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Glúteo / Isquiotibiales" },
        { weekday: 5, name: "Sentadilla goblet", order: 2, sets: 3, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 20, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 5, name: "Extensión de cuádriceps", order: 3, sets: 3, minReps: 12, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 30, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 5, name: "Curl femoral", order: 4, sets: 3, minReps: 12, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 25, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Glúteo / Isquiotibiales" },
        { weekday: 5, name: "Elevación de gemelos", order: 5, sets: 3, minReps: 12, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 30, equipmentIncrement: 5, baseRir: 2, muscleGroup: "Gemelos" },
        { weekday: 5, name: "Dead bug", order: 6, sets: 3, minReps: 10, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 0, baseRir: 3, muscleGroup: "Core" },
      ],
    },
  },
  {
    name: "Push / Pull / Legs",
    description:
      "El split clásico de 3 días (empuje, tracción, pierna) o rotado a 6. Agrupa los movimientos por patrón: empujar, tirar y pierna, con frecuencia por grupo de 1-2x según cuántos días entrenes. Muy escalable y fácil de recordar.",
    level: "intermedio",
    tags: ["ppl", "3-dias", "6-dias", "hipertrofia"],
    articles: [
      "frecuencia-2x-semana",
      "sobrecarga-progresiva-motor",
      "biomecanica-basica",
    ],
    content: {
      methodConfig: metodologia("Push / Pull / Legs"),
      exercises: [
        { weekday: 1, name: "Press banca", order: 1, sets: 4, minReps: 6, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 50, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Pecho" },
        { weekday: 1, name: "Press inclinado con mancuernas", order: 2, sets: 3, minReps: 8, maxReps: 12, weightType: "porLado", fixedBar: null, currentLoad: 14, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Pecho" },
        { weekday: 1, name: "Press militar", order: 3, sets: 3, minReps: 8, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 30, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 1, name: "Elevaciones laterales", order: 4, sets: 3, minReps: 12, maxReps: 15, weightType: "porLado", fixedBar: null, currentLoad: 8, equipmentIncrement: 1, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 1, name: "Extensión de tríceps en polea", order: 5, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 15, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Tríceps" },
        { weekday: 2, name: "Dominadas con lastre", order: 1, sets: 4, minReps: 6, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 2, name: "Remo en barra", order: 2, sets: 4, minReps: 8, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 2, name: "Jalón al pecho", order: 3, sets: 3, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 5, baseRir: 2, muscleGroup: "Espalda" },
        { weekday: 2, name: "Face pull", order: 4, sets: 3, minReps: 12, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 10, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Hombro" },
        { weekday: 2, name: "Curl con barra recta", order: 5, sets: 3, minReps: 8, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 15, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Bíceps" },
        { weekday: 2, name: "Curl martillo", order: 6, sets: 3, minReps: 10, maxReps: 12, weightType: "porLado", fixedBar: null, currentLoad: 8, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Bíceps" },
        { weekday: 3, name: "Sentadilla con barra", order: 1, sets: 4, minReps: 6, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 50, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 3, name: "Prensa de piernas", order: 2, sets: 4, minReps: 10, maxReps: 12, weightType: "total", fixedBar: null, currentLoad: 80, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 3, name: "Peso muerto rumano", order: 3, sets: 4, minReps: 8, maxReps: 10, weightType: "total", fixedBar: null, currentLoad: 40, equipmentIncrement: 2.5, baseRir: 2, muscleGroup: "Glúteo / Isquiotibiales" },
        { weekday: 3, name: "Extensión de cuádriceps", order: 4, sets: 3, minReps: 12, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 30, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Cuádriceps" },
        { weekday: 3, name: "Curl femoral", order: 5, sets: 3, minReps: 12, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 25, equipmentIncrement: 2, baseRir: 2, muscleGroup: "Glúteo / Isquiotibiales" },
        { weekday: 3, name: "Elevación de gemelos", order: 6, sets: 4, minReps: 12, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 30, equipmentIncrement: 5, baseRir: 2, muscleGroup: "Gemelos" },
        { weekday: 3, name: "Pallof press", order: 7, sets: 3, minReps: 10, maxReps: 15, weightType: "total", fixedBar: null, currentLoad: 0, equipmentIncrement: 0, baseRir: 3, muscleGroup: "Core" },
      ],
    },
  },
];
