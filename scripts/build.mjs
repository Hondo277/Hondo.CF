import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { header, footer, document } from './layout.mjs';
import { calendar } from './calendar.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../dist/', import.meta.url));
await mkdir(output, { recursive: true });
await cp(`${root}public`, output, { recursive: true });
for (const file of ['styles.css', 'favicon.svg']) {
  await cp(`${root}${file}`, `${output}${file}`);
}
const home = (await readFile(join(root, 'index.html'), 'utf8'))
  .replace('<!-- SITE_HEADER -->', header('home'))
  .replace('<!-- SITE_FOOTER -->', footer());
await writeFile(join(output, 'index.html'), home);
const pages = [
  { source: 'a-propos.html', route: '/a-propos/', active: 'about', title: 'Un peu de moi', description: 'Qui se cache derrière Hondo_27 ? Minecraft, R.E.P.O., vidéos et projets : bienvenue dans mon univers.' },
  { source: 'contact.html', route: '/contact/', active: 'contact', title: 'On discute ?', description: 'Une idée, une collaboration ou un simple bonjour ? Retrouve les moyens de contacter Hondo_27 et de rejoindre ses lives.' },
  { source: 'hondo-studio.html', route: '/projets/hondo-studio/', active: 'studio', title: 'Hondo_27 Studio', description: 'Un renard, un terrier nocturne et un univers de live : découvre Hondo_27 Studio, créé pour moi par Anthony Viani.' },
  { source: 'minecards-tcg.html', route: '/projets/minecards-tcg/', active: 'studio', title: 'MineCards TCG', description: 'Le site compagnon de Minecards : gérer sa collection, créer des decks et affronter les autres joueurs dans l’arène.' },
  { source: 'projets.html', route: '/projets/', active: 'projects', title: 'Mes projets', description: 'MineCards TCG et Hondo Studio : leurs histoires, leurs usages et les liens pour les découvrir.' },
  { source: 'lives.html', route: '/lives/', active: 'lives', title: 'Les lives', description: 'Les rendez-vous Twitch de Hondo_27 : mardi, mercredi, jeudi dès 20h30–21h et dimanche de midi à minuit. Planning à ajouter à ton agenda.' },
  { source: 'communaute.html', route: '/communaute/', active: 'community', title: 'La meute · Honothya', description: 'Rejoins Honothya sur Discord, découvre les règles du terrier et les commandes du renard de Hondo_27.' },
];
for (const page of pages) {
  const content = await readFile(join(root, 'pages', page.source), 'utf8');
  const destination = join(output, page.route.slice(1), 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, document({ ...page, content }));
}
const notFound = await readFile(join(root, 'pages', '404.html'), 'utf8');
await writeFile(join(output, '404.html'), document({ title: 'Un détour dans le terrier', description: 'Cette page est introuvable. Retrouve les lives, les projets et la communauté de Hondo_27.', route: '/404.html', active: 'notfound', content: notFound }));
await writeFile(join(output, 'hondo-27-planning.ics'), calendar());
const urls = ['/', ...pages.map((page) => page.route)];
await writeFile(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((route) => `<url><loc>https://hondocf.vercel.app${route}</loc></url>`).join('')}</urlset>`);
await writeFile(join(output, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://hondocf.vercel.app/sitemap.xml\n');
console.log('Site prêt : 8 pages, page 404, agenda et sitemap.');
