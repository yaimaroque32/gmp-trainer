// Contenido del entrenamiento GMP — basado en H-SOP-Q-000015 y documentos reales anonimizados.

const ALCOA = [
  { letra: "A", de: "Attributable / Zuweisbar", es: "Se puede saber quién generó el dato (Kürzel/firma)." },
  { letra: "L", de: "Legible / Lesbar, Nachvollziehbar", es: "Se puede leer y seguir el rastro de cada cambio." },
  { letra: "C", de: "Contemporaneous / Zeitnah", es: "Se documenta en el momento, nunca antes ni después sin marcarlo." },
  { letra: "O", de: "Original / Originär", es: "El dato original nunca se destruye, solo se tacha (sigue legible)." },
  { letra: "A", de: "Accurate / Korrekt", es: "El dato final es correcto, completo y fiable." },
];

const GLOSARIO = [
  { de: "Charge / Chargenprotokoll", es: "Lote / registro de lote" },
  { de: "Herstellung", es: "Fabricación" },
  { de: "Durchgeführt / Durchführung", es: "Ejecutado / ejecución" },
  { de: "Prüfung / geprüft", es: "Verificación / verificado" },
  { de: "4-Augen-Prinzip", es: "Doble verificación (\"cuatro ojos\")" },
  { de: "Kürzel", es: "Iniciales de firma" },
  { de: "Unterschrift / Signum", es: "Firma / firma abreviada" },
  { de: "Bemerkung(en)", es: "Observación(es) / comentario(s)" },
  { de: "Streichung / gestrichen", es: "Tachadura / tachado" },
  { de: "Streichung aufgehoben", es: "Tachadura anulada / revocada" },
  { de: "SF (Schreibfehler)", es: "Error de escritura (único motivo que se puede abreviar)" },
  { de: "n.a. (nicht anwendbar)", es: "No aplicable" },
  { de: "Nachtrag / nachträglich", es: "Entrada tardía / a posteriori" },
  { de: "Ergänzung / ergänzt", es: "Añadido / complementado" },
  { de: "Verweiszeichen", es: "Signo de referencia cruzada (asterisco + número)" },
  { de: "Nachweis(dokument)", es: "Prueba / documento de evidencia objetiva" },
  { de: "Quality Event / Abweichung", es: "Evento de calidad / desviación" },
  { de: "Sollwert / Ist(-Wert)", es: "Valor objetivo / valor real" },
  { de: "Verwendbar bis / Haltbarkeit", es: "Caducidad / vida útil" },
  { de: "IC-Nummer / Chargen-Nr.", es: "Número de lote interno" },
  { de: "Line Clearance", es: "Despeje / verificación de línea" },
  { de: "Rücksprache mit verantwortlicher Person", es: "Consultar con la persona responsable" },
  { de: "Formblatt für Bemerkungen", es: "Formulario de observaciones (anexo formal)" },
  { de: "Ersteller / Prüfer", es: "Quien redacta / quien revisa" },
  { de: "i.A. (im Auftrag)", es: "\"En representación de\" (firma delegada)" },
  { de: "dokumentenechte Stifte", es: "Bolígrafos/sellos a prueba de manipulación (solo azul o negro)" },
  { de: "Entwertung", es: "Anulación de un campo o sección (preferible en forma de \"Z\")" },
  { de: "Nachkommastellen", es: "Decimales a registrar" },
  { de: "Einkleben / Klebestreifen", es: "Pegar (un anexo) / cinta adhesiva" },
];

