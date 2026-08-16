import type { Nivel, ContentType } from "../lib/models/LearningContent";

export const muscleGroups = [
  { name: "Espalda", minReps: 14, maxReps: 18, order: 1 },
  { name: "Pecho", minReps: 12, maxReps: 16, order: 2 },
  { name: "Hombro", minReps: 12, maxReps: 16, order: 3 },
  { name: "Bíceps", minReps: 10, maxReps: 14, order: 4 },
  { name: "Tríceps", minReps: 10, maxReps: 14, order: 5 },
  { name: "Cuádriceps", minReps: 10, maxReps: 14, order: 6 },
  { name: "Glúteo / Isquiotibiales", minReps: 8, maxReps: 12, order: 7 },
  { name: "Core", minReps: 6, maxReps: 10, order: 8 },
  { name: "Trapecio", minReps: 6, maxReps: 12, order: 9 },
  { name: "Gemelos", minReps: 6, maxReps: 12, order: 10 },
];

export const learningContents: Array<{
  slug: string;
  title: string;
  level: Nivel;
  type: ContentType;
  category: string;
  order: number;
  content: string;
}> = [
  // ─── GLOSARIO ───
  {
    slug: "hipertrofia",
    title: "Hipertrofia",
    level: "principiante",
    type: "termino",
    category: "fundamentos",
    order: 1,
    content:
      "Aumento del tamaño de las fibras musculares como adaptación al entrenamiento de fuerza. Los tres mecanismos principales son la tensión mecánica, el daño muscular y el estrés metabólico, siendo la tensión mecánica el más importante. La hipertrofia se logra combinando un estímulo suficiente (sets cercanas al fallo) con descanso y alimentación adecuados.",
  },
  {
    slug: "sobrecarga-progresiva",
    title: "Sobrecarga progresiva",
    level: "principiante",
    type: "termino",
    category: "fundamentos",
    order: 2,
    content:
      "Principio según el cual el músculo solo crece si el estímulo aumenta con el tiempo: más peso, más repeticiones o más series. Es el motor principal del progreso en fuerza e hipertrofia (Schoenfeld et al.). No significa subir peso cada sesión a cualquier costo: se puede progresar sumando repeticiones dentro del rango o mejorando la calidad del esfuerzo.",
  },
  {
    slug: "rir",
    title: "RIR (Repeticiones en Reserva)",
    level: "principiante",
    type: "termino",
    category: "intensidad",
    order: 3,
    content:
      "Cuántas repeticiones más podrías haber hecho al terminar una serie antes del fallo. RIR 2 = podrías haber hecho 2 más. Es una medida de esfuerzo subjetiva pero entrenable. Una serie ejecutada a 0-4 RIR se considera serie dura; por encima de 5 RIR el estímulo es mínimo.",
  },
  {
    slug: "rpe",
    title: "RPE (Escala de Esfuerzo Percibido)",
    level: "principiante",
    type: "termino",
    category: "intensidad",
    order: 4,
    content:
      "Escala de esfuerzo de 1 a 10. Es la contraparte del RIR: RPE 10 = fallo (RIR 0), RPE 9 = RIR 1, RPE 8 = RIR 2, y así. Se usa para autorregular la intensidad: el objetivo no es fallar siempre, sino trabajar en un rango de esfuerzo planificado.",
  },
  {
    slug: "mev",
    title: "MEV (Volumen Mínimo Efectivo)",
    level: "intermedio",
    type: "termino",
    category: "volumen",
    order: 5,
    content:
      "La menor cantidad de series duras por semana que produce crecimiento en un músculo. Entrenar por debajo del MEV significa progresar muy lento o no progresar. En IronLog la auditoría semanal te muestra si estás por debajo, en rango o por encima de los rangos recomendados por grupo muscular.",
  },
  {
    slug: "mav",
    title: "MAV (Volumen Adaptativo Máximo)",
    level: "intermedio",
    type: "termino",
    category: "volumen",
    order: 6,
    content:
      "La cantidad de series duras por semana que produce la mejor relación entre estímulo y fatiga. Es la zona objetivo para la mayoría de los músculos durante la fase de acumulación de un bloque de entrenamiento.",
  },
  {
    slug: "mrv",
    title: "MRV (Volumen Máximo Recuperable)",
    level: "intermedio",
    type: "termino",
    category: "volumen",
    order: 7,
    content:
      "El máximo de series duras que puedes recuperar antes de la siguiente sesión del mismo músculo. Pasar el MRV de forma sostenida lleva a fatiga acumulada, dolor persistente y estancamiento. Los rangos que usa IronLog (MEV/MAV/MRV) provienen de la literatura de hipertrofia (Schoenfeld, Krieger, Pelland et al.).",
  },
  {
    slug: "volumen",
    title: "Volumen de entrenamiento",
    level: "principiante",
    type: "termino",
    category: "volumen",
    order: 8,
    content:
      "Cantidad total de trabajo por músculo, medida normalmente en series duras por semana. Es la variable con mayor evidencia a favor para la hipertrofia: más series duras (hasta el MRV) = más crecimiento, con rendimientos decrecientes.",
  },
  {
    slug: "frecuencia",
    title: "Frecuencia de entrenamiento",
    level: "principiante",
    type: "termino",
    category: "volumen",
    order: 9,
    content:
      "Cuántas veces por semana se entrena cada músculo. La evidencia sugiere que 2 veces por semana es superior a 1 vez para la mayoría de las personas, porque permite repartir el volumen semanal en sessions más cortas y recuperables.",
  },
  {
    slug: "intensidad",
    title: "Intensidad",
    level: "principiante",
    type: "termino",
    category: "intensidad",
    order: 10,
    content:
      "Qué tan cerca del fallo trabajas (o qué porcentaje de tu máximo es la carga). En hipertrofia se opera mejor con RIR (esfuerzo relativo) que con porcentajes fijos, porque tu estado del día cambia. Series entre RIR 0 y 4 son las que generan estímulo; entre RIR 1-3 está la zona óptima habitual.",
  },
  {
    slug: "series-duras",
    title: "Series duras",
    level: "principiante",
    type: "termino",
    category: "volumen",
    order: 11,
    content:
      "Series ejecutadas a 0-4 RIR. Son las únicas que cuentan de verdad para el volumen de hipertrofia. IronLog cuenta automáticamente tus series duras por grupo muscular y las compara con los rangos recomendados.",
  },
  {
    slug: "doble-progresion",
    title: "Doble progresión",
    level: "intermedio",
    type: "termino",
    category: "progresion",
    order: 12,
    content:
      "Método de progresión: dentro de un rango de repeticiones (ej. 8-10), primero sumas repeticiones; cuando llegas al tope del rango con el esfuerzo objetivo, subes el peso al siguiente salto disponible del equipo y vuelves al mínimo del rango. Es la solución cuando los saltos del gimnasio son grandes (una polea que solo sube de a 5 kg).",
  },
  {
    slug: "deload",
    title: "Descarga (deload)",
    level: "intermedio",
    type: "termino",
    category: "programacion",
    order: 13,
    content:
      "Semana planificada de volumen reducido (típicamente 50-60%) para disipar fatiga acumulada. Permite llegar recuperado al siguiente bloque y evitar estancamientos y lesiones. En el método de IronLog es la semana 7, seguida de un test de fuerza.",
  },
  {
    slug: "1rm",
    title: "1RM",
    level: "intermedio",
    type: "termino",
    category: "fuerza",
    order: 14,
    content:
      "Repetición máxima: el mayor peso que puedes levantar una sola vez en un ejercicio. Medir el 1RM real es arriesgado y agotador; por eso se estima con fórmulas a partir de series cercanas al fallo (ver e1RM y AMRAP).",
  },
  {
    slug: "amrap",
    title: "AMRAP",
    level: "intermedio",
    type: "termino",
    category: "fuerza",
    order: 15,
    content:
      "As Many Reps As Possible: hacer el máximo de repeticiones posibles con una carga dada, con buena técnica. Se usa en la semana de test para estimar tu 1RM de forma segura: última serie del ejercicio a máximo esfuerzo, sin llegar a técnica rota.",
  },
  {
    slug: "e1rm",
    title: "e1RM (1RM estimado)",
    level: "intermedio",
    type: "termino",
    category: "fuerza",
    order: 16,
    content:
      "Estimación de tu repetición máxima con la fórmula de Epley: 1RM ≈ peso × (1 + reps/30). IronLog la calcula en los tests AMRAP y también la muestra en tu progreso histórico, para que puedas comparar tu fuerza entre épocas aunque nunca hagas un 1RM real.",
  },
  {
    slug: "autorregulacion",
    title: "Autorregulación",
    level: "intermedio",
    type: "termino",
    category: "programacion",
    order: 17,
    content:
      "Ajustar la carga planificada según tu rendimiento y fatiga reales, en lugar de seguir un número ciego. Registrando carga, reps y RIR reales, IronLog recalcula la progresión: si te sobró esfuerzo sube más, si fallaste dos semanas seguidas baja.",
  },
  {
    slug: "rom",
    title: "ROM (Rango de movimiento)",
    level: "intermedio",
    type: "termino",
    category: "biomecanica",
    order: 18,
    content:
      "Amplitud completa del recorrido de un ejercicio. Para hipertrofia se recomienda un ROM amplio con control (estiramiento completo del músculo objetivo), porque el músculo crece más donde más se estira bajo carga.",
  },
  {
    slug: "tempo",
    title: "Tempo",
    level: "intermedio",
    type: "termino",
    category: "biomecanica",
    order: 19,
    content:
      "Velocidad con la que ejecutas cada fase del movimiento (ej. 2-1-2 = 2s bajando, 1s pausa, 2s subiendo). La fase excéntrica (bajar) controlada es especialmente valiosa para estímulo y seguridad articular.",
  },
  {
    slug: "fallo-muscular",
    title: "Fallo muscular",
    level: "principiante",
    type: "termino",
    category: "intensidad",
    order: 20,
    content:
      "No poder completar otra repetición con buena técnica. Entrenar siempre al fallo no es necesario ni óptimo: genera mucha fatiga. La mayoría de series productivas se quedan entre RIR 0 y 3; el fallo se reserva para ejercicios seguros y momentos puntuales (como el test AMRAP).",
  },
  {
    slug: "pr",
    title: "PR (Personal Record)",
    level: "principiante",
    type: "termino",
    category: "practica",
    order: 21,
    content:
      "Tu mejor marca personal en un ejercicio. IronLog detecta automáticamente cuándo un registro supera tu histórico y lo marca como PR, para que veas el progreso aunque sea pequeño.",
  },
  {
    slug: "split",
    title: "Split",
    level: "principiante",
    type: "termino",
    category: "programacion",
    order: 22,
    content:
      "Cómo repartes los grupos musculares a lo largo de la semana. El split de esta rutina es de 5 días: tracción fuerte, empuje fuerte, piernas, empuje accesorio y tracción accesorio, logrando frecuencia 2 por grupo (excepto piernas).",
  },
  {
    slug: "tension-mecanica",
    title: "Tensión mecánica",
    level: "intermedio",
    type: "termino",
    category: "biomecanica",
    order: 23,
    content:
      "Fuerza que soporta el músculo durante la contracción bajo carga. Es el mecanismo principal de la hipertrofia. Aumenta con la carga, con la cercanía al fallo y con el estiramiento bajo carga.",
  },
  {
    slug: "dano-muscular",
    title: "Daño muscular",
    level: "intermedio",
    type: "termino",
    category: "biomecanica",
    order: 24,
    content:
      "Micro-rupturas en las fibras producidas por el entrenamiento (la causa de las agujetas). Contribuye a la hipertrofia pero no debe buscarse en exceso: demasiado daño alarga la recuperación sin beneficio extra.",
  },
  {
    slug: "estres-metabolico",
    title: "Estrés metabólico",
    level: "intermedio",
    type: "termino",
    category: "biomecanica",
    order: 25,
    content:
      "Acumulación de subproductos metabólicos durante series sostenidas (la sensación de quemazón). Es el mecanismo menos determinante de los tres, pero contribuye, sobre todo en rangos de repeticiones medios-altos.",
  },

  // ─── ARTÍCULOS ───
  {
    slug: "que-es-la-hipertrofia",
    title: "¿Qué es la hipertrofia y cómo se produce?",
    level: "principiante",
    type: "articulo",
    category: "fundamentos",
    order: 1,
    content: `La hipertrofia es el crecimiento de tus fibras musculares: una adaptación de tu cuerpo a un estímulo que percibe como exigente. Cuando entrenas cerca del fallo con suficiente volumen, envías una señal clara: necesito músculo más grande para sobrevivir a esto.

Tres mecanismos explican el proceso:

1. Tensión mecánica. Es el más importante. Ocurre cuando el músculo genera fuerza bajo carga, especialmente con estiramiento y cerca del fallo. A más tensión acumulada (carga × repeticiones × esfuerzo), más señal de crecimiento.

2. Daño muscular. Micro-roturas en las fibras que tu cuerpo repara más grandes de lo que estaban. Produce agujetas, pero no hay que perseguirlo: demasiado daño solo alarga la recuperación.

3. Estrés metabólico. La quemazón de las series largas. Contribuye, pero menos de lo que se creía.

La conclusión práctica: no necesitas trucos. Necesitas series duras (0-4 RIR), volumen suficiente (MEV a MAV), y que ese estímulo aumente con el tiempo (sobrecarga progresiva). Todo lo demás —técnica, descanso, comida— sirve para que ese estímulo se pueda aplicar y recuperar.

Referencias: Schoenfeld (2010) "The mechanisms of muscle hypertrophy and their application to resistance training".`,
  },
  {
    slug: "sobrecarga-progresiva-motor",
    title: "Sobrecarga progresiva: el motor del progreso",
    level: "principiante",
    type: "articulo",
    category: "fundamentos",
    order: 2,
    content: `Tu músculo crece para adaptarse al estrés. Si el estrés no cambia, la adaptación se detiene: por eso repetir siempre el mismo peso con las mismas reps deja de funcionar. Eso es la sobrecarga progresiva: aumentar el estímulo de forma sostenida semana a semana.

Lo que no es: subir peso cada sesión cueste lo que cueste. Eso lleva al fallo técnico, a las lesiones y al estancamiento frustrante. La evidencia (Schoenfeld et al., 2017) muestra que se puede progresar por tres vías, en orden de practicidad:

1. Más carga: mismo rango de reps, más peso.
2. Más repeticiones: mismo peso, más reps dentro del rango.
3. Más sets: mismo peso y reps, más volumen.

En la práctica se combinan: la doble progresión usa primero las repeticiones (cuando los saltos de equipo son grandes) y luego la carga. El RIR es tu brújula: si una sesión te deja RIR más alto de lo planificado, tu cuerpo está pidiendo más; si no completas las reps mínimas, está pidiendo descanso.

La sobrecarga progresiva no es un número fijo (+2.5 kg por semana no es ley), es una dirección: que cada semana el estímulo sea un poco mayor que el anterior, dentro de lo que tu equipo y tu recuperación permiten.`,
  },
  {
    slug: "que-es-el-rir-y-como-usarlo",
    title: "RIR: tu brújula de esfuerzo",
    level: "principiante",
    type: "articulo",
    category: "intensidad",
    order: 3,
    content: `RIR (Repeticiones en Reserva) es cuántas repeticiones más podrías haber hecho al terminar una serie. RIR 2 significa que dejaste dos en el tanque; RIR 0 es fallo absoluto.

¿Por qué usar RIR en lugar de "ir siempre al fallo"?

- El fallo total genera mucha fatiga y poco beneficio extra frente a RIR 1-3.
- Tu estado cambia día a día: dormiste mal, comiste poco, vienes de un día duro. Un porcentaje fijo no lo sabe; tu RIR sí.
- Es la variable que le permite a la app autorregular la progresión: si terminaste todas las series con RIR por encima del objetivo, el estímulo fue flojo; si no completaste las reps, fue excesivo.

Cómo entrenar el ojo: en tu última serie de un ejercicio aislado seguro, de vez en cuando llega al fallo y cuenta cuántas creías tener en reserva. Con unas semanas de registro verás que tu percepción se calibra rápido.

En esta rutina, el RIR objetivo baja a lo largo del bloque (3 → 2 → 1), acercándote progresivamente al máximo esfuerzo, y la app compara tu RIR real contra ese objetivo para decidir la próxima carga.`,
  },
  {
    slug: "doble-progresion-cuando-el-equipo-no-deja",
    title: "Doble progresión: progresar cuando el equipo no te deja",
    level: "intermedio",
    type: "articulo",
    category: "progresion",
    order: 4,
    content: `El problema clásico: terminas tu rango con el esfuerzo objetivo y la app (o tu plan) dice "sube 2 kg", pero tu polea solo salta de a 5 kg, o tus mancuernas de a 4. Subir el salto completo te saca del rango de reps o te destroza la técnica.

La solución de la literatura es la doble progresión:

1. Define un rango de repeticiones (ej. 8-10) en lugar de un número fijo.
2. Mientras estés dentro del rango, progresa sumando repeticiones (8 → 9 → 10) manteniendo el peso.
3. Cuando llegues al tope del rango con el esfuerzo objetivo (RIR ≤ objetivo), sube al siguiente salto disponible del equipo y vuelve al mínimo del rango (10 reps con 62 kg → 8 reps con 67 kg).

Así, el estímulo sube cada semana (más reps o más peso) sin importar lo tosco que sea el salto de tu máquina. La carga sube más despacio, pero el progreso es continuo y medible.

IronLog automatiza esto: cada ejercicio tiene su incremento de equipo configurado (2.5 kg la barra, 5 kg la polea, +2 kg por lado las mancuernas), y las sugerencias respetan ese salto. Si el salto es cero (exercises de peso corporal), la app progresa solo por repeticiones.

Tip de gimnasio: para saltos intermedios en poleas, pregunta si hay discos auxiliares (0.5-2.5 kg que se cuelgan del stack) o usa bandas de asistencia/resistencia.`,
  },
  {
    slug: "volumen-mev-mav-mrv",
    title: "Volumen: MEV, MAV y MRV explicados",
    level: "intermedio",
    type: "articulo",
    category: "volumen",
    order: 5,
    content: `El volumen (sets duras por semana por músculo) es la variable con más evidencia para la hipertrofia. Pero no es "cuanto más, mejor": existe una zona útil delimitada por tres umbrales:

- MEV (Volumen Mínimo Efectivo): la menor cantidad de series duras que produce crecimiento. Por debajo, entrenas sin progresar. Es el punto de partida ideal cuando vuelves de un parón o empiezas un músculo nuevo.

- MAV (Volumen Adaptativo Máximo): la mejor relación estímulo/fatiga. Es donde conviene pasar la mayor parte del bloque: creces rápido y te recuperas bien.

- MRV (Volumen Máximo Recuperable): tu techo de recuperación. Entrenar por encima de forma sostenida genera fatiga acumulada, dolor persistente y regresión. Se usa solo en picos cortos de intensificación.

Los rangos que usa IronLog por músculo (ej. pecho 12-16 series duras/semana) provienen de la literatura (Schoenfeld, Krieger, Pelland et al.) y son puntos de partida individualizables.

La auditoría semanal de la app cuenta tus series duras reales (RIR ≤ 4 registrado) y te muestra si cada músculo está bajo el MEV, en zona óptima o sobre el MRV. Si un músculo sale bajo, la semana siguiente agrega una serie o sube el esfuerzo; si sale sobre, recorta o descarga.`,
  },
  {
    slug: "frecuencia-2x-semana",
    title: "Frecuencia: por qué 2 veces por semana",
    level: "intermedio",
    type: "articulo",
    category: "volumen",
    order: 6,
    content: `La frecuencia es cuántas veces por semana entrenas cada músculo. La evidencia actual (Schoenfeld et al., 2016) indica que, a igual volumen total, entrenar un músculo 2 veces por semana produce más hipertrofia que 1 vez.

Las razones:

1. Sesiones más cortas y de mayor calidad: 15 series de espalda en un día terminan mediocres; repartidas en dos días, cada serie es más dura.
2. Señal de crecimiento más frecuente: la síntesis de proteínas vuelve a niveles basales a las ~48 h. Golpear el músculo de nuevo reactiva la señal.
3. Mejor técnica y menos dolor: con menos fatiga por sesión, cada repetición es más limpia.

El split de esta rutina lo logra: tracción y empuje aparecen dos veces (una fuerte, una accesoria). La excepción son las piernas (1 sesión completa), porque su volumen ya cubre el rango y la fatiga sistémica es alta; si quisieras frecuencia 2 en piernas, dividirías la sesión en dos medias.

IronLog no impone nada: si cambias tu split, la auditoría de volumen por grupo seguirá diciéndote si cada músculo recibe lo que necesita.`,
  },
  {
    slug: "biomecanica-basica",
    title: "Biomecánica básica para entrenar mejor",
    level: "intermedio",
    type: "articulo",
    category: "biomecanica",
    order: 7,
    content: `No necesitas ser ingeniero, pero cuatro ideas de biomecánica cambian la calidad de tu entrenamiento:

1. Palancas. Tu cuerpo es un sistema de palancas. Cuanto más lejos del eje (articulación) está la carga, más difícil es el movimiento. Por eso una elevación lateral con el brazo extendido es brutal con 8 kg: el hombro es el eje y la mancuerna está en el extremo.

2. Perfil de resistencia. Cada ejercicio tiene tramos fáciles y difíciles. En el jalón el inicio (brazos arriba) es más difícil que el final; en la elevación lateral es al revés. Saber dónde falla cada ejercicio te dice dónde necesitas más atención (y a veces, variar el ángulo o usar poleas que igualan la tensión).

3. ROM (rango de movimiento). El músculo crece sobre todo donde se estira bajo carga. Un ROM amplio y controlado —estiramiento completo del objetivo— estimula más que medias repeticiones, y suele ser más seguro para las articulaciones que cargar a tope con recorridos cortos.

4. Tempo. Bajar el peso controlado (fase excéntrica, 2-3 s) aporta tensión extra con menos desgaste articular que subir a tirones. La pausa breve en el estiramiento evita el rebote que engaña a la inercia.

Regla práctica: si un ejercicio te molesta en una articulación, antes de tirarlo revisa palanca y ROM —muchas molestias son de cargar más de lo que la palanca permite, no del ejercicio en sí.`,
  },
  {
    slug: "descarga-y-test",
    title: "Semana 7: descarga y test de fuerza",
    level: "avanzado",
    type: "articulo",
    category: "programacion",
    order: 8,
    content: `Después de 6 semanas subiendo la intensidad (RIR 3 → 1), la fatiga acumulada esconde tu verdadero nivel. Por eso el bloque termina con una semana 7 especial, y IronLog te la guía paso a paso.

Descarga (deload): volumen reducido al ~60%. Mismos ejercicios, pero menos carga o menos esfuerzo (la app te sugiere las cargas automáticamente). El objetivo no es progresar sino disipar fatiga, sanar tendones y llegar fresco al test.

Test AMRAP: en la última serie de cada ejercicio, en lugar de la carga de descarga usas la carga de tu semana 6 (la app la pre-carga por ti) y haces el máximo de repeticiones posible con técnica impecable. Con esas repeticiones se estima tu máximo:

1RM ≈ peso × (1 + reps/30)   [fórmula de Epley]

Ejemplo: press banca 70 kg × 6 reps → 70 × 1.2 = 84 kg estimados.

Guía práctica de ejecución:

1. Haz tus series normales de descarga (al 60%).
2. En la última serie, carga el peso de la semana 6.
3. Haz repeticiones hasta que la técnica esté a punto de romperse — NO hagas reps feas. Ese es tu tope: 1-2 repeticiones antes del fallo técnico.
4. Si el ejercicio es arriesgado sin spotter (press banca, sentadilla), párate con RIR 1: la estimación sigue siendo válida.
5. Registra las reps en la sección "Test AMRAP" de la tarjeta del ejercicio: la app calcula tu e1RM al instante.
6. Al terminar la semana, cierra el bloque: la app recalibra las cargas del siguiente bloque con tus resultados reales.

¿Cuántas reps esperar? Con la carga de tu semana 6 y estando descansado, lo normal son 5-10 reps. Si haces 12+, tu semana 6 fue demasiado ligera (la app compensará con saltos mayores); si haces 2-3, venías trabajando muy cerca de tu máximo (la app bajará o mantendrá).

Ese e1RM es tu medida de progreso entre bloques: si sube, creciste; si no, el bloque se ajusta (más volumen, otra variante, más descanso). Tu única obligación: registrar la carga y las reps reales, no las planificadas.`,
  },
  {
    slug: "autorregulacion-y-bloques",
    title: "Autorregulación y bloques: el método completo",
    level: "avanzado",
    type: "articulo",
    category: "programacion",
    order: 9,
    content: `El método que automatiza esta app combina dos ideas de la literatura moderna:

Bloques de 6 semanas con intensidad creciente. La primera mitad del bloque trabaja en acumulación (RIR 3 → 2, cerca del MAV): volumen creciente, técnica sólida. La segunda mitad intensifica (RIR 2 → 1): te acercas al máximo esfuerzo donde se construye el pico de fuerza. Cada bloque termina con descarga y test (week 7).

Autorregulación por datos reales. El plan semanal es una hipótesis, no un mandato. Lo que registras (carga real, reps, RIR) la corrige:

- Completaste reps con RIR ≤ objetivo → la hipótesis era correcta: sube el siguiente salto de equipo.
- El RIR salió alto (≥ 4) → tu capacidad subió más rápido de lo previsto: salto doble.
- No completaste las reps mínimas → el plan iba demasiado rápido: mantén.
- Dos semanas seguidas fallando → deload local: baja un 5% o un salto de equipo.
- Marcaste molestia/lesión → la app no sugiere subir y te lo recuerda.

Este ciclo —planear, registrar, recalibrar— es lo que hacía un coach humano (o Claude) a mano. La ventaja de registrarlo en IronLog es que la decisión se aplica con criterios consistentes, semana tras semana, sin depender de copiar notas de un lado a otro.`,
  },
  {
    slug: "como-leer-tu-progreso",
    title: "Cómo leer tu progreso en IronLog",
    level: "principiante",
    type: "articulo",
    category: "practica",
    order: 10,
    content: `La fuerza real no se mide en una sesión: se mide en semanas y bloques. Estas son las señales que IronLog te muestra y qué significan:

1. Plan vs real. Cada semana, por ejercicio: lo que el plan proponía y lo que realmente hiciste. Desviaciones puntuales son normales (un día malo); desviaciones sostenidas indican que el plan va mal calibrado —y la app lo corrige solo.

2. e1RM por ejercicio. Tu estimación de máximo a lo largo del tiempo. Es la curva más honesta de fuerza: si sube entre bloques, estás creciendo aunque el peso de trabajo se sienta igual.

3. PRs. Récords personales detectados automáticamente. Verlos acumularse es la motivación más barata que existe.

4. Auditoría de volumen. Series duras por músculo contra los rangos MEV/MAV/MRV. Un músculo constantemente bajo el MEV explica por qué no crece; uno sobre el MRV explica por qué te sientes roto.

5. Peso corporal. Una vez por semana, mismo día y hora. La dirección de la curva (subiendo despacio en superávit, estable en recomposición, bajando lento en déficit) te dice si la nutrición acompaña al entrenamiento.

Cómo usar todo junto: al final de cada bloque, mira el e1RM y la auditoría. Si el e1RM subió y los músculos están en zona óptima, el método funciona: siguiente bloque, misma receta. Si un músculo no sube, mira su volumen y frecuencia antes de cambiar de ejercicio.

Regla de oro: registra los datos reales aunque sean feos. Los números bonitos no hacen crecer músculos; los números honestos sí.`,
  },
];
