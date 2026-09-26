# Connexion Discord — The Hen House

## 1. Créer le webhook Discord

Dans ton serveur Discord :
1. Ouvre **Paramètres du serveur → Intégrations → Webhooks**.
2. Crée un webhook dans le salon où tu veux recevoir les réservations.
3. Copie son URL.

⚠️ Ne publie jamais cette URL sur GitHub et ne la mets jamais dans `reservation.html`.

## 2. Créer le Cloudflare Worker

Dans Cloudflare :
1. Ouvre **Workers & Pages**.
2. Crée un nouveau Worker.
3. Remplace le code par le contenu de `worker.js`.
4. Déploie le Worker.
5. Dans les variables/secrets du Worker, crée un secret :
   - Nom : `DISCORD_WEBHOOK_URL`
   - Valeur : l'URL secrète de ton webhook Discord.

## 3. Autoriser ton site

Pour le premier test, `ALLOWED_ORIGIN = "*"` fonctionne.

Une fois le site GitHub Pages connu, remplace `*` par son adresse, par exemple :
`https://toncompte.github.io`

Cela limite les appels au Worker depuis ton site.

## 4. Relier le site

Dans `reservation.html`, remplace :

`const DISCORD_ENDPOINT = "https://TON-WORKER.workers.dev";`

par l'URL publique de ton Worker.

Exemple :
`const DISCORD_ENDPOINT = "https://hen-house-reservations.example.workers.dev";`

## Résultat

GitHub Pages → formulaire → Cloudflare Worker → webhook Discord.

Le webhook Discord reste secret.