const QUIZ_MODULO0 = [
  {
    q: "¿Qué significa la \"L\" de ALCOA?",
    opciones: ["Legible / Lesbar", "Lento / Langsam", "Legal / Rechtlich"],
    correcta: 0,
    explicacion: "Legible/Lesbar: el dato debe poder leerse y seguirse (Nachvollziehbar), incluso después de una corrección.",
  },
  {
    q: "Según el SOP, ¿quién puede usar el Kürzel (iniciales) de un empleado?",
    opciones: ["Cualquier compañero de su mismo turno", "Solo el propio empleado", "Su responsable directo, si él está ausente"],
    correcta: 1,
    explicacion: "El Kürzel es como una firma: solo puede usarlo el propio empleado. Firmar por otra persona ausente se hace con \"i.A.\", identificando siempre al firmante previsto.",
  },
  {
    q: "¿Cuál de estas causas de corrección es SUFICIENTE por sí sola, según el SOP?",
    opciones: ["\"korrigiert\"", "\"gestrichen\"", "\"SF\""],
    correcta: 2,
    explicacion: "\"Korr.\", \"korrigiert\" o \"gestrichen\" NO son motivo suficiente. Solo \"SF\" (Schreibfehler) es una causa abreviada válida; cualquier otra causa debe escribirse completa.",
  },
  {
    q: "¿Qué bolígrafos están permitidos para documentar en GMP según el SOP?",
    opciones: ["Solo azul o negro, dokumentenecht", "Cualquier color excepto rojo", "Lápiz, para poder corregir sin tachar"],
    correcta: 0,
    explicacion: "Solo bolígrafos o sellos azules o negros, a prueba de manipulación. Prohibidos: lápiz, rotulador fino, pluma estilográfica, marcador fluorescente.",
  },
  {
    q: "Vas a repetir el mismo valor que en la fila de arriba. ¿Puedes escribir sólo unas comillas (\") o \"dito\"?",
    opciones: ["Sí, es la forma estándar de ahorrar tiempo", "No, hay que volver a escribir el valor completo cada vez", "Solo si el valor es un número"],
    correcta: 1,
    explicacion: "El SOP prohíbe explícitamente comillas, \"dito\", \"siehe oben\" o llaves para repetir un dato: hay que escribirlo completo en cada fila.",
  },
  {
    q: "¿Cuándo NO hace falta prueba objetiva (Nachweis) para una corrección?",
    opciones: ["Nunca, siempre hace falta", "Cuando la causa es \"SF\"", "Cuando corrige el jefe de producción"],
    correcta: 1,
    explicacion: "Solo las correcciones por \"SF\" (Schreibfehler) están exentas de signo de referencia y de prueba objetiva.",
  },
  {
    q: "Un campo tiene una respuesta binaria clara (Ja/Nein) y quieres anularlo por no aplicar. ¿Es correcto?",
    opciones: ["Sí, se anula igual que cualquier otro campo", "No, los campos Ja/Nein no se anulan", "Solo si el jefe de producción lo autoriza por escrito"],
    correcta: 1,
    explicacion: "El SOP dice explícitamente: no se hacen anulaciones (Entwertungen) sobre una respuesta de selección binaria clara como Ja/Nein.",
  },
  {
    q: "¿Qué forma preferida tiene una anulación (Entwertung) de una sección completa?",
    opciones: ["Una \"Z\" que cubra toda la sección", "Tachar cada línea por separado con una raya distinta", "Dejarla en blanco y anotarlo solo en la portada"],
    correcta: 0,
    explicacion: "Forma preferida: una \"Z\" que atraviese toda la sección, de modo que no se pueda añadir nada después.",
  },
];

// Ejercicios del Módulo 3 — corrección simple. Basados en casos reales anonimizados.
const EJERCICIOS_MODULO3 = [
  {
    id: "ej1",
    contexto: "Campo de fecha en un registro de lote.",
    valorOriginal: "32.04.2025",
    valorCorrecto: "23.04.2025",
    pista: "Es una fecha imposible (no existe el día 32) — típico error de escritura.",
    motivoEsperado: "SF",
    plantilla: "SF [fecha] [iniciales]",
  },
  {
    id: "ej2",
    contexto: "Cantidad de un componente en la tabla de materiales (unidades de tampón preparado).",
    valorOriginal: "36",
    valorCorrecto: "5",
    pista: "El operador transcribió mal la cantidad real utilizada — error de escritura simple.",
    motivoEsperado: "SF",
    plantilla: "SF [fecha] [iniciales]",
  },
  {
    id: "ej3",
    contexto: "Código de Quality Event anotado en la portada del registro de lote.",
    valorOriginal: "DEV-06936",
    valorCorrecto: "DEV-06920",
    pista: "El código correcto está documentado en otro registro relacionado (H-MBR-000582). Esto no es un simple error de escritura: necesitas explicar la causa y remitir a la prueba objetiva.",
    motivoEsperado: "explicacion",
    plantilla: "[explicación de la causa] [referencia a la prueba objetiva] [fecha] [iniciales]",
  },
];

