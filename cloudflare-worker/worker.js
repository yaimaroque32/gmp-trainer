// Cloudflare Worker — corrector de gramática alemana para GMP Trainer.
// Pega este código en el editor de Cloudflare Workers (dash.cloudflare.com → Workers & Pages → Create → Edit code).
// Necesita dos "Secrets" configurados en el Worker (Settings → Variables and Secrets):
//   ANTHROPIC_API_KEY   -> tu clave de console.anthropic.com
//   APP_SHARED_SECRET   -> una contraseña que tú elijas (la misma que pones en Ajustes dentro de la app)
//
// Cambia ALLOWED_ORIGIN si tu GitHub Pages tiene otra URL.

const ALLOWED_ORIGIN = "https://yaimaroque32.github.io";

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-App-Secret",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "method_not_allowed" }), {
        status: 405,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const secret = request.headers.get("X-App-Secret");
    if (!env.APP_SHARED_SECRET || secret !== env.APP_SHARED_SECRET) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "bad_request" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const texto = String(body.texto || "").slice(0, 800).trim();
    const contexto = String(body.contexto || "").slice(0, 500);
    if (!texto) {
      return new Response(JSON.stringify({ error: "texto_vacio" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const prompt = `Eres un formador de documentación GMP bilingüe alemán/español. Un empleado hispanohablante ha escrito la siguiente Bemerkung (anotación/comentario) en alemán, para un documento de fabricación GMP real.

Contexto del caso: ${contexto}

Texto escrito por el empleado (alemán):
"""
${texto}
"""

Evalúa SOLO la corrección gramatical y el estilo de redacción en alemán (no evalúes si cumple los requisitos GMP de contenido, eso ya se comprueba aparte por otro sistema). Responde ÚNICAMENTE con un JSON válido, sin texto adicional antes o después, con esta forma exacta:
{"correcto": true o false, "errores": [{"original": "fragmento con el error", "correccion": "cómo debería decir", "explicacion": "explicación breve en español"}], "version_mejorada": "la frase completa corregida y con mejor redacción en alemán, manteniendo el estilo telegráfico típico de una Bemerkung GMP (breve, factual, sin cortesías)", "comentario_general": "un comentario breve en español, motivador y constructivo, sobre la redacción"}

Si no hay ningún error gramatical, "errores" debe ser un array vacío y "correcto" debe ser true, pero aun así puedes sugerir una "version_mejorada" si el estilo se puede pulir, o repetir el mismo texto si ya es perfecto.`;

    let anthropicRes;
    try {
      anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 700,
          messages: [{ role: "user", content: prompt }],
        }),
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "network_error" }), {
        status: 502,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: "anthropic_error", detail: errText.slice(0, 300) }), {
        status: 502,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const data = await anthropicRes.json();
    const raw = (data.content && data.content[0] && data.content[0].text) || "{}";

    // Validamos que sea JSON antes de devolverlo, para que el cliente nunca reciba basura.
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = { error: "respuesta_no_json", comentario_general: raw.slice(0, 500) };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
