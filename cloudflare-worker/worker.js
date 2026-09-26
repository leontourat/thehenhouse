/**
 * The Hen House — Reservation API
 *
 * 1. Create a Cloudflare Worker.
 * 2. Add the Discord webhook as a secret named DISCORD_WEBHOOK_URL.
 * 3. Deploy this Worker.
 * 4. Put the Worker URL in reservation.html:
 *    const DISCORD_ENDPOINT = "https://....workers.dev";
 *
 * The Discord webhook is NEVER exposed to GitHub Pages.
 */

const ALLOWED_ORIGIN = "*"; // You can replace "*" with your GitHub Pages URL later.

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders()
  });
}

function clean(value, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return json({ error: "Méthode non autorisée." }, 405);
    }

    if (!env.DISCORD_WEBHOOK_URL) {
      return json({ error: "Webhook Discord non configuré." }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Données invalides." }, 400);
    }

    const name = clean(body.name, 80);
    const people = clean(body.people, 3);
    const date = clean(body.date, 20);
    const time = clean(body.time, 10);
    const message = clean(body.message, 1000);

    if (!name || !people || !date || !time) {
      return json({ error: "Informations obligatoires manquantes." }, 400);
    }

    const peopleNumber = Number(people);
    if (!Number.isInteger(peopleNumber) || peopleNumber < 1 || peopleNumber > 30) {
      return json({ error: "Nombre de personnes invalide." }, 400);
    }

    const payload = {
      username: "The Hen House",
      embeds: [{
        title: "🍸 Nouvelle réservation",
        description: "Une nouvelle demande vient d'être reçue depuis le site.",
        color: 0xC9A24B,
        fields: [
          { name: "👤 Client", value: name, inline: true },
          { name: "👥 Personnes", value: String(peopleNumber), inline: true },
          { name: "📅 Date", value: date, inline: true },
          { name: "🕙 Heure", value: time, inline: true },
          { name: "📝 Message", value: message || "Aucun message.", inline: false },
          { name: "⏳ Statut", value: "🟠 En attente", inline: false }
        ],
        footer: { text: "The Hen House • Paleto Bay" },
        timestamp: new Date().toISOString()
      }]
    };

    const discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!discordResponse.ok) {
      return json({ error: "Discord a refusé la demande." }, 502);
    }

    return json({ success: true });
  }
};