// Definición completa de módulos (0-12) para el panel principal.
const MODULOS = [
  { id: 0, titulo: "ALCOA + vocabulario base", desc: "Los 5 principios y el glosario núcleo.", tipo: "modulo0", estado: "disponible" },
  { id: 1, titulo: "Escribir bien desde el origen", desc: "Bolígrafo, contemporaneidad, prohibido \"dito\"/comillas, i.A.", tipo: "quiz", estado: "disponible" },
  { id: 2, titulo: "Interpretación de instrucciones", desc: "Comprensión de instrucciones reales en alemán.", tipo: "quiz", estado: "disponible" },
  { id: 3, titulo: "Corrección simple (tachado + SF)", desc: "Tachar, escribir el valor correcto y redactar la Bemerkung.", tipo: "correccion", estado: "disponible" },
  { id: 4, titulo: "Casillas marcadas mal", desc: "Simulación visual de casilla incorrecta.", tipo: "casillas", estado: "disponible" },
  { id: 5, titulo: "Anulación de secciones (Entwertung)", desc: "Cuándo aplica \"n.a.\"/\"Z\" y cuándo no.", tipo: "quiz", estado: "disponible" },
  { id: 6, titulo: "Nachträge (entradas tardías)", desc: "Prueba objetiva o apertura de Abweichung.", tipo: "escritura", estado: "disponible" },
  { id: 7, titulo: "¿Hace falta una segunda firma?", desc: "4-Augen-Prinzip condicional.", tipo: "quiz", estado: "disponible" },
  { id: 8, titulo: "Redondeo de valores numéricos", desc: "Regla oficial, sin redondeo en cascada.", tipo: "quiz", estado: "disponible" },
  { id: 9, titulo: "Pegado de anexos e impresiones", desc: "Cinta, papel térmico, firma solapando.", tipo: "quiz", estado: "disponible" },
  { id: 10, titulo: "Casos combinados / cadenas", desc: "Revocación de una revocación, y similares.", tipo: "escritura", estado: "disponible" },
  { id: 11, titulo: "Letra ilegible", desc: "Pendiente de confirmar regla exacta en el SOP.", tipo: "quiz", estado: "disponible" },
  { id: 12, titulo: "Simulacro integrado", desc: "Una página completa con varios errores mezclados.", tipo: "escritura", estado: "disponible" },
];

// ---------- Helpers de validación de Bemerkungen (compartidos) ----------
const RE_FECHA = /\b\d{1,2}\.\d{1,2}\.(\d{2}|\d{4})\b/;
function tieneFecha(t) { return RE_FECHA.test(t); }
function tieneIniciales(t) {
  const sin = t.replace(RE_FECHA, "").replace(/\bSF\b/gi, "").replace(/\bn\.a\.\b/gi, "");
  return /\b[A-ZÄÖÜ][a-zA-ZäöüÄÖÜ]{1,3}\b/.test(sin);
}
function tieneVerweiszeichen(t) { return /\*\s?\d/.test(t); }
function tieneReferenciaDoc(t) { return /(siehe|s\.|H-MBR|H-PPR|Nachweis|Anhang)/i.test(t); }

