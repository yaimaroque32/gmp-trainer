// GMP Trainer — lógica de la app. Vanilla JS, sin dependencias, todo el estado en localStorage.

const app = document.getElementById("app");
const STORAGE_KEY = "gmp_trainer_progress_v1";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
function setModuleResult(id, data) {
  const p = loadProgress();
  p[id] = { ...(p[id] || {}), ...data };
  saveProgress(p);
}

function navigate(hash) {
  window.location.hash = hash;
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);

function render() {
  const hash = window.location.hash || "#/";
  window.scrollTo(0, 0);
  if (hash === "#/") return renderDashboard();
  if (hash === "#/glosario") return renderGlosario();
  if (hash === "#/ajustes") return renderAjustes();
  const mMod = hash.match(/^#\/modulo\/(\d+)/);
  if (mMod) {
    const id = Number(mMod[1]);
    const m = MODULOS.find((x) => x.id === id);
    if (!m || m.estado !== "disponible") return renderProximamente(id);
    if (m.tipo === "modulo0") return renderModulo0();
    if (m.tipo === "correccion") return renderModulo3();
    if (m.tipo === "casillas") return renderModulo4();
    if (m.tipo === "quiz") return renderQuizModulo(id);
    if (m.tipo === "escritura") return renderEscrituraModulo(id);
    return renderProximamente(id);
  }
  renderDashboard();
}

function el(tag, attrs, children) {
  const e = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
  }
  (children || []).forEach((c) => {
    if (c == null) return;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return e;
}

function header(title, back, rightEl) {
  const h = el("header", { class: "topbar" }, [
    back
      ? el("button", { class: "iconbtn", onclick: () => navigate("#/") }, ["←"])
      : el("div", { class: "iconbtn-spacer" }),
    el("h1", null, [title]),
    rightEl || el("div", { class: "iconbtn-spacer" }),
  ]);
  return h;
}

// ---------- Ajustes (configuración del corrector de IA) ----------
function getAIConfig() {
  return {
    endpoint: localStorage.getItem("gmp_ai_endpoint") || "",
    secret: localStorage.getItem("gmp_ai_secret") || "",
  };
}
function setAIConfig(endpoint, secret) {
  localStorage.setItem("gmp_ai_endpoint", endpoint);
  localStorage.setItem("gmp_ai_secret", secret);
}

function renderAjustes() {
  const cfg = getAIConfig();
  app.innerHTML = "";
  app.appendChild(header("Ajustes", true));
  const main = el("main", { class: "container" });
  main.appendChild(
    el("p", { class: "muted" }, [
      "Configura aquí tu propio corrector de gramática con IA (un Cloudflare Worker que tú mismo despliegas). Estos datos se guardan solo en este dispositivo — nunca se suben a ningún sitio ni se comparten conmigo.",
    ])
  );
  main.appendChild(el("label", { class: "fieldlabel" }, ["URL del Worker"]));
  const inputUrl = el("input", { class: "textinput", value: cfg.endpoint, placeholder: "https://tu-worker.tu-usuario.workers.dev" });
  main.appendChild(inputUrl);
  main.appendChild(el("label", { class: "fieldlabel" }, ["Clave de la app (App Secret)"]));
  const inputSecret = el("input", { class: "textinput", type: "password", value: cfg.secret, placeholder: "La misma que pusiste en el Worker" });
  main.appendChild(inputSecret);
  main.appendChild(
    el(
      "button",
      {
        class: "primarybtn",
        onclick: () => {
          setAIConfig(inputUrl.value.trim(), inputSecret.value.trim());
          navigate("#/");
        },
      },
      ["Guardar"]
    )
  );
  app.appendChild(main);
}

// ---------- Panel de revisión gramatical con IA (reutilizable) ----------
async function solicitarRevisionIA(texto, contexto, container) {
  const cfg = getAIConfig();
  container.innerHTML = "";
  if (!cfg.endpoint) {
    container.appendChild(
      el("p", { class: "hint" }, ["Configura el corrector de IA en Ajustes (⚙, desde el panel principal) para activar esta función."])
    );
    return;
  }
  if (!texto.trim()) {
    container.appendChild(el("p", { class: "hint" }, ["Escribe algo en la Bemerkung antes de pedir la revisión."]));
    return;
  }
  container.appendChild(el("p", { class: "muted" }, ["Consultando corrección con IA..."]));
  try {
    const res = await fetch(cfg.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-App-Secret": cfg.secret },
      body: JSON.stringify({ texto, contexto }),
    });
    const raw = await res.text();
    let data = null;
    try {
      data = JSON.parse(raw);
    } catch (e) {}
    container.innerHTML = "";
    if (!res.ok || !data || data.error) {
      container.appendChild(el("div", { class: "checkitem ko" }, ["No se pudo obtener la corrección — revisa la configuración en Ajustes."]));
      return;
    }
    if (data.comentario_general) {
      container.appendChild(el("div", { class: "explicacion" }, [data.comentario_general]));
    }
    (data.errores || []).forEach((er) => {
      container.appendChild(
        el("div", { class: "checkitem ko" }, [`✗ "${er.original}" → "${er.correccion}" — ${er.explicacion}`])
      );
    });
    if (data.errores && data.errores.length === 0) {
      container.appendChild(el("div", { class: "checkitem ok" }, ["✓ Sin errores gramaticales detectados"]));
    }
    if (data.version_mejorada) {
      container.appendChild(
        el("div", { class: "card" }, [el("p", { class: "muted" }, ["Versión sugerida:"]), el("p", null, [data.version_mejorada])])
      );
    }
  } catch (e) {
    container.innerHTML = "";
    container.appendChild(el("div", { class: "checkitem ko" }, ["Error de conexión con el corrector de IA."]));
  }
}

function botonRevisionIA(getTexto, getContexto) {
  const aiContainer = el("div", { class: "ai-panel" });
  const btn = el(
    "button",
    { class: "secondarybtn", onclick: () => solicitarRevisionIA(getTexto(), getContexto(), aiContainer) },
    ["✨ Revisar gramática con IA"]
  );
  const wrap = el("div", null, [btn, aiContainer]);
  return wrap;
}

// ---------- Dashboard ----------
function renderDashboard() {
  const progress = loadProgress();
  const disponibles = MODULOS.filter((m) => m.estado === "disponible");
  const completados = disponibles.filter((m) => progress[m.id] && progress[m.id].completado).length;
  const pct = disponibles.length ? Math.round((completados / disponibles.length) * 100) : 0;

  app.innerHTML = "";
  app.appendChild(header("GMP Trainer", false, el("button", { class: "iconbtn", onclick: () => navigate("#/ajustes") }, ["⚙"])));

  const main = el("main", { class: "container" });

  main.appendChild(
    el("div", { class: "progresswrap" }, [
      el("div", { class: "progresslabel" }, [`Progreso: ${completados}/${disponibles.length} módulos disponibles`]),
      el("div", { class: "progressbar" }, [el("div", { class: "progressfill", style: `width:${pct}%` })]),
    ])
  );

  main.appendChild(
    el("button", { class: "linkbtn", onclick: () => navigate("#/glosario") }, ["📖 Ver glosario completo"])
  );

  const list = el("div", { class: "modulelist" });
  MODULOS.forEach((m) => {
    const p = progress[m.id];
    const disponible = m.estado === "disponible";
    const badge = !disponible
      ? el("span", { class: "badge badge-soon" }, ["Próximamente"])
      : p && p.completado
      ? el("span", { class: "badge badge-done" }, [`✓ ${p.scoreLabel || "Completado"}`])
      : el("span", { class: "badge badge-todo" }, ["Empezar"]);

    const card = el(
      "div",
      {
        class: "modulecard" + (disponible ? "" : " disabled"),
        onclick: disponible ? () => navigate(`#/modulo/${m.id}`) : null,
      },
      [
        el("div", { class: "modulecard-top" }, [
          el("span", { class: "modulenum" }, [`Módulo ${m.id}`]),
          badge,
        ]),
        el("h3", null, [m.titulo]),
        el("p", null, [m.desc]),
      ]
    );
    list.appendChild(card);
  });
  main.appendChild(list);
  app.appendChild(main);
}

function renderProximamente(id) {
  const m = MODULOS.find((x) => x.id === id);
  app.innerHTML = "";
  app.appendChild(header(m ? m.titulo : "Módulo", true));
  const main = el("main", { class: "container" });
  main.appendChild(
    el("div", { class: "card center" }, [
      el("p", null, ["🚧 Este módulo todavía no está disponible."]),
      el("p", { class: "muted" }, ["Se irá añadiendo módulo a módulo. Mientras tanto puedes repasar el Módulo 0 o practicar el Módulo 3."]),
      el("button", { class: "primarybtn", onclick: () => navigate("#/") }, ["Volver al panel"]),
    ])
  );
  app.appendChild(main);
}

// ---------- Glosario ----------
function renderGlosario() {
  app.innerHTML = "";
  app.appendChild(header("Glosario", true));
  const main = el("main", { class: "container" });
  const searchWrap = el("input", {
    class: "search",
    placeholder: "Buscar término...",
    oninput: (e) => filterGlosario(e.target.value),
  });
  main.appendChild(searchWrap);
  const table = el("div", { class: "glosario", id: "glosario-list" });
  GLOSARIO.forEach((g) => {
    table.appendChild(
      el("div", { class: "glositem" }, [
        el("div", { class: "glide" }, [g.de]),
        el("div", { class: "glies" }, [g.es]),
      ])
    );
  });
  main.appendChild(table);
  app.appendChild(main);
}
function filterGlosario(q) {
  const query = q.trim().toLowerCase();
  const container = document.getElementById("glosario-list");
  container.innerHTML = "";
  GLOSARIO.filter(
    (g) => g.de.toLowerCase().includes(query) || g.es.toLowerCase().includes(query)
  ).forEach((g) => {
    container.appendChild(
      el("div", { class: "glositem" }, [
        el("div", { class: "glide" }, [g.de]),
        el("div", { class: "glies" }, [g.es]),
      ])
    );
  });
}

// ---------- Módulo 0: ALCOA + vocabulario ----------
let mod0State = { fase: "flashcards", cardIndex: 0, flipped: false, quizIndex: 0, score: 0, respondida: false };

function renderModulo0() {
  mod0State = { fase: "flashcards", cardIndex: 0, flipped: false, quizIndex: 0, score: 0, respondida: false };
  drawModulo0();
}

function drawModulo0() {
  app.innerHTML = "";
  app.appendChild(header("Módulo 0 · ALCOA", true));
  const main = el("main", { class: "container" });

  if (mod0State.fase === "flashcards") {
    const c = ALCOA[mod0State.cardIndex];
    const flash = el(
      "div",
      { class: "flashcard" + (mod0State.flipped ? " flipped" : ""), onclick: () => { mod0State.flipped = !mod0State.flipped; drawModulo0(); } },
      [
        el("div", { class: "flashcard-inner" }, [
          el("div", { class: "flashcard-face front" }, [
            el("div", { class: "letragrande" }, [c.letra]),
            el("div", null, [c.de]),
          ]),
          el("div", { class: "flashcard-face back" }, [el("p", null, [c.es])]),
        ]),
      ]
    );
    main.appendChild(el("p", { class: "muted center" }, [`Tarjeta ${mod0State.cardIndex + 1} de ${ALCOA.length} · toca para girar`]));
    main.appendChild(flash);
    const nav = el("div", { class: "navrow" }, [
      el(
        "button",
        {
          class: "secondarybtn",
          disabled: mod0State.cardIndex === 0 ? "true" : null,
          onclick: () => { if (mod0State.cardIndex > 0) { mod0State.cardIndex--; mod0State.flipped = false; drawModulo0(); } },
        },
        ["Anterior"]
      ),
      mod0State.cardIndex < ALCOA.length - 1
        ? el("button", { class: "primarybtn", onclick: () => { mod0State.cardIndex++; mod0State.flipped = false; drawModulo0(); } }, ["Siguiente"])
        : el("button", { class: "primarybtn", onclick: () => { mod0State.fase = "quiz"; drawModulo0(); } }, ["Empezar el quiz →"]),
    ]);
    main.appendChild(nav);
  } else if (mod0State.fase === "quiz") {
    const q = QUIZ_MODULO0[mod0State.quizIndex];
    main.appendChild(el("p", { class: "muted center" }, [`Pregunta ${mod0State.quizIndex + 1} de ${QUIZ_MODULO0.length}`]));
    main.appendChild(el("div", { class: "card" }, [el("h3", null, [q.q])]));

    const opciones = el("div", { class: "opciones" });
    q.opciones.forEach((op, i) => {
      let cls = "opcion";
      if (mod0State.respondida) {
        if (i === q.correcta) cls += " correcta";
        else if (i === mod0State.elegida) cls += " incorrecta";
      }
      opciones.appendChild(
        el(
          "button",
          {
            class: cls,
            onclick: () => {
              if (mod0State.respondida) return;
              mod0State.respondida = true;
              mod0State.elegida = i;
              if (i === q.correcta) mod0State.score++;
              drawModulo0();
            },
          },
          [op]
        )
      );
    });
    main.appendChild(opciones);

    if (mod0State.respondida) {
      main.appendChild(el("div", { class: "explicacion" }, [q.explicacion]));
      const esUltima = mod0State.quizIndex === QUIZ_MODULO0.length - 1;
      main.appendChild(
        el(
          "button",
          {
            class: "primarybtn",
            onclick: () => {
              if (esUltima) {
                mod0State.fase = "final";
              } else {
                mod0State.quizIndex++;
                mod0State.respondida = false;
                mod0State.elegida = null;
              }
              drawModulo0();
            },
          },
          [esUltima ? "Ver resultado" : "Siguiente pregunta"]
        )
      );
    }
  } else if (mod0State.fase === "final") {
    const total = QUIZ_MODULO0.length;
    const score = mod0State.score;
    const dominado = score >= Math.ceil(total * 0.75);
    setModuleResult(0, { completado: true, score, total, scoreLabel: `${score}/${total}` });
    main.appendChild(
      el("div", { class: "card center" }, [
        el("div", { class: "resultadogrande" }, [`${score}/${total}`]),
        el("p", null, [dominado ? "¡Bien! Dominas los conceptos base de ALCOA." : "Repásalo de nuevo cuando puedas — la base es importante antes de escribir Bemerkungen."]),
        el("button", { class: "primarybtn", onclick: () => renderModulo0() }, ["Repetir módulo"]),
        el("button", { class: "secondarybtn", onclick: () => navigate("#/") }, ["Volver al panel"]),
      ])
    );
  }
  app.appendChild(main);
}

// ---------- Módulo 3: Corrección simple ----------
let mod3State = { index: 0, tachado: false, valorCorregido: "", bemerkung: "", evaluado: false, resultados: [] };

function renderModulo3() {
  mod3State = { index: 0, tachado: false, valorCorregido: "", bemerkung: "", evaluado: false, resultados: [] };
  drawModulo3();
}

function checklistPara(ej) {
  const items = [
    {
      label: "Incluye una fecha (formato TT.MM.JJJJ)",
      test: (t) => /\b\d{1,2}\.\d{1,2}\.(\d{2}|\d{4})\b/.test(t),
    },
    {
      label: "Incluye unas iniciales (Kürzel)",
      test: (t) => {
        const sinFecha = t.replace(/\b\d{1,2}\.\d{1,2}\.(\d{2}|\d{4})\b/g, "");
        return /\b[A-ZÄÖÜ][a-zA-ZäöüÄÖÜ]{1,3}\b/.test(sinFecha.replace(/\bSF\b/g, ""));
      },
    },
    {
      label: "Incluye el valor corregido",
      test: (t) => t.includes(ej.valorCorrecto),
    },
  ];
  if (ej.motivoEsperado === "SF") {
    items.push({ label: 'Indica el motivo "SF" (Schreibfehler)', test: (t) => /\bSF\b/i.test(t) });
  } else {
    items.push({
      label: 'NO se limita a "SF" — incluye una explicación real de la causa',
      test: (t) => t.replace(/\bSF\b/gi, "").trim().length > 15,
    });
    items.push({
      label: "Hace referencia a dónde está la prueba objetiva (p. ej. otro documento)",
      test: (t) => /(siehe|s\.|H-MBR|H-PPR|Nachweis|Anhang)/i.test(t),
    });
  }
  return items;
}

function drawModulo3() {
  app.innerHTML = "";
  app.appendChild(header("Módulo 3 · Corrección simple", true));
  const main = el("main", { class: "container" });

  if (mod3State.index >= EJERCICIOS_MODULO3.length) {
    const aciertos = mod3State.resultados.filter((r) => r.todoOk).length;
    const total = EJERCICIOS_MODULO3.length;
    setModuleResult(3, { completado: true, score: aciertos, total, scoreLabel: `${aciertos}/${total}` });
    main.appendChild(
      el("div", { class: "card center" }, [
        el("div", { class: "resultadogrande" }, [`${aciertos}/${total}`]),
        el("p", null, ["Casos con todos los elementos correctos en la Bemerkung."]),
        el("button", { class: "primarybtn", onclick: () => renderModulo3() }, ["Repetir módulo"]),
        el("button", { class: "secondarybtn", onclick: () => navigate("#/") }, ["Volver al panel"]),
      ])
    );
    app.appendChild(main);
    return;
  }

  const ej = EJERCICIOS_MODULO3[mod3State.index];
  main.appendChild(el("p", { class: "muted center" }, [`Caso ${mod3State.index + 1} de ${EJERCICIOS_MODULO3.length}`]));
  main.appendChild(el("div", { class: "card" }, [el("p", null, [ej.contexto])]));

  main.appendChild(
    el("div", { class: "campo-simulado" }, [
      el("span", { class: mod3State.tachado ? "valor tachado" : "valor" }, [ej.valorOriginal]),
      el(
        "button",
        { class: "chipbtn", onclick: () => { mod3State.tachado = !mod3State.tachado; drawModulo3(); } },
        [mod3State.tachado ? "↺ Deshacer tachado" : "✏️ Tachar (Streichung)"]
      ),
    ])
  );

  main.appendChild(el("label", { class: "fieldlabel" }, ["Valor correcto"]));
  main.appendChild(
    el("input", {
      class: "textinput",
      value: mod3State.valorCorregido,
      placeholder: "Escribe aquí el valor corregido...",
      oninput: (e) => (mod3State.valorCorregido = e.target.value),
    })
  );

  main.appendChild(el("label", { class: "fieldlabel" }, ["Bemerkung (en alemán) — como la escribirías en el documento real"]));
  if (!mod3State.evaluado) {
    main.appendChild(el("p", { class: "hint" }, [`💡 ${ej.pista} Formato orientativo: "${ej.plantilla}"`]));
  }
  main.appendChild(
    el("textarea", {
      class: "textarea",
      rows: "3",
      placeholder: "Escribe tu Bemerkung en alemán...",
      oninput: (e) => (mod3State.bemerkung = e.target.value),
      value: mod3State.bemerkung,
    })
  );

  if (!mod3State.evaluado) {
    main.appendChild(
      el(
        "button",
        {
          class: "primarybtn",
          onclick: () => {
            mod3State.evaluado = true;
            const items = checklistPara(ej);
            const valorOk = mod3State.valorCorregido.trim() === ej.valorCorrecto;
            const tachadoOk = mod3State.tachado;
            const chequeos = items.map((it) => ({ label: it.label, ok: it.test(mod3State.bemerkung) }));
            const todoOk = valorOk && tachadoOk && chequeos.every((c) => c.ok);
            mod3State.resultados[mod3State.index] = { todoOk, valorOk, tachadoOk, chequeos };
            drawModulo3();
          },
        },
        ["Corregir"]
      )
    );
  } else {
    const r = mod3State.resultados[mod3State.index];
    const feedback = el("div", { class: "feedback" });
    feedback.appendChild(
      el("div", { class: "checkitem" + (r.tachadoOk ? " ok" : " ko") }, [r.tachadoOk ? "✓" : "✗", " Tachaste el valor original (Streichung)"])
    );
    feedback.appendChild(
      el("div", { class: "checkitem" + (r.valorOk ? " ok" : " ko") }, [r.valorOk ? "✓" : "✗", ` Valor corregido correcto (${ej.valorCorrecto})`])
    );
    r.chequeos.forEach((c) => {
      feedback.appendChild(el("div", { class: "checkitem" + (c.ok ? " ok" : " ko") }, [c.ok ? "✓" : "✗", " " + c.label]));
    });
    main.appendChild(feedback);
    main.appendChild(
      el("div", { class: "explicacion" }, [`Ejemplo de Bemerkung válida: "${ej.plantilla.replace("[fecha]", "DD.MM.AAAA").replace("[iniciales]", "XY")}"`])
    );
    main.appendChild(botonRevisionIA(() => mod3State.bemerkung, () => ej.contexto));
    main.appendChild(
      el(
        "button",
        {
          class: "primarybtn",
          onclick: () => {
            mod3State.index++;
            mod3State.tachado = false;
            mod3State.valorCorregido = "";
            mod3State.bemerkung = "";
            mod3State.evaluado = false;
            drawModulo3();
          },
        },
        ["Siguiente caso →"]
      )
    );
  }
  app.appendChild(main);
}

// ---------- Motor genérico: Quiz (Módulos 1, 2, 5, 7, 8, 9, 11) ----------
let quizState = {};

function renderQuizModulo(id) {
  quizState = { id, index: 0, score: 0, respondida: false, elegida: null };
  drawQuizModulo();
}

function drawQuizModulo() {
  const id = quizState.id;
  const m = MODULOS.find((x) => x.id === id);
  const preguntas = QUIZZES[id];
  app.innerHTML = "";
  app.appendChild(header(`Módulo ${id} · ${m.titulo}`, true));
  const main = el("main", { class: "container" });

  if (quizState.index >= preguntas.length) {
    const total = preguntas.length;
    const score = quizState.score;
    setModuleResult(id, { completado: true, score, total, scoreLabel: `${score}/${total}` });
    main.appendChild(
      el("div", { class: "card center" }, [
        el("div", { class: "resultadogrande" }, [`${score}/${total}`]),
        el("p", null, [score >= Math.ceil(total * 0.75) ? "¡Bien! Dominas este módulo." : "Repásalo de nuevo cuando puedas."]),
        el("button", { class: "primarybtn", onclick: () => renderQuizModulo(id) }, ["Repetir módulo"]),
        el("button", { class: "secondarybtn", onclick: () => navigate("#/") }, ["Volver al panel"]),
      ])
    );
    app.appendChild(main);
    return;
  }

  const q = preguntas[quizState.index];
  main.appendChild(el("p", { class: "muted center" }, [`Pregunta ${quizState.index + 1} de ${preguntas.length}`]));
  main.appendChild(el("div", { class: "card" }, [el("h3", null, [q.q])]));

  const opciones = el("div", { class: "opciones" });
  q.opciones.forEach((op, i) => {
    let cls = "opcion";
    if (quizState.respondida) {
      if (i === q.correcta) cls += " correcta";
      else if (i === quizState.elegida) cls += " incorrecta";
    }
    opciones.appendChild(
      el(
        "button",
        {
          class: cls,
          onclick: () => {
            if (quizState.respondida) return;
            quizState.respondida = true;
            quizState.elegida = i;
            if (i === q.correcta) quizState.score++;
            drawQuizModulo();
          },
        },
        [op]
      )
    );
  });
  main.appendChild(opciones);

  if (quizState.respondida) {
    main.appendChild(el("div", { class: "explicacion" }, [q.explicacion]));
    const esUltima = quizState.index === preguntas.length - 1;
    main.appendChild(
      el(
        "button",
        {
          class: "primarybtn",
          onclick: () => {
            quizState.index++;
            quizState.respondida = false;
            quizState.elegida = null;
            drawQuizModulo();
          },
        },
        [esUltima ? "Ver resultado" : "Siguiente pregunta"]
      )
    );
  }
  app.appendChild(main);
}

// ---------- Motor genérico: Escritura libre de Bemerkung (Módulos 6, 10, 12) ----------
let escrituraState = {};

function renderEscrituraModulo(id) {
  escrituraState = { id, index: 0, bemerkung: "", evaluado: false, resultados: [] };
  drawEscrituraModulo();
}

function drawEscrituraModulo() {
  const id = escrituraState.id;
  const m = MODULOS.find((x) => x.id === id);
  const ejercicios = ESCRITURA[id];
  app.innerHTML = "";
  app.appendChild(header(`Módulo ${id} · ${m.titulo}`, true));
  const main = el("main", { class: "container" });

  if (escrituraState.index >= ejercicios.length) {
    const aciertos = escrituraState.resultados.filter((r) => r.todoOk).length;
    const total = ejercicios.length;
    setModuleResult(id, { completado: true, score: aciertos, total, scoreLabel: `${aciertos}/${total}` });
    main.appendChild(
      el("div", { class: "card center" }, [
        el("div", { class: "resultadogrande" }, [`${aciertos}/${total}`]),
        el("p", null, ["Casos con todos los elementos correctos en la Bemerkung."]),
        el("button", { class: "primarybtn", onclick: () => renderEscrituraModulo(id) }, ["Repetir módulo"]),
        el("button", { class: "secondarybtn", onclick: () => navigate("#/") }, ["Volver al panel"]),
      ])
    );
    app.appendChild(main);
    return;
  }

  const ej = ejercicios[escrituraState.index];
  main.appendChild(el("p", { class: "muted center" }, [`Caso ${escrituraState.index + 1} de ${ejercicios.length}`]));
  main.appendChild(el("div", { class: "card" }, [el("p", null, [ej.contexto])]));

  main.appendChild(el("label", { class: "fieldlabel" }, ["Bemerkung (en alemán) — como la escribirías en el documento real"]));
  main.appendChild(
    el("textarea", {
      class: "textarea",
      rows: "4",
      placeholder: "Escribe tu Bemerkung en alemán...",
      oninput: (e) => (escrituraState.bemerkung = e.target.value),
      value: escrituraState.bemerkung,
    })
  );

  if (!escrituraState.evaluado) {
    main.appendChild(
      el(
        "button",
        {
          class: "primarybtn",
          onclick: () => {
            escrituraState.evaluado = true;
            const chequeos = ej.checklist.map((it) => ({ label: it.label, ok: it.test(escrituraState.bemerkung) }));
            const todoOk = chequeos.every((c) => c.ok);
            escrituraState.resultados[escrituraState.index] = { todoOk, chequeos };
            drawEscrituraModulo();
          },
        },
        ["Corregir"]
      )
    );
  } else {
    const r = escrituraState.resultados[escrituraState.index];
    const feedback = el("div", { class: "feedback" });
    r.chequeos.forEach((c) => {
      feedback.appendChild(el("div", { class: "checkitem" + (c.ok ? " ok" : " ko") }, [c.ok ? "✓" : "✗", " " + c.label]));
    });
    main.appendChild(feedback);
    main.appendChild(el("div", { class: "explicacion" }, [`Ejemplo de Bemerkung válida: "${ej.plantilla}"`]));
    main.appendChild(botonRevisionIA(() => escrituraState.bemerkung, () => ej.contexto));
    const esUltima = escrituraState.index === ejercicios.length - 1;
    main.appendChild(
      el(
        "button",
        {
          class: "primarybtn",
          onclick: () => {
            escrituraState.index++;
            escrituraState.bemerkung = "";
            escrituraState.evaluado = false;
            drawEscrituraModulo();
          },
        },
        [esUltima ? "Ver resultado" : "Siguiente caso →"]
      )
    );
  }
  app.appendChild(main);
}

// ---------- Módulo 4: Casillas marcadas mal ----------
let mod4State = {};

function renderModulo4() {
  mod4State = { index: 0, tachada: false, marcada: null, bemerkung: "", evaluado: false, resultados: [] };
  drawModulo4();
}

function drawModulo4() {
  app.innerHTML = "";
  app.appendChild(header("Módulo 4 · Casillas marcadas mal", true));
  const main = el("main", { class: "container" });

  if (mod4State.index >= EJERCICIOS_MODULO4.length) {
    const aciertos = mod4State.resultados.filter((r) => r.todoOk).length;
    const total = EJERCICIOS_MODULO4.length;
    setModuleResult(4, { completado: true, score: aciertos, total, scoreLabel: `${aciertos}/${total}` });
    main.appendChild(
      el("div", { class: "card center" }, [
        el("div", { class: "resultadogrande" }, [`${aciertos}/${total}`]),
        el("p", null, ["Casos con la casilla correcta y la Bemerkung completa."]),
        el("button", { class: "primarybtn", onclick: () => renderModulo4() }, ["Repetir módulo"]),
        el("button", { class: "secondarybtn", onclick: () => navigate("#/") }, ["Volver al panel"]),
      ])
    );
    app.appendChild(main);
    return;
  }

  const ej = EJERCICIOS_MODULO4[mod4State.index];
  main.appendChild(el("p", { class: "muted center" }, [`Caso ${mod4State.index + 1} de ${EJERCICIOS_MODULO4.length}`]));
  main.appendChild(el("div", { class: "card" }, [el("p", null, [ej.contexto])]));

  const opcionesDiv = el("div", { class: "opciones" });
  ej.opciones.forEach((op, i) => {
    const esIncorrectaMarcada = i === ej.marcadaIncorrecta;
    let etiqueta = op;
    if (esIncorrectaMarcada) {
      etiqueta = (mod4State.tachada ? "☒ " : "☒ ") + op + (mod4State.tachada ? "  (tachada)" : "  ← marcada por error");
    } else {
      etiqueta = (mod4State.marcada === i ? "☒ " : "☐ ") + op;
    }
    let cls = "opcion";
    if (esIncorrectaMarcada && mod4State.tachada) cls += " incorrecta";
    if (!esIncorrectaMarcada && mod4State.marcada === i) cls += " correcta";
    opcionesDiv.appendChild(
      el(
        "button",
        {
          class: cls,
          onclick: () => {
            if (esIncorrectaMarcada) mod4State.tachada = !mod4State.tachada;
            else mod4State.marcada = mod4State.marcada === i ? null : i;
            drawModulo4();
          },
        },
        [etiqueta]
      )
    );
  });
  main.appendChild(opcionesDiv);

  main.appendChild(el("label", { class: "fieldlabel" }, ["Bemerkung (en alemán)"]));
  if (!mod4State.evaluado) {
    main.appendChild(el("p", { class: "hint" }, [`💡 ${ej.pista} Formato orientativo: "${ej.plantilla}"`]));
  }
  main.appendChild(
    el("textarea", {
      class: "textarea",
      rows: "3",
      placeholder: "Escribe tu Bemerkung en alemán...",
      oninput: (e) => (mod4State.bemerkung = e.target.value),
      value: mod4State.bemerkung,
    })
  );

  if (!mod4State.evaluado) {
    main.appendChild(
      el(
        "button",
        {
          class: "primarybtn",
          onclick: () => {
            mod4State.evaluado = true;
            const tachadoOk = mod4State.tachada;
            const marcadaOk = mod4State.marcada === ej.correcta;
            const baseChecklist = [
              { label: "Incluye una fecha", test: tieneFecha },
              { label: "Incluye unas iniciales (Kürzel)", test: tieneIniciales },
              { label: 'Indica el motivo "SF"', test: (t) => /\bSF\b/i.test(t) },
            ].concat(ej.checklistExtra || []);
            const chequeos = baseChecklist.map((it) => ({ label: it.label, ok: it.test(mod4State.bemerkung) }));
            const todoOk = tachadoOk && marcadaOk && chequeos.every((c) => c.ok);
            mod4State.resultados[mod4State.index] = { todoOk, tachadoOk, marcadaOk, chequeos };
            drawModulo4();
          },
        },
        ["Corregir"]
      )
    );
  } else {
    const r = mod4State.resultados[mod4State.index];
    const feedback = el("div", { class: "feedback" });
    feedback.appendChild(el("div", { class: "checkitem" + (r.tachadoOk ? " ok" : " ko") }, [r.tachadoOk ? "✓" : "✗", " Tachaste la casilla marcada por error"]));
    feedback.appendChild(el("div", { class: "checkitem" + (r.marcadaOk ? " ok" : " ko") }, [r.marcadaOk ? "✓" : "✗", " Marcaste la casilla correcta"]));
    r.chequeos.forEach((c) => {
      feedback.appendChild(el("div", { class: "checkitem" + (c.ok ? " ok" : " ko") }, [c.ok ? "✓" : "✗", " " + c.label]));
    });
    main.appendChild(feedback);
    main.appendChild(el("div", { class: "explicacion" }, [`Ejemplo de Bemerkung válida: "${ej.plantilla.replace("[fecha]", "DD.MM.AAAA").replace("[iniciales]", "XY")}"`]));
    main.appendChild(botonRevisionIA(() => mod4State.bemerkung, () => ej.contexto));
    const esUltima = mod4State.index === EJERCICIOS_MODULO4.length - 1;
    main.appendChild(
      el(
        "button",
        {
          class: "primarybtn",
          onclick: () => {
            mod4State.index++;
            mod4State.tachada = false;
            mod4State.marcada = null;
            mod4State.bemerkung = "";
            mod4State.evaluado = false;
            drawModulo4();
          },
        },
        [esUltima ? "Ver resultado" : "Siguiente caso →"]
      )
    );
  }
  app.appendChild(main);
}

// Registrar service worker (offline)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
