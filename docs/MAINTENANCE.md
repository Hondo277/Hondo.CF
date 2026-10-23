# Maintenance de Hondo.CF

## Modifier le contenu

| Besoin | Fichiers |
| --- | --- |
| Accueil, introduction et réseaux | `index.html` |
| Biographie, setup, histoire du .CF | `pages/a-propos.html` |
| Catalogue | `pages/projets.html` |
| MineCards TCG | `pages/minecards-tcg.html` |
| Hondo Studio et ambiances | `pages/hondo-studio.html` |
| Planning affiché | `pages/lives.html` et `index.html` |
| Discord, règles et renard | `pages/communaute.html` |
| Contact et FAQ | `pages/contact.html` |
| Menu, pied de page et crédits communs | `scripts/layout.mjs` |

Les fichiers de `pages/` sont des fragments HTML : le build leur ajoute le cadre partagé. L’accueil contient les marqueurs `<!-- SITE_HEADER -->` et `<!-- SITE_FOOTER -->`, à conserver.

Ne pas modifier `dist/` directement : il est généré à partir des sources.

## Modifier les horaires

Mettre à jour ensemble :

1. Les textes dans `index.html`, `pages/lives.html` et toute autre mention des horaires.
2. Les jours et limites de `public/planning.js`, qui calcule le prochain créneau.
3. Les récurrences, heures et descriptions de `scripts/calendar.mjs`.
4. La description des lives dans `scripts/build.mjs` et le tableau du README.

En semaine, le créneau signifie **un démarrage entre 20h30 et 21h**. L’agenda marque le début habituel à 20h30 et l’explique dans sa description, sans inventer une durée. Le dimanche comporte une fin à minuit le lendemain.

Le `.ics` permet d’importer des événements récurrents. Une copie déjà importée dans un agenda n’est pas synchronisée automatiquement avec les futures modifications du site.

## Modifier le style et les interactions

- `styles.css` : base et polices.
- `public/refresh.css` : couleurs, formes, animations, scrollbar et curseurs.
- `public/pages.css` : pages internes et composants.
- `public/images/cursor-hondo-fox.svg` : renard jaune.
- `public/images/cursor-hondo-fox-link.svg` : renard ivoire avec halo jaune.

Le point actif des curseurs CSS est `(4, 3)`, au niveau de l’oreille supérieure gauche. Ils s’appliquent aux souris à pointeur précis, hors contraste forcé.

Pour les réactions du renard, conserver la correspondance entre les attributs `data-fox-reaction` de la page communauté et l’objet `reactions` de `public/site.js`.

## Ajouter une page

Créer son fragment dans `pages/`, puis ajouter son entrée dans le tableau `pages` de `scripts/build.mjs` : source, route, état actif, titre et description. Ajouter les liens de navigation nécessaires et relancer `npm run build`. La route rejoint automatiquement le sitemap.

## Changer l’adresse publique

Rechercher `https://hondocf.vercel.app` dans `index.html`, `scripts/layout.mjs`, `scripts/build.mjs`, `scripts/calendar.mjs` et la documentation. Adapter les URL, puis reconstruire. La connexion du domaine et ses DNS se font séparément dans Vercel.

## Publication

Construire avec `npm run build`, puis publier `dist/` ou laisser Vercel exécuter le build lorsqu’une intégration Git est configurée.

`dist/`, `.vercel/`, `node_modules/`, les fichiers `.env`, journaux et caches sont ignorés. Le projet actuel n’utilise pas de secret applicatif. Les données privées du logiciel Hondo Studio ne font pas partie de ce dépôt.

## Google Search Console

La propriété de préfixe d’URL `https://hondocf.vercel.app/` a été validée le 24 octobre 2026 par la balise HTML `google-site-verification` présente dans le `<head>` de `index.html`.

**Conserver cette balise dans les prochaines versions** : Google la revérifie pour maintenir la preuve de propriété. Elle doit rester visible dans le HTML publié de l’accueil.

- [Tableau de bord Search Console](https://search.google.com/search-console?resource_id=https%3A%2F%2Fhondocf.vercel.app%2F)
- Sitemap à déclarer : `https://hondocf.vercel.app/sitemap.xml`, généré avec les huit pages publiques.
- Règles d’exploration : `https://hondocf.vercel.app/robots.txt`.
- Après une modification importante, utiliser l’inspection de l’URL pour contrôler l’accès de Google et, si nécessaire, demander une nouvelle indexation.

Une validation de propriété ou l’envoi d’un sitemap ne garantit ni l’indexation de toutes les pages ni une position dans les résultats. Les rapports commencent à se remplir après le traitement des données par Google.