// ---------- Módulo 1: Escribir bien desde el origen ----------
const QUIZ_MODULO1 = [
  {
    q: "¿Cuál de estos NO está permitido para documentar en GMP?",
    opciones: ["Bolígrafo azul", "Rotulador fino (Fineliner)", "Bolígrafo negro"],
    correcta: 1,
    explicacion: "Prohibidos: lápiz, Fineliner, pluma estilográfica y marcador fluorescente. Solo bolígrafos o sellos azules o negros, dokumentenecht.",
  },
  {
    q: "Terminaste tu turno y olvidaste anotar algo de ayer. ¿Puedes poner la fecha de ayer para que \"cuadre\"?",
    opciones: ["Sí, así queda más ordenado", "No — está prohibido pre/post-fechar; se marca como Nachtrag", "Solo si lo autoriza tu responsable"],
    correcta: 1,
    explicacion: "Prohibido pre- o post-fechar. Lo que no se documenta en el momento se marca explícitamente como Nachtrag.",
  },
  {
    q: "Vas a firmar en nombre de un compañero de vacaciones que ya había preparado/revisado el documento antes de irse. ¿Qué anotas?",
    opciones: ["i.V.", "i.A., dejando claro quién era el firmante previsto", "Solo tu Kürzel, como si fuera tuyo"],
    correcta: 1,
    explicacion: "\"i.A.\" (im Auftrag), identificando siempre al firmante originalmente previsto. \"i.V.\" no se usa en Celonic Heidelberg.",
  },
  {
    q: "¿Dónde NO puedes documentar un dato en GMP?",
    opciones: ["En el campo Bemerkung del documento", "En un post-it pegado al documento", "En el Formblatt für Bemerkungen (H-FRM-000645)"],
    correcta: 1,
    explicacion: "Prohibidas las notas sueltas tipo post-it. Solo en medios controlados y aprobados.",
  },
  {
    q: "¿Puedes escribir en el reverso de una hoja del registro si te falta espacio?",
    opciones: ["Sí, es lo habitual", "No — hay que usar el Bemerkungsfeld o el H-FRM-000645", "Solo si lo firmas también por delante"],
    correcta: 1,
    explicacion: "Los reversos de las hojas no se pueden usar. Para continuar una entrada se usa una referencia al Bemerkungsfeld o al formulario dedicado.",
  },
  {
    q: "Formato oficial de fecha según el SOP:",
    opciones: ["TT.MM.(JJ)JJ", "MM/TT/JJJJ (formato americano)", "JJJJ-MM-TT"],
    correcta: 0,
    explicacion: "Formato europeo: día.mes.(año corto o largo), día y mes siempre a 2 dígitos.",
  },
];

// ---------- Módulo 2: Interpretación de instrucciones ----------
const QUIZ_MODULO2 = [
  {
    q: '"Prüfung im 4-Augen-Prinzip erforderlich" significa que...',
    opciones: ["Solo hace falta tu firma", "Hace falta que una segunda persona verifique y firme también", "Es opcional, según prefieras"],
    correcta: 1,
    explicacion: "El \"principio de los cuatro ojos\" exige una segunda verificación independiente, con su propia fecha/firma.",
  },
  {
    q: '"n.a." en un campo de checklist significa...',
    opciones: ["nicht anwendbar (no aplicable)", "nicht autorisiert (no autorizado)", "nicht angegeben (no indicado)"],
    correcta: 0,
    explicacion: "n.a. = nicht anwendbar, \"no aplicable\".",
  },
  {
    q: 'Lees: "☐ Ja, weiter mit 9.4.2 / ☐ Nein, Rücksprache mit verantwortlicher Person". Si la respuesta real es "Nein", ¿qué debes hacer?',
    opciones: ["Continuar igualmente con el paso 9.4.2", "Detenerte y consultar con la persona responsable antes de seguir", 'Anotar "n.a." y continuar'],
    correcta: 1,
    explicacion: "\"Nein → Rücksprache mit verantwortlicher Person\" es una instrucción de escalado: hay que parar y consultar.",
  },
  {
    q: '"Datum & Signum an der Verweisstelle" te pide que...',
    opciones: ["Firmes solo en la portada del documento", "Pongas fecha e iniciales en el punto donde está el signo de referencia (p. ej. *1)", "Firmes con tu nombre completo, no con iniciales"],
    correcta: 1,
    explicacion: "El Signum (fecha+iniciales) va exactamente en la Verweisstelle, el punto marcado con el signo de referencia.",
  },
  {
    q: '"Nachweisdokument" es...',
    opciones: ["Un documento de evidencia/prueba objetiva", "Un documento nuevo que sustituye al original", "El manual de instrucciones del equipo"],
    correcta: 0,
    explicacion: "Nachweis = prueba/evidencia. Un Nachweisdokument es el documento que aporta la prueba objetiva de que un dato es correcto.",
  },
  {
    q: 'Ves un bloque tachado en diagonal con "n.a. 20.11.2025 IM" al lado. ¿Qué significa esto?',
    opciones: ["Que el operador se olvidó de rellenarlo", "Que el bloque no aplica a esta ejecución, revisado y confirmado", "Que hay un error pendiente de corregir"],
    correcta: 1,
    explicacion: "Es una Entwertung correctamente documentada: el bloque no aplica, con justificación, fecha e iniciales — no es un olvido.",
  },
];

