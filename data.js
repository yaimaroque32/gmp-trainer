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

// Chuleta de frases de arranque en alemán, organizada por situación real. Consultable en cualquier momento.
const FRASES_UTILES = [
  {
    categoria: "Corrección simple de un dato (fecha, texto, número)",
    imagen: "img/ejemplo-correccion-simple.svg",
    frases: [
      { formula: "SF [fecha] [iniciales]", cuando: "Error de escritura o de sello simple. No hace falta explicación ni prueba objetiva." },
    ],
  },
  {
    categoria: "Corrección de una casilla marcada mal",
    imagen: "img/ejemplo-casilla.svg",
    frases: [
      {
        formula: "SF [fecha] [iniciales] — Streichung Kästchen da falsch angekreuzt und Ergänzung neues Kästchen",
        cuando: "Se marcó la casilla equivocada. Nunca se anula con \"Z\" — se tacha la marca y se marca la correcta, igual que cualquier SF.",
      },
    ],
  },
  {
    categoria: "Anulación de una sección completa que no aplica",
    imagen: "img/ejemplo-anulacion.svg",
    frases: [
      { formula: "n.a. [fecha] [iniciales]", cuando: "El bloque entero no aplica a esta ejecución (p. ej. porque una pregunta previa fue \"Nein\"). Se traza una \"Z\" que cubra todo el bloque, sin dejar huecos." },
    ],
  },
  {
    categoria: "Nachtrag — olvidaste anotar algo en el momento",
    imagen: "img/ejemplo-nachtrag.svg",
    frases: [
      { formula: "*1 Nachtrag: Kürzel [fecha] [iniciales]", cuando: "Solo faltaba tu firma/iniciales, el resto del dato ya estaba anotado." },
      {
        formula: "*1 [dato añadido] nachtrag [fecha] [iniciales]. [prueba objetiva, ej: Die selben Geräte wurden am ... verwendet].",
        cuando: "Faltaba un dato completo, pero puedes probarlo con otro registro/documento relacionado.",
      },
      {
        formula: "*1 [Nombre] vergessen einzutragen. Nachtrag durch [tus iniciales] auf Grundlage der Informationen von Seite [X] am [fecha] erfolgt.",
        cuando: "Reconstruyes el Nachtrag de otra persona, a partir de información que ya está en el propio documento.",
      },
      {
        formula: "Kein objektiver Nachweis vorhanden — Abweichung [código] eröffnet. [fecha] [iniciales]",
        cuando: "No tienes ninguna prueba objetiva del dato que falta. No se puede hacer Nachtrag \"a ciegas\": se abre una Abweichung.",
      },
    ],
  },
  {
    categoria: "Revocar una tachadura hecha por error",
    imagen: "img/ejemplo-revocacion.svg",
    frases: [
      { formula: "Streichung aufgehoben [fecha] [iniciales]", cuando: "Se tachó algo que en realidad no debía tacharse. Nunca se borra la tachadura original, se anota que queda sin efecto." },
    ],
  },
  {
    categoria: "Cadena de varias correcciones sobre el mismo dato",
    imagen: "img/ejemplo-cadena.svg",
    frases: [
      {
        formula: "Ursprüngliche Streichung am [fecha1] - Streichung gestrichen am [fecha2] für [motivo] - Neue Streichung am [fecha3]. [fecha3] [iniciales]",
        cuando: "Ha habido varios eventos (tachar/revocar/volver a tachar) sobre la misma línea. Se cuentan todos en orden cronológico, en una sola frase.",
      },
    ],
  },
  {
    categoria: "Problema de equipo, alarma o fallo durante el proceso",
    imagen: "img/ejemplo-alarma.svg",
    frases: [
      {
        formula: "Streichung da [pasos] aufgrund von [causa, ej: Stromausfall/Alarm/blockierte Kassette] nicht durchführbar war. [fecha] [iniciales]",
        cuando: "Uno o varios pasos no se pudieron ejecutar por un problema técnico (corte de luz, alarma, equipo bloqueado...).",
      },
      {
        formula: "[Alarm/Störung] während AS [X] aufgetreten, Schritt konnte nicht wie vorgesehen durchgeführt werden. [fecha] [iniciales]",
        cuando: "Salta una alarma (p. ej. de presión) durante un paso concreto y no se puede completar tal como estaba previsto.",
      },
    ],
  },
  {
    categoria: "Sustitución de un equipo por otro equivalente",
    imagen: "img/ejemplo-sustitucion.svg",
    frases: [
      {
        formula: "Es wird das baugleiche Gerät [X] statt [Y] verwendet, s. CR-[número]. [fecha] [iniciales]",
        cuando: "Se usa un equipo distinto pero del mismo modelo/construcción, normalmente amparado por un Change Request ya aprobado.",
      },
    ],
  },
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
    contexto: "Campo de fecha en un registro de lote. El valor escrito es imposible (no existe el día 32) — la fecha real de ese paso, confirmada en el resto del documento, fue el 23.04.2025.",
    valorOriginal: "32.04.2025",
    valorCorrecto: "23.04.2025",
    pista: "Típico error de escritura: escribe el valor correcto (23.04.2025) al lado del tachado.",
    motivoEsperado: "SF",
    plantilla: "SF [fecha] [iniciales]",
  },
  {
    id: "ej2",
    contexto: "Cantidad de un componente en la tabla de materiales (unidades de tampón preparado). El operador transcribió mal la cantidad: escribió 36, pero la cantidad realmente utilizada, confirmada en el registro de consumo, fue 5.",
    valorOriginal: "36",
    valorCorrecto: "5",
    pista: "Error de escritura simple: escribe el valor correcto (5) al lado del tachado.",
    motivoEsperado: "SF",
    plantilla: "SF [fecha] [iniciales]",
  },
  {
    id: "ej3",
    contexto: "Código de Quality Event anotado en la portada del registro de lote. El registro relacionado H-MBR-000582 confirma que el código correcto es DEV-06920 (no DEV-06936, que fue lo que se escribió aquí por error).",
    valorOriginal: "DEV-06936",
    valorCorrecto: "DEV-06920",
    pista: "Esto NO es un simple error de escritura (el código completo se cambia, no es un despiste de tecleo): necesitas explicar la causa y remitir a la prueba objetiva (el H-MBR-000582), no basta con \"SF\".",
    motivoEsperado: "explicacion",
    plantilla: "[explicación de la causa] [referencia a la prueba objetiva] [fecha] [iniciales]",
  },
  {
    id: "ej4",
    contexto: "Número de inventario de una cánula anotado en un formulario de equipos. El valor escrito fue \"5604\" por error de transcripción — el número de inventario real de la cánula usada, según la etiqueta del equipo, es \"04305970\".",
    valorOriginal: "5604",
    valorCorrecto: "04305970",
    pista: "Error de escritura simple: escribe el número correcto (04305970) al lado del tachado.",
    motivoEsperado: "SF",
    plantilla: "SF [fecha] [iniciales]",
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
  {
    q: "Tachas un valor solo porque estaba mal escrito a mano y costaba leerlo, pero el dato en sí era correcto (no cambia el valor). ¿Hace falta documentarlo igualmente?",
    opciones: [
      "No, si el valor no cambia no hace falta anotar nada",
      "Sí — hay que aclarar que el tachado fue solo por legibilidad, no una corrección de dato, con fecha e iniciales",
      "Solo si lo revisa calidad más adelante",
    ],
    correcta: 1,
    explicacion: 'Caso real encontrado: "Nachträglich wird vermerkt, dass die Streichung nur für bessere Lesbarkeit ergänzt wurde" — hay que distinguir explícitamente un tachado "solo por legibilidad" de una corrección real de dato, para que nadie lo confunda después. Ambos casos se firman y fechan igual, pero el motivo escrito es distinto.',
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
  {
    q: "Un resultado de laboratorio (p. ej. TOC) llega varias semanas después de ejecutado el paso, y se rellena la tabla en cuanto llega el resultado. ¿Hace falta marcarlo como \"Nachtrag\"?",
    opciones: ["Sí, cualquier dato añadido después siempre es un Nachtrag", "No — si el dato no podía existir antes (depende de un resultado externo), es el flujo normal, no un Nachtrag", "Solo si han pasado más de 30 días"],
    correcta: 1,
    explicacion: 'Caso real del workshop: "kein Nachtrag da Auswertung nicht vorher durchgeführt werden konnte" — si la evaluación no se podía haber hecho antes, rellenarla en cuanto llega no es un Nachtrag (que es para algo que SÍ se podía anotar en el momento y no se hizo).',
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
    contexto: "Checklist de equipo utilizado. Se marcó por error la casilla \"Äkta Pilot #1624\", pero el equipo realmente usado en este paso fue el \"Äkta Pilot 600R #04305410\".",
    opciones: ["Äkta Pilot #1624", "Äkta Pilot 600R #04305410"],
    marcadaIncorrecta: 0,
    correcta: 1,
    pista: 'Frase clave real usada en este caso: "Streichung Kästchen da falsch angekreuzt und Ergänzung neues Kästchen".',
    plantilla: "SF [fecha] [iniciales] — Streichung Kästchen da falsch angekreuzt und Ergänzung neues Kästchen",
    checklistExtra: [{ label: 'Menciona que se tachó la casilla equivocada y se marcó la nueva', test: (t) => /(Kästchen|casilla)/i.test(t) }],
  },
  {
    contexto: "Selección de sala para una prueba de line clearance. Se marcó por error \"M-1.15\", pero la prueba se hizo realmente en la sala \"M-1.28\".",
    opciones: ["M-1.15", "M-1.28"],
    marcadaIncorrecta: 0,
    correcta: 1,
    pista: "Igual que con cualquier casilla: se tacha la marca incorrecta (sin borrar), se marca la correcta, y se documenta el motivo.",
    plantilla: "SF [fecha] [iniciales]",
    checklistExtra: [],
  },
  {
    contexto: "Selección de balanza. Se marcó por error la \"Waage Inv.-Nr. 1743\", pero la balanza realmente utilizada fue la \"Waage Inv.-Nr. 1802\".",
    opciones: ["Waage Inv.-Nr. 1743", "Waage Inv.-Nr. 1802"],
    marcadaIncorrecta: 0,
    correcta: 1,
    pista: "Recuerda: NO se anula con una \"Z\" — esa es solo para secciones enteras (Módulo 5). Una sola casilla mal marcada se corrige tachando la marca + SF + marcando la correcta.",
    plantilla: "SF [fecha] [iniciales]",
    checklistExtra: [],
  },
  {
    contexto: "Selección de pH-metro. Se marcó por error el \"pH-Meter Inv.-Nr. 2201\", pero el equipo realmente calibrado y usado fue el \"pH-Meter Inv.-Nr. 2245\".",
    opciones: ["pH-Meter Inv.-Nr. 2201", "pH-Meter Inv.-Nr. 2245"],
    marcadaIncorrecta: 0,
    correcta: 1,
    pista: "Mismo patrón de siempre: tachar la marca equivocada (sin borrar) + SF + fecha + iniciales, y marcar la casilla correcta.",
    plantilla: "SF [fecha] [iniciales]",
    checklistExtra: [],
  },
];

// Explicaciones guiadas mostradas antes del primer ejercicio de un módulo.
const INTROS = {
  4: {
    titulo: 'Antes de empezar: ¿"Z" o corrección simple?',
    texto:
      'Es la duda más frecuente en este módulo, y la respuesta es clara: la "Z" (Entwertung) NUNCA se usa para una sola casilla marcada mal. El SOP lo dice explícitamente (2.3.6): "Entwertungen bei einer eindeutigen Auswahlantwort (z.B. Ja oder Nein) sind nicht vorzunehmen" — no se anulan respuestas de selección claras. La "Z" es solo para anular una SECCIÓN COMPLETA que no aplica a esta ejecución (eso lo practicas en el Módulo 5).\n\nUna casilla individual mal marcada se corrige exactamente igual que cualquier otro error simple: tachas la marca incorrecta (sin borrar, se debe seguir viendo), marcas la casilla correcta, y documentas fecha + iniciales + "SF". Es el mismo patrón del Módulo 3, aplicado a una casilla en vez de a un texto o una fecha.\n\n¿Y si la opción correcta no tiene ya su propia casilla impresa en el formulario? Caso real (workshop, diapositiva 16): "Streichung Kästchen da falsch angekreuzt und Ergänzung neues Kästchen" (se tachó la casilla marcada por error, y se AÑADIÓ una casilla nueva). Es decir: dibujas tú mismo un cuadradito a mano junto al valor correcto y lo marcas, con el mismo tachar+SF+fecha+iniciales de siempre. Si la opción correcta SÍ ya está impresa como casilla (como en los ejercicios de aquí abajo), simplemente la marcas, sin dibujar nada.',
    imagen: "img/ejemplo-casilla.svg",
    imagenAlt: "Ejemplo recreado (datos ficticios): casilla marcada por error tachada, y casilla nueva añadida a mano para la opción correcta",
  },
  6: {
    titulo: "Antes de empezar: la fórmula de un Nachtrag",
    texto:
      'Un Nachtrag es simplemente: "algo que debía anotarse en el momento, y no se hizo". El SOP (2.3.4) exige siempre estos 5 elementos, en este orden:\n\n1) Anotas el dato que faltaba.\n2) Pones un signo de referencia (*1, *2... — único en la página).\n3) En el punto de esa referencia: fecha + iniciales de quien hace el Nachtrag.\n4) Una explicación: qué se añade y por qué es correcto (citando la prueba objetiva — otro documento, registro o dato que lo confirme).\n5) Fecha + iniciales otra vez, junto a la explicación.\n\nSi NO tienes ninguna prueba objetiva de que lo que añades es correcto, no puedes hacer un Nachtrag "a ciegas" — hay que abrir una Abweichung (desviación).\n\nFórmula mental para no bloquearte: "*[n] Nachtrag: [qué faltaba] [fecha] [iniciales] — Nachweis: [dónde está la prueba]". Practica rellenando esa fórmula con los datos de cada caso; no hace falta alemán elaborado, es un formato casi telegráfico.\n\n¿Y si la explicación es demasiado larga para el margen? Se usa el formulario aparte "Formblatt für Bemerkungen" (H-FRM-000645), como anexo — con doble firma (Ersteller/Prüfer). En la página original solo dejas la referencia (*n) apuntando a ese anexo. Aparece así en prácticamente todos tus documentos.\n\nConsejo: en la página de "Frases útiles" (desde el panel principal) tienes 3 variantes de Nachtrag ya redactadas para adaptar directamente.',
    imagen: "img/ejemplo-nachtrag.svg",
    imagenAlt: "Ejemplo recreado (datos ficticios): signo de referencia *1 enlazando con la explicación del Nachtrag en el campo de Bemerkungen",
  },
  10: {
    titulo: "Antes de empezar: ¿qué es una \"cadena\"?",
    texto:
      "Una cadena no es más que varias correcciones sucesivas sobre el MISMO dato o la MISMA línea, ocurridas en fechas distintas. Cada evento (tachar, revocar una tachadura, volver a tachar...) se resume en UNA sola frase final, contando los eventos en orden cronológico, cada uno con su propia fecha.\n\nFórmula: \"[Evento 1 + fecha1] - [Evento 2 + fecha2] - [Evento 3 + fecha3]. [fecha del resumen] [iniciales]\".\n\nEjemplo real desglosado paso a paso:\n• Evento 1 (12.08.2025): se tachó una línea → \"Ursprüngliche Streichung am 12.08.2025\"\n• Evento 2 (03.09.2025): esa tachadura se revierte porque hacía falta la línea → \"Streichung gestrichen am 03.09.2025 für Kommentar 3)\"\n• Evento 3 (07.11.2025): se vuelve a tachar → \"Neue Streichung am 07.11.2025\"\n• Cierre: \"07.11.2025 [iniciales]\"\n\nUnidos en una sola frase: \"Ursprüngliche Streichung am 12.08.2025 - Streichung gestrichen am 03.09.2025 für Kommentar 3) - Neue Streichung am 07.11.2025. 07.11.2025 [iniciales]\".\n\nEste módulo también incluye casos de problemas de equipo (alarmas, fallos) — el mismo principio aplica: cuenta qué pasó, qué hiciste en su lugar, y cierra con fecha + iniciales.",
    imagen: "img/ejemplo-cadena.svg",
    imagenAlt: "Ejemplo recreado (datos ficticios): línea de tiempo con los tres eventos de la cadena y la frase resumen final",
  },
};

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
    {
      contexto: "Caso real: en la sección de equipos no anotaste en el momento cuáles se usaron. Semanas después haces el Nachtrag, y puedes confirmarlo porque en un registro relacionado (AS 8.1-8.6) consta que se usaron los mismos equipos el mismo día. Además, un segundo compañero confirma tu Nachtrag más tarde. Redacta tu parte (la del Nachtrag, no la confirmación del compañero).",
      plantilla: "*1 siehe [referencia] nachtrag [fecha] [iniciales]. Die selben Geräte wurden am [fecha del uso real] verwendet.",
      checklist: [
        { label: "Incluye un signo de referencia (*1, *2...)", test: tieneVerweiszeichen },
        { label: "Incluye la palabra \"Nachtrag\"", test: (t) => /nachtrag/i.test(t) },
        { label: "Incluye fecha", test: tieneFecha },
        { label: "Incluye iniciales (Kürzel)", test: tieneIniciales },
        { label: "Explica en qué se basa la reconstrucción (misma prueba/registro/equipo)", test: (t) => /(selben|gleichen|dieselbe|verwendet|siehe)/i.test(t) },
      ],
    },
    {
      contexto: "Un compañero (iniciales JS) olvidó anotar cuándo se colocó el cartel de \"Kampagnenvorbereitung\" en la puerta de la sala. Tú (iniciales MiH) reconstruyes el dato varias semanas después a partir de la información de otra página del mismo documento. Redacta el Nachtrag — recuerda que quien hace el Nachtrag puede ser una persona distinta de quien debía anotarlo originalmente.",
      plantilla: "*1 [quién] vergessen einzutragen. Nachtrag durch [tus iniciales] auf Grundlage der Informationen von Seite [X] am [fecha] erfolgt.",
      checklist: [
        { label: "Incluye un signo de referencia (*1, *2...)", test: tieneVerweiszeichen },
        { label: "Incluye la palabra \"Nachtrag\"", test: (t) => /nachtrag/i.test(t) },
        { label: "Menciona que fue otra persona la que se olvidó de anotarlo", test: (t) => /(vergessen|olvid)/i.test(t) },
        { label: "Incluye fecha", test: tieneFecha },
        { label: "Incluye iniciales (Kürzel)", test: tieneIniciales },
      ],
    },
    {
      contexto: "El Nachtrag que tienes que redactar es largo (necesitas explicar varios datos de trazabilidad de un tampón) y no cabe en el campo Bemerkungen de la página. Tienes que usar el formulario dedicado H-FRM-000645 (\"Formblatt für Bemerkungen\") como anexo. Redacta la referencia que dejas en el campo Bemerkungen de la página original, remitiendo a ese anexo.",
      plantilla: "*1 siehe Formblatt für Bemerkungen (H-FRM-000645), Anhang 2. [fecha] [iniciales]",
      checklist: [
        { label: "Incluye un signo de referencia (*1, *2...)", test: tieneVerweiszeichen },
        { label: "Menciona el \"Formblatt für Bemerkungen\" (o su código H-FRM-000645)", test: (t) => /(formblatt|h-frm-000645|h-frm-00645)/i.test(t) },
        { label: "Indica a qué anexo remite", test: (t) => /anhang/i.test(t) },
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
    {
      contexto: "Problema de equipo real: durante la producción, el cassette de filtración se bloqueó. Por eso el producto tuvo que descargarse por un paso distinto al previsto (paso 12.6.1 en vez del habitual). Como consecuencia, cuando llegaste al paso de vaciado que normalmente se hace primero (13.3.1), el sistema ya estaba vacío — así que los pasos 13.3.1 a 13.3.3 quedan sin efecto y continúas directamente en 13.3.4. Redacta la Bemerkung completa explicando qué pasó y qué hiciste.",
      plantilla: "Kassette blockiert, Produktabgabe über 12.6.1 statt vorgesehenem Schritt erfolgt. Dadurch AS 13.3.1-13.3.3 gestrichen, System bereits leer, weiter mit 13.3.4. [fecha] [iniciales]",
      checklist: [
        { label: "Explica la causa del problema (cassette bloqueado)", test: (t) => /(kassette|blockiert|bloque)/i.test(t) },
        { label: "Menciona el paso alternativo realmente usado (12.6.1)", test: (t) => t.includes("12.6.1") },
        { label: "Indica qué pasos quedan sin efecto (gestrichen)", test: (t) => /gestrichen/i.test(t) },
        { label: "Incluye fecha", test: tieneFecha },
        { label: "Incluye iniciales (Kürzel)", test: tieneIniciales },
      ],
    },
    {
      contexto: "Durante la ejecución de un paso, salta una alarma de presión (Druckalarm) en el equipo y no puedes completar el paso tal como estaba previsto en la instrucción. Redacta la Bemerkung explicando el evento, de forma breve y factual (recuerda: nada de \"creo que\" — solo hechos).",
      plantilla: "Druckalarm während AS [X] aufgetreten, Schritt konnte nicht wie vorgesehen durchgeführt werden. [fecha] [iniciales]",
      checklist: [
        { label: "Menciona el tipo de evento (Alarm/Druckalarm/Störung)", test: (t) => /(alarm|störung|fehler)/i.test(t) },
        { label: "Indica que el paso no se pudo ejecutar como estaba previsto", test: (t) => /(nicht|konnte)/i.test(t) },
        { label: "Incluye fecha", test: tieneFecha },
        { label: "Incluye iniciales (Kürzel)", test: tieneIniciales },
      ],
    },
    {
      contexto: "Caso real: el reloj (Uhr) previsto para un paso era el conjunto \"4424+4422\", pero solo estaba disponible el \"4424\", que es del mismo modelo/construcción (baugleich). Se usa este último, amparado por un Change Request ya aprobado (CR-00925). Redacta la Bemerkung explicando la sustitución.",
      plantilla: "Es wird das baugleiche Gerät Uhr 4424 statt 4424+4422 verwendet, s. CR-00925. [fecha] [iniciales]",
      checklist: [
        { label: "Menciona que el equipo es \"baugleich\" (mismo modelo/construcción)", test: (t) => /baugleich/i.test(t) },
        { label: "Indica el equipo previsto y el usado", test: (t) => t.includes("4424")},
        { label: "Hace referencia al Change Request (CR-XXXXX)", test: (t) => /cr-?\s?\d+/i.test(t) },
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
