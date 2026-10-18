# Architecture et comportement

## Construction statique

`npm run build` exécute `scripts/build.mjs` avec Node.js. Ce script copie les ressources de `public/`, les styles et le favicon ; assemble les pages avec `scripts/layout.mjs` ; puis génère `404.html`, `hondo-27-planning.ics`, `sitemap.xml` et `robots.txt` dans `dist/`.

Il n’y a ni framework, ni bundler, ni dépendance npm tierce. Les fichiers JavaScript et CSS sont servis directement. La configuration fournie cible Vercel.

## Interactions

`public/site.js` gère le menu mobile, les apparitions au défilement, la progression, les onglets de scènes et la démonstration du renard. Il charge `public/planning.js` sur les pages contenant un prochain rendez-vous.

La préférence d’animation utilise la clé `hondo-motion-preference` du stockage local, avec les valeurs `enabled` ou `paused`. Sans préférence propre au site, le réglage système de réduction des animations est respecté. Le site reste utilisable si ce stockage est indisponible.

La copie d’une commande utilise l’API Clipboard. En cas d’échec, le texte est sélectionné avec une indication de copie manuelle. Aucun message n’est envoyé dans Twitch par le site.

## Horaires

Le prochain créneau utilise `Intl.DateTimeFormat` avec `Europe/Paris`. L’affichage se rafraîchit chaque minute lorsque la page est visible et au retour sur l’onglet.

L’agenda contient quatre événements hebdomadaires, des identifiants stables et les règles de changement d’heure de Paris. Il ne comporte pas d’alarme imposée aux visiteurs.

## Services externes et limites

Le code actuel n’intègre ni outil d’analyse d’audience, ni formulaire serveur, ni inscription, ni paiement, ni authentification. Les liens ouvrent les services correspondants. Les plateformes Minecards et MineCards TCG gèrent leurs propres comptes et données.

Les aperçus du Studio ne constituent pas une régie connectée à OBS, Twitch ou au logiciel Hondo Studio. Le prochain rendez-vous est une indication de planning, pas une détection de live.

L’audit daté dans `REFERENCE-AUDIT.md` décrit les sources consultées, sans garantir leur état futur.

## Accessibilité

Langue française, titres structurés, lien d’évitement, menu mobile avec état développé et fermeture par Échap, onglets utilisables au clavier, retours textuels pour les commandes, animations désactivables et curseurs limités aux dispositifs adaptés. Ces choix décrivent l’implémentation, sans constituer une certification d’accessibilité.