// ---------- Módulo 5: Anulación de secciones (Entwertung) ----------
const QUIZ_MODULO5 = [
  {
    q: "Un campo tiene una pregunta \"Ja/Nein\" ya respondida claramente. ¿Debes anularlo también con \"n.a.\"?",
    opciones: ["Sí, siempre", "No — los campos de respuesta binaria clara (Ja/Nein) no se anulan", "Solo si lo pide tu responsable"],
    correcta: 1,
    explicacion: "El SOP excluye explícitamente las respuestas binarias claras de la obligación de anulación.",
  },
  {
    q: "¿Cuál es la forma preferida de anular una sección completa?",
    opciones: ["Dejarla en blanco", "Una \"Z\" que cubra toda la sección", "Escribir \"no aplica\" con rotulador fluorescente"],
    correcta: 1,
    explicacion: "Forma preferida: una \"Z\" que atraviese toda la sección, para que no se pueda añadir nada después.",
  },
  {
    q: "Un documento es puramente electrónico y tiene un campo vacío. ¿Hace falta anularlo como en papel?",
    opciones: ["Sí, igual que en papel", "No — en documentos puramente electrónicos no hace falta anular campos vacíos", "Solo los campos numéricos"],
    correcta: 1,
    explicacion: "Regla específica del SOP para documentos 100% electrónicos: los campos vacíos no requieren Entwertung.",
  },
  {
    q: "¿Qué elementos necesita toda anulación (Entwertung)?",
    opciones: ["Solo la marca en \"Z\"", "Justificación + fecha + Signum", "Solo la firma del responsable de calidad"],
    correcta: 1,
    explicacion: "Toda Entwertung debe estar justificada (p. ej. \"n.a.\") y llevar fecha y Signum de quien la hace.",
  },
];

// ---------- Módulo 7: ¿Hace falta una segunda firma? ----------
const QUIZ_MODULO7 = [
  {
    q: "Vas a corregir un dato en un documento que TODAVÍA no ha sido revisado por nadie más. ¿Hace falta una segunda firma para tu corrección?",
    opciones: ["Sí, siempre", "No es obligatorio en este caso — el documento no ha sido revisado aún", "Solo si es una fecha"],
    correcta: 1,
    explicacion: "La segunda revisión solo es obligatoria si el documento/entrada ya había sido revisado por otra persona antes de la corrección.",
  },
  {
    q: "El documento YA fue revisado por un Prozessprüfer, y ahora detectas un error y lo corriges. ¿Hace falta que alguien revise tu corrección?",
    opciones: ["No, ya se revisó el documento entero", "Sí — cualquier cambio posterior a una revisión debe volver a revisarse", "Solo si el cambio es una fecha"],
    correcta: 1,
    explicacion: "Regla 2.3.5.1 del SOP: si el documento ya fue revisado, cualquier corrección/Nachtrag posterior necesita también revisión.",
  },
  {
    q: "La persona farmacéuticamente responsable hace una corrección durante su propia revisión formal del documento. ¿Necesita una segunda revisión?",
    opciones: ["Sí, siempre", "No — si la hace como parte de su propia función de revisión, no hace falta revisión adicional", "Solo si lo pide calidad"],
    correcta: 1,
    explicacion: "Excepción explícita del SOP para correcciones hechas por el responsable farmacéutico en su propia revisión.",
  },
  {
    q: "¿Qué autorización debe tener quien revisa una corrección o Nachtrag?",
    opciones: ["Cualquier compañero disponible", "La misma autorización que tenía el revisor inicial", "Solo puede revisarlas el jefe de producción"],
    correcta: 1,
    explicacion: "Quien revisa una corrección/Nachtrag debe tener una autorización equivalente a la del revisor inicial.",
  },
  {
    q: "Tienes varias correcciones pequeñas en la misma página. ¿Cómo se puede documentar su revisión?",
    opciones: ["Solo junto a cada corrección, individualmente, sin excepción", "Junto a cada corrección, o de forma resumida en el lugar de la firma inicial — ambas son válidas", "Nunca se puede resumir"],
    correcta: 1,
    explicacion: "El SOP permite documentar la revisión cerca de cada corrección individual, o resumida en el punto de la firma inicial.",
  },
];

