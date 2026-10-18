const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

export function header(active = 'home') {
  return `<header class="site-header">
    <a class="brand" href="/#accueil" aria-label="Hondo_27, accueil"><span class="brand-mark"><img src="/images/fox-mark.svg" width="44" height="44" alt="" /></span><span class="brand-name">HONDO<span>_27</span></span></a>
    <nav class="site-nav" id="site-navigation" aria-label="Navigation principale">
      <a href="/a-propos/"${active === 'about' ? ' aria-current="page"' : ''}>À propos</a>
      <a href="/projets/"${['studio', 'projects'].includes(active) ? ' aria-current="page"' : ''}>Mes projets</a>
      <a href="/lives/"${active === 'lives' ? ' aria-current="page"' : ''}>Les lives</a>
      <a href="/communaute/"${active === 'community' ? ' aria-current="page"' : ''}>La meute</a>
      <a href="/contact/"${active === 'contact' ? ' aria-current="page"' : ''}>On discute ?</a>
      <a class="nav-mobile-live" href="https://twitch.tv/hondo_27" target="_blank" rel="noreferrer">Rejoindre Twitch ↗</a>
    </nav>
    <div class="header-actions"><a class="header-cta" href="https://twitch.tv/hondo_27" target="_blank" rel="noreferrer"><span class="live-dot"></span> Rejoindre le live <span aria-hidden="true">↗</span></a>
    <button class="mobile-menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation"><span>Menu</span><svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true"><path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>
  </header>`;
}

export function footer() {
  return `<footer class="site-footer">
    <div class="footer-main"><div class="footer-intro"><a class="brand footer-brand" href="/#accueil" aria-label="Hondo_27, accueil"><span class="brand-mark"><img src="/images/fox-mark.svg" width="36" height="36" alt="" /></span><span class="brand-name">HONDO<span>_27</span></span></a><p>Des jeux, des projets.<br />Et une place pour la meute.</p></div>
    <div class="footer-links"><span>FAIS UN TOUR</span><a href="/a-propos/">Un peu de moi</a><a href="/projets/">Les projets</a><a href="/lives/">Les rendez-vous</a><a href="/communaute/">La communauté</a><a href="/contact/">On discute ?</a></div>
    <div class="footer-links"><span>ON SE RETROUVE</span><a href="https://discord.gg/xpTN35HGR4" target="_blank" rel="noreferrer">Discord · Honothya ↗</a><a href="https://twitch.tv/hondo_27" target="_blank" rel="noreferrer">Twitch ↗</a><a href="https://youtube.com/@Hondo_27" target="_blank" rel="noreferrer">YouTube ↗</a><a href="https://instagram.com/hondo_27/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://guns.lol/hondo_27" target="_blank" rel="noreferrer">Tous les réseaux ↗</a></div></div>
    <div class="footer-bottom"><span>© <span id="year">2026</span> Hondo_27</span><span>L’univers Hondo Studio, créé par <a href="https://aviani.sh/projets/hondo-studio/" target="_blank" rel="noreferrer">Anth_0ff · Anthony Viani ↗</a></span><a class="footer-why" href="/a-propos/#le-point-cf">Pourquoi .CF ?</a><a href="#contenu">RETOUR EN HAUT ↑</a></div>
  </footer>
  <button class="motion-toggle" type="button" aria-pressed="false" aria-label="Mettre les animations en pause"><span aria-hidden="true">✳</span><span class="motion-label">Animations actives</span></button>
  <script src="/site.js" defer></script>`;
}

export function document({ title, description, route, active, content }) {
  return `<!doctype html><html lang="fr"><head>
    <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="theme-color" content="#111310" />
    <title>${escape(title)} — Hondo_27</title><meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="https://hondocf.vercel.app${route}" /><meta property="og:title" content="${escape(title)} — Hondo_27" /><meta property="og:description" content="${escape(description)}" /><meta property="og:type" content="website" /><meta property="og:locale" content="fr_FR" /><meta property="og:site_name" content="Hondo.CF" /><meta property="og:url" content="https://hondocf.vercel.app${route}" /><meta property="og:image" content="https://hondocf.vercel.app/images/hondo-den.png" /><meta property="og:image:alt" content="Le terrier nocturne de Hondo_27" /><meta name="twitter:card" content="summary_large_image" />${route === '/404.html' ? '<meta name="robots" content="noindex" />' : ''}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" /><link rel="preload" href="/fonts/barlow-condensed-latin-700.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/styles.css" /><link rel="stylesheet" href="/refresh.css" /><link rel="stylesheet" href="/pages.css" />
  </head><body data-page="${active}"><a class="skip-link" href="#contenu">Aller au contenu</a><div class="scroll-progress" aria-hidden="true"></div>${header(active)}
  <main class="inner-page" id="contenu">${content}</main>${footer()}</body></html>`;
}
