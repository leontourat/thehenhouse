# The Hen House — Site Web

Site vitrine statique pour le bar / night club The Hen House à Paleto Bay.

## Structure
- index.html — accueil
- menu.html — carte
- menu/alcool.html
- menu/cocktails.html
- menu/mocktails.html
- menu/soft.html
- menu/grignotage.html
- events.html — événements
- reservation.html — réservation
- contact.html — contact
- style.css — design
- assets/logo.png — logo fourni

## Mise en ligne
Déposez le contenu du dossier sur votre hébergement web.
Le site fonctionne sans framework ni base de données.

## À prévoir pour la version suivante
- formulaire de réservation réellement connecté
- galerie photos
- agenda administrable
- liens Discord / réseaux sociaux
- espace administration
- version mobile encore plus poussée


## Réservations Discord

Le formulaire de réservation est préparé pour fonctionner avec GitHub Pages + Cloudflare Workers + Discord.
Voir `cloudflare-worker/README.md`.

Le webhook Discord ne doit jamais être placé dans le code public du site.