// ---------- Módulo 8: Redondeo de valores numéricos ----------
const QUIZ_MODULO8 = [
  {
    q: "Debes redondear 0,549 a 1 decimal. ¿Cuál es el resultado correcto?",
    opciones: ["0,5", "0,6", "0,55"],
    correcta: 0,
    explicacion: "Solo se mira el dígito siguiente a la posición requerida: aquí es \"4\" (<5) → redondea hacia abajo directamente. El redondeo en cascada (0,549→0,55→0,6) está prohibido.",
  },
  {
    q: "Debes redondear 0,55 a 1 decimal. ¿Cuál es el resultado?",
    opciones: ["0,5", "0,6", "Depende del operador"],
    correcta: 1,
    explicacion: "El dígito siguiente es \"5\" (≥5) → redondea hacia arriba: 0,6.",
  },
  {
    q: "¿Está permitido el redondeo en cascada (0,549 → 0,55 → 0,6)?",
    opciones: ["Sí, es lo más preciso", "No, está expresamente prohibido", "Solo en cálculos de rendimiento (Bilanzierung)"],
    correcta: 1,
    explicacion: "El SOP lo prohíbe explícitamente por ese ejemplo exacto. Se redondea directamente desde el valor original.",
  },
  {
    q: "¿Dónde se indica cuántos decimales (Nachkommastellen) hay que anotar?",
    opciones: ["Lo decide el operador según el instrumento", "Lo indica el documento de instrucción (Vorgabedokument)", "Siempre son 2 decimales"],
    correcta: 1,
    explicacion: "El número de decimales requerido viene fijado en el Vorgabedokument, no es una decisión libre del operador.",
  },
  {
    q: "Redondea 12,3450 a 2 decimales.",
    opciones: ["12,34", "12,35", "12,3"],
    correcta: 1,
    explicacion: "El dígito siguiente a la 2ª posición decimal es \"5\" (≥5) → redondea hacia arriba: 12,35.",
  },
];

// ---------- Módulo 9: Pegado de anexos e impresiones ----------
const QUIZ_MODULO9 = [
  {
    q: "Vas a pegar un ticket térmico de un instrumento (p. ej. conductímetro). ¿Qué debes hacer primero por el tipo de papel?",
    opciones: ["Pegarlo directamente, tal cual", "Hacer una copia fiel del ticket antes de pegarlo, porque el papel térmico se degrada", "Plastificarlo"],
    correcta: 1,
    explicacion: "Los ausdrucke en papel no duradero (térmico) deben copiarse como copia fiel antes de adjuntarse, porque el original se desvanece.",
  },
  {
    q: "¿Cómo se debe pegar la cinta adhesiva sobre un documento anexo?",
    opciones: ["Con un solo trozo en el centro", "En dos lados opuestos, preferiblemente los más largos", "Cubriendo todo el documento por completo"],
    correcta: 1,
    explicacion: "Cinta en dos lados opuestos (mejor los más largos), sin dañar la legibilidad ni permitir retirar el documento sin dejar rastro.",
  },
  {
    q: "¿Dónde deben ir la fecha y el Signum al pegar un anexo?",
    opciones: ["Solo en el papel base del documento", "Solapando el papel del documento y la impresión pegada", "Solo sobre la impresión pegada"],
    correcta: 1,
    explicacion: "Fecha y Signum deben solapar papel + impresión, para que no se pueda sustituir la impresión sin que se note.",
  },
  {
    q: "Cada página de un anexo debe llevar en su cabecera...",
    opciones: ["Solo el número de página", "Código del documento, número de anexo, página/total páginas y fecha+Signum de quien lo añade", "Nada, basta con la portada del anexo"],
    correcta: 1,
    explicacion: "Cada página del anexo repite la identificación completa: no basta con identificar solo la primera página.",
  },
];

