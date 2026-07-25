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
  { id: 0, titulo: "ALCOA + vocabulario base", desc: "Los 5 principios y el glosario núcleo.", tipo: "flashcards-quiz", estado: "disponible" },
  { id: 1, titulo: "Escribir bien desde el origen", desc: "Bolígrafo, contemporaneidad, prohibido \"dito\"/comillas, i.A.", tipo: "proximamente", estado: "proximamente" },
  { id: 2, titulo: "Interpretación de instrucciones", desc: "\"¿Qué harías?\" ante un bloque real en alemán.", tipo: "proximamente", estado: "proximamente" },
  { id: 3, titulo: "Corrección simple (tachado + SF)", desc: "Tachar, escribir el valor correcto y redactar la Bemerkung.", tipo: "correccion", estado: "disponible" },
  { id: 4, titulo: "Casillas marcadas mal", desc: "Simulación visual de casilla incorrecta.", tipo: "proximamente", estado: "proximamente" },
  { id: 5, titulo: "Anulación de secciones (Entwertung)", desc: "Cuándo aplica \"n.a.\"/\"Z\" y cuándo no.", tipo: "proximamente", estado: "proximamente" },
  { id: 6, titulo: "Nachträge (entradas tardías)", desc: "Prueba objetiva o apertura de Abweichung.", tipo: "proximamente", estado: "proximamente" },
  { id: 7, titulo: "¿Hace falta una segunda firma?", desc: "4-Augen-Prinzip condicional.", tipo: "proximamente", estado: "proximamente" },
  { id: 8, titulo: "Redondeo de valores numéricos", desc: "Regla oficial, sin redondeo en cascada.", tipo: "proximamente", estado: "proximamente" },
  { id: 9, titulo: "Pegado de anexos e impresiones", desc: "Cinta, papel térmico, firma solapando.", tipo: "proximamente", estado: "proximamente" },
  { id: 10, titulo: "Casos combinados / cadenas", desc: "Revocación de una revocación, y similares.", tipo: "proximamente", estado: "proximamente" },
  { id: 11, titulo: "Letra ilegible", desc: "Pendiente de confirmar regla exacta en el SOP.", tipo: "proximamente", estado: "proximamente" },
  { id: 12, titulo: "Simulacro integrado", desc: "Una página completa con varios errores mezclados.", tipo: "proximamente", estado: "proximamente" },
];
