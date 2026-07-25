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
  const mMod = hash.match(/^#\/modulo\/(\d+)/);
  if (mMod) {
    const id = Number(mMod[1]);
    if (id === 0) return renderModulo0();
    if (id === 3) return renderModulo3();
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

function header(title, back) {
  const h = el("header", { class: "topbar" }, [
    back
      ? el("button", { class: "iconbtn", onclick: () => navigate("#/") }, ["←"])
      : el("div", { class: "iconbtn-spacer" }),
    el("h1", null, [title]),
    el("div", { class: "iconbtn-spacer" }),
  ]);
  return h;
}

// ---------- Dashboard ----------
function renderDashboard() {
  const progress = loadProgress();
  const disponibles = MODULOS.filter((m) => m.estado === "disponible");
  const completados = disponibles.filter((m) => progress[m.id] && progress[m.id].completado).length;
  const pct = disponibles.length ? Math.round((completados / disponibles.length) * 100) : 0;

  app.innerHTML = "";
  app.appendChild(header("GMP Trainer"));

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

// Registrar service worker (offline)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