// ---------- Módulo 11: Letra ilegible ----------
const QUIZ_MODULO11 = [
  {
    q: "(Regla genérica GMP, pendiente de confirmar en el SOP completo) No puedes leer la letra de un compañero en un campo crítico. ¿Qué NO debes hacer nunca?",
    opciones: ["Preguntarle directamente qué escribió", "\"Adivinar\" el valor tú mismo y darlo por bueno sin más", "Documentarlo como pendiente de aclarar"],
    correcta: 1,
    explicacion: "Nunca se interpreta/adivina un dato ilegible. Se pregunta a quien lo escribió, o se documenta formalmente la aclaración.",
  },
  {
    q: "Si quien escribió el dato original ya no está disponible para preguntarle, ¿qué opciones tienes?",
    opciones: ["Dejarlo como está sin decir nada", "Nachtrag con prueba objetiva, o abrir una Abweichung si no hay prueba", "Corregirlo tú mismo según lo que \"probablemente\" dice"],
    correcta: 1,
    explicacion: "Mismo mecanismo que cualquier dato incierto: prueba objetiva → Nachtrag; sin prueba → Abweichung.",
  },
  {
    q: "¿Qué reduce en origen el riesgo de letra ilegible, según el SOP?",
    opciones: ["Usar solo bolígrafos/sellos azules o negros, dokumentenecht", "Escribir más rápido para no perder tiempo", "Usar lápiz para poder repasar luego"],
    correcta: 0,
    explicacion: "El propio requisito de bolígrafo/sello a prueba de manipulación (nunca lápiz/fineliner) ya reduce buena parte del problema.",
  },
];

const QUIZZES = {
  1: QUIZ_MODULO1,
  2: QUIZ_MODULO2,
  5: QUIZ_MODULO5,
  7: QUIZ_MODULO7,
  8: QUIZ_MODULO8,
  9: QUIZ_MODULO9,
  11: QUIZ_MODULO11,
};

// ---------- Módulo 4: Casillas marcadas mal ----------
const EJERCICIOS_MODULO4 = [
  {
    contexto: "Checklist de equipo utilizado. Se marcó la casilla equivocada.",
    opciones: ["Äkta Pilot #1624", "Äkta Pilot 600R #04305410"],
    marcadaIncorrecta: 0,
    correcta: 1,
    pista: 'Frase clave real usada en este caso: "Streichung Kästchen da falsch angekreuzt und Ergänzung neues Kästchen".',
    plantilla: "SF [fecha] [iniciales] — Streichung Kästchen da falsch angekreuzt und Ergänzung neues Kästchen",
    checklistExtra: [{ label: 'Menciona que se tachó la casilla equivocada y se marcó la nueva', test: (t) => /(Kästchen|casilla)/i.test(t) }],
  },
  {
    contexto: "Selección de sala para una prueba de line clearance. Se marcó la sala equivocada.",
    opciones: ["M-1.15", "M-1.28"],
    marcadaIncorrecta: 0,
    correcta: 1,
    pista: "Igual que con cualquier casilla: se tacha la marca incorrecta (sin borrar), se marca la correcta, y se documenta el motivo.",
    plantilla: "SF [fecha] [iniciales]",
    checklistExtra: [],
  },
];

// ---------- Ejercicios de escritura libre (Módulos 6, 10, 12) ----------
const ESCRITURA = {
  6: [
    {
      contexto: "Olvidaste anotar tu Kürzel en un paso de limpieza hace 3 meses. Puedes confirmarlo porque el mismo equipo aparece usado en un registro relacionado de esa fecha. Redacta el Nachtrag completo.",
      plantilla: "*1 Nachtrag: Kürzel [fecha] [iniciales] — Nachweis: siehe [documento relacionado]",
      checklist: [
        { label: "Incluye un signo de referencia (*1, *2...)", test: tieneVerweiszeichen },
        { label: "Incluye la palabra \"Nachtrag\"", test: (t) => /nachtrag/i.test(t) },
        { label: "Incluye fecha", test: tieneFecha },
        { label: "Incluye iniciales (Kürzel)", test: tieneIniciales },
        { label: "Hace referencia a la prueba objetiva (otro documento/registro)", test: tieneReferenciaDoc },
      ],
    },
    {
      contexto: "Faltan tus iniciales en un paso de hace 2 meses, pero esta vez NO tienes ninguna prueba objetiva de qué se hizo realmente. Redacta la anotación correspondiente.",
      plantilla: "Kein objektiver Nachweis vorhanden — Abweichung [código] eröffnet. [fecha] [iniciales]",
      checklist: [
        { label: "Menciona que no hay prueba objetiva disponible", test: (t) => /(kein.*nachweis|ohne nachweis|sin prueba)/i.test(t) },
        { label: "Menciona la apertura de una Abweichung/Quality Event", test: (t) => /(abweichung|quality event|dev-)/i.test(t) },
        { label: "Incluye fecha", test: tieneFecha },
        { label: "Incluye iniciales (Kürzel)", test: tieneIniciales },
      ],
    },
  ],
  10: [
    {
      contexto: "Una misma línea fue tachada el 12.08.2025. Esa tachadura se revocó el 03.09.2025 porque la línea hacía falta para el comentario 3). El 07.11.2025 se volvió a tachar. Redacta la nota que reconstruye toda la cronología en una sola frase, como exige el sistema.",
      plantilla: "Ursprüngliche Streichung am 12.08.2025 - Streichung gestrichen am 03.09.2025 für Kommentar 3) - Neue Streichung am 07.11.2025. 07.11.2025 [iniciales]",
      checklist: [
        { label: "Menciona la tachadura original (12.08.2025)", test: (t) => t.includes("12.08.2025") },
        { label: "Menciona la revocación (Streichung gestrichen / aufgehoben) del 03.09.2025", test: (t) => /(streichung gestrichen|streichung aufgehoben)/i.test(t) && t.includes("03.09.2025") },
        { label: "Menciona la nueva tachadura del 07.11.2025", test: (t) => t.includes("07.11.2025") },
        { label: "Incluye iniciales al final", test: tieneIniciales },
      ],
    },
    {
      contexto: "Una entrada fue tachada por error el mismo día que se escribió. Al revisarla más tarde, se determina que la tachadura no debía hacerse — el dato original era correcto. Redacta cómo se documenta esta revocación.",
      plantilla: "Streichung aufgehoben [fecha] [iniciales]",
      checklist: [
        { label: "Usa la expresión \"Streichung aufgehoben\"", test: (t) => /streichung aufgehoben/i.test(t) },
        { label: "Incluye fecha", test: tieneFecha },
        { label: "Incluye iniciales (Kürzel)", test: tieneIniciales },
      ],
    },
  ],
  12: [
    {
      contexto: "Simulacro 1/3 — Una fecha de caducidad se transcribió mal por error de escritura simple: escribiste \"1209.2025\" en vez de \"12.09.2025\". Redacta la corrección completa.",
      plantilla: "SF [fecha] [iniciales]",
      checklist: [
        { label: "Incluye fecha", test: tieneFecha },
        { label: "Incluye iniciales (Kürzel)", test: tieneIniciales },
        { label: "Indica el motivo \"SF\"", test: (t) => /\bSF\b/i.test(t) },
      ],
    },
    {
      contexto: "Simulacro 2/3 — Una pregunta previa se respondió \"Nein\", por lo que todo el bloque siguiente de instrucciones no aplica. Redacta cómo lo anulas y qué escribes junto a la \"Z\".",
      plantilla: "n.a. [fecha] [iniciales] — vorherige Frage mit \"Nein\" beantwortet",
      checklist: [
        { label: "Usa \"n.a.\"", test: (t) => /\bn\.a\.\b/i.test(t) },
        { label: "Incluye fecha", test: tieneFecha },
        { label: "Incluye iniciales (Kürzel)", test: tieneIniciales },
      ],
    },
    {
      contexto: "Simulacro 3/3 — Detectas que faltan tus iniciales en un paso de hace semanas, y sí tienes un registro relacionado que prueba qué se hizo. Redacta el Nachtrag.",
      plantilla: "*1 Nachtrag: Kürzel [fecha] [iniciales] — Nachweis: siehe [documento relacionado]",
      checklist: [
        { label: "Incluye un signo de referencia (*1, *2...)", test: tieneVerweiszeichen },
        { label: "Incluye la palabra \"Nachtrag\"", test: (t) => /nachtrag/i.test(t) },
        { label: "Incluye fecha", test: tieneFecha },
        { label: "Incluye iniciales (Kürzel)", test: tieneIniciales },
        { label: "Hace referencia a la prueba objetiva", test: tieneReferenciaDoc },
      ],
    },
  ],
};
