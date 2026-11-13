/**
 * Pre-renders AayushOS's Showcase pages into a plain-HTML "text version" so search
 * engines, link previews and screen readers can read About, Experience, Projects and
 * Contact without running the desktop. Run after the build (npm run build does this):
 *
 *     node scripts/prerender.js
 *
 * It opens the built /os/ in Chromium (files served straight from public/, no network),
 * visits each Showcase page, keeps only simple tags (headings, paragraphs, lists, links)
 * and writes the result into public/os/index.html and public/os-lite/index.html as
 * <section id="text-version">. People with JavaScript see the desktop as usual (the
 * section is visually hidden but stays readable by screen readers); without JavaScript
 * it is the page.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const HOST = 'http://prerender.local';
const PAGES = [
    ['about', 'About'],
    ['experience', 'Experience'],
    ['projects/software', 'Projects: websites'],
    ['projects/tools', 'Projects: bots and tools'],
    ['contact', 'Contact'],
];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.pdf': 'application/pdf' };

let playwright;
try {
    playwright = require('playwright');
} catch (e) {
    console.warn('[prerender] Playwright is not installed, so the text version was not rebuilt.');
    process.exit(0);
}

(async () => {
    const browser = await playwright.chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.route('**/*', (route) => {
        const url = new URL(route.request().url());
        if (url.origin !== HOST) return route.abort();
        let file = path.join(PUBLIC, decodeURIComponent(url.pathname));
        if (file.endsWith(path.sep) || file.endsWith('/')) file = path.join(file, 'index.html');
        if (!file.startsWith(PUBLIC) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
        route.fulfill({ status: 200, body: fs.readFileSync(file), contentType: TYPES[path.extname(file)] || 'application/octet-stream' });
    });
    await ctx.addInitScript(() => {
        try {
            localStorage.setItem('aayushos-welcome-off', '1');
            localStorage.setItem('aayushos-crt', '0');
            localStorage.setItem('aayushos-muted', '1');
            sessionStorage.setItem('aayushos-booted', '1');
            sessionStorage.setItem('aayushos-ultra-shown', '1');
        } catch (e) {}
    });
    const page = await ctx.newPage();
    await page.goto(HOST + '/os/', { waitUntil: 'load' });
    await page.waitForTimeout(1500);

    const sections = [];
    const byRoute = {};
    for (const [route, title] of PAGES) {
        await page.evaluate((r) => (location.hash = r), route);
        await page.waitForTimeout(700);
        const html = await page.evaluate((host) => {
            const src = document.querySelector('.site-page-content');
            if (!src) return '';
            const KEEP = { H1: 'h3', H2: 'h3', H3: 'h4', H4: 'h4', P: 'p', UL: 'ul', OL: 'ol', LI: 'li', A: 'a', B: 'b', STRONG: 'b', EM: 'em', I: 'em', BR: 'br' };
            const DROP = new Set(['IMG', 'SVG', 'BUTTON', 'INPUT', 'TEXTAREA', 'FORM', 'SCRIPT', 'STYLE', 'IFRAME', 'VIDEO', 'SELECT', 'LABEL']);
            const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const walk = (n) => {
                if (n.nodeType === 3) return esc(n.textContent.replace(/\s+/g, ' '));
                if (n.nodeType !== 1 || DROP.has(n.tagName)) return '';
                // skip the "download my resume" box at the top of pages
                const t = n.textContent.trim();
                if (t.startsWith('Looking for my resume') && t.length < 120) return '';
                const inner = Array.from(n.childNodes).map(walk).join('');
                const tag = KEEP[n.tagName];
                if (!tag) return inner.trim() ? ' ' + inner + ' ' : '';
                if (tag === 'br') return '<br>';
                if (tag === 'a') {
                    const href = n.getAttribute('href') || '';
                    if (!/^(https?:|mailto:|tel:)/.test(href)) return inner;
                    return `<a href="${href.replace(/"/g, '&quot;')}">${inner.trim()}</a>`;
                }
                if (!inner.trim()) return '';
                return `<${tag}>${inner.trim().replace(/\s+/g, ' ')}</${tag}>`;
            };
            return walk(src).replace(/\s+/g, ' ').replace(/> </g, '><').trim();
        }, HOST);
        if (html) {
            sections.push(`<section><h2>${title}</h2>${html}</section>`);
            byRoute[route] = html;
        }
        else console.warn('[prerender] nothing found for #' + route);
    }
    await browser.close();

    const block =
        '<section id="text-version" aria-label="Text version">' +
        '<h1>Aayush Agrawal</h1><p>Developer and AI &amp; ML student at BMS College of Engineering, Bengaluru.</p>' +
        '<p><a href="https://aayushagrawal.in/resume/">Resume (web)</a> · <a href="https://aayushagrawal.in/os/files/Aayush-Agrawal-Resume.pdf">Resume (PDF)</a> · ' +
        '<a href="https://github.com/aayushagrawall">GitHub</a> · <a href="https://www.linkedin.com/in/aayush-agrawall/">LinkedIn</a></p>' +
        '<p>Pages: <a href="https://aayushagrawal.in/about/">About</a> · <a href="https://aayushagrawal.in/experience/">Experience</a> · <a href="https://aayushagrawal.in/projects/">Projects</a> · <a href="https://aayushagrawal.in/contact/">Contact</a></p>' +
        sections.join('') +
        '</section>';
    const style =
        '<style id="text-version-style">' +
        '#text-version{max-width:720px;margin:40px auto;padding:0 16px;font:16px/1.6 Georgia,serif;color:#111;background:#fff}' +
        // with JavaScript the desktop takes over; the text stays for screen readers and crawlers
        '.js #text-version{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important;margin:0!important;padding:0!important}' +
        '</style><script>document.documentElement.classList.add("js")</script>';

    for (const rel of ['os/index.html', 'os-lite/index.html']) {
        const file = path.join(PUBLIC, rel);
        if (!fs.existsSync(file)) continue;
        let html = fs.readFileSync(file, 'utf8');
        html = html.replace(/<style id="text-version-style">[\s\S]*?<\/script>/, '').replace(/<section id="text-version"[\s\S]*?<\/section><!--\/text-version-->/, '');
        // the text version brings the page's one h1; the no-JavaScript fallback keeps its text
        html = html.replace(/(<noscript>\s*)<h1>Aayush Agrawal<\/h1>/, '$1');
        html = html.replace('</head>', style + '</head>');
        html = html.replace(/<body([^>]*)>/, `<body$1>${block}<!--/text-version-->`);
        fs.writeFileSync(file, html);
        console.log(`[prerender] ${rel}: ${sections.length} pages, ${Math.round(block.length / 1024)} KB of text`);
    }

    // ---------- Indexable pages: /about/, /experience/, /projects/, /contact/ ----------
    // Real pages with their own title, description and canonical URL, built from the same
    // Showcase content, so Google can index each one. A button opens the same page in AayushOS.
    const SITE = 'https://aayushagrawal.in';
    const PERSON = {
        '@type': 'Person',
        '@id': SITE + '/#person',
        name: 'Aayush Agrawal',
        url: SITE + '/',
        jobTitle: 'Developer and AI & ML Student',
        email: 'agrawal.aayush38@gmail.com',
        affiliation: { '@type': 'CollegeOrUniversity', name: 'BMS College of Engineering' },
        address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
        sameAs: ['https://github.com/aayushagrawall', 'https://www.linkedin.com/in/aayush-agrawall/', 'https://instagram.com/_aayush.agrawal', 'https://aayushagrawal.codes'],
    };
    const NAV = [
        ['about', 'About'],
        ['experience', 'Experience'],
        ['projects', 'Projects'],
        ['contact', 'Contact'],
    ];
    const PAGES_OUT = [
        {
            slug: 'about',
            title: 'About Aayush Agrawal | AI & ML Student and Developer, Bengaluru',
            desc: 'Aayush Agrawal is an AI & Machine Learning undergraduate at BMS College of Engineering, Bengaluru, who builds Python tools, Discord bots and websites.',
            h1: 'About me',
            body: byRoute['about'],
            os: 'about',
            type: 'ProfilePage',
            // only on the plain page (inside AayushOS the site needs no introduction)
            extra:
                '<h2>About this site</h2>' +
                '<p>This portfolio is a 3D bedroom with a retro computer on the desk. The computer runs AayushOS, a small desktop with my projects, my resume, a terminal and a few games. There are things to play with in the room too: a football, a cat, and a window where it rains when it is raining in Bengaluru.</p>' +
                '<p>The 3D scene is based on Henry Heffernan\'s open-source portfolio, and AayushOS on his inner site, used with his permission. AayushOS Lite, the version made for phones, is my own. The full credits are in the Credits app inside <a href="/os/">AayushOS</a>.</p>',
            // the one real picture on the site that image search can index: the room, at night
            image: {
                src: '/images/about-room.webp',
                width: 1200,
                height: 900,
                alt: "Aayush Agrawal's 3D portfolio: a bedroom at night with a retro CRT computer on the desk, a STAY UP neon sign, a sneaker shelf and a cat asleep on the bed",
                caption: 'My portfolio is this room. The computer on the desk runs AayushOS.',
            },
        },
        {
            slug: 'experience',
            title: 'Experience | Aayush Agrawal, BMS College of Engineering',
            desc: 'Education and experience of Aayush Agrawal: B.E. in AI & Machine Learning at BMS College of Engineering, BMSCE UTSAV volunteer and Rotaract Club member.',
            h1: 'Experience',
            body: byRoute['experience'],
            os: 'experience',
            type: 'WebPage',
            // facts from the resume (static/resume/index.html) and the project list: keep them in step
            extra:
                '<h2>Projects along the way</h2>' +
                '<p>Alongside college I build things. In my first year I made a Discord moderation bot in Python and MongoDB for the Clienterrverse community (Sep 2024), a QR code generator (Oct 2024) and a console typing test that measures words per minute, which was my first-semester project (Jan 2025). They are all on my <a href="/projects/">Projects</a> page.</p>' +
                '<h2>Skills</h2>' +
                '<ul><li>Programming: Python, C, HTML and CSS</li><li>Databases: MySQL and MongoDB</li><li>Languages: English, Hindi and Nepali</li></ul>' +
                '<h2>What I\'m looking for</h2>' +
                '<p>I\'m open to internships. My <a href="/resume/">resume</a> has all of this on one page, and my <a href="/contact/">contact details</a> are a click away.</p>',
        },
        {
            slug: 'projects',
            title: 'Projects | Aayush Agrawal: websites, Discord bots and Python tools',
            desc: 'Projects by Aayush Agrawal, including clienterr.com, imgurr.me, a Discord moderation bot and Python tools.',
            h1: 'Projects',
            body: (byRoute['projects/software'] || '') + (byRoute['projects/tools'] || ''),
            os: 'projects',
            type: 'CollectionPage',
        },
        {
            slug: 'contact',
            title: 'Contact Aayush Agrawal',
            desc: 'Get in touch with Aayush Agrawal by email, LinkedIn or GitHub, about internships, projects or anything else.',
            h1: 'Contact',
            body:
                '<ul class="links">' +
                '<li>Email: <a href="mailto:agrawal.aayush38@gmail.com">agrawal.aayush38@gmail.com</a></li>' +
                '<li>LinkedIn: <a href="https://www.linkedin.com/in/aayush-agrawall/">linkedin.com/in/aayush-agrawall</a></li>' +
                '<li>GitHub: <a href="https://github.com/aayushagrawall">github.com/aayushagrawall</a></li>' +
                '<li>Instagram: <a href="https://instagram.com/_aayush.agrawal">@_aayush.agrawal</a></li>' +
                '<li>Resume: <a href="/resume/">aayushagrawal.in/resume/</a> (<a href="/os/files/Aayush-Agrawal-Resume.pdf">PDF</a>)</li>' +
                '</ul>' +
                // written for the plain page: the AayushOS page is a form, which this page doesn't have
                (byRoute['contact']
                    ? '<h2>What to write to me about</h2>' +
                      '<p>I\'m open to internships, collaborations, or just a chat about AI and ML. Email is the best way to reach me, and LinkedIn works too.</p>' +
                      '<h2>Internships</h2>' +
                      '<p>I\'m a B.E. student in Artificial Intelligence &amp; Machine Learning at BMS College of Engineering, Bengaluru, graduating in 2028, and I\'m open to internships. My <a href="/resume/">resume</a> is one page: you can <a href="/os/files/Aayush-Agrawal-Resume.pdf">download it as a PDF</a> or <a href="/resume/aayush-agrawal.vcf">save my contact card</a>.</p>' +
                      '<h2>Projects and open source</h2>' +
                      '<p>I work on open-source projects with the Clienterrverse community, including a Discord moderation bot and clienterr.com. If you want to build something together, or have a question about one of my <a href="/projects/">projects</a>, write to me or find me on <a href="https://github.com/aayushagrawall">GitHub</a>.</p>' +
                      '<h2>Where I am</h2>' +
                      '<p>I\'m in Bengaluru, India (Indian Standard Time). I speak English, Hindi and Nepali.</p>'
                    : ''),
            os: 'contact',
            type: 'ContactPage',
        },
    ];
    const escAttr = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    // headings inside a page body shift down one level under the page's own h1
    const demote = (h) => h.replace(/<(\/?)h3>/g, '<$1h2>').replace(/<(\/?)h4>/g, '<$1h3>');
    // tidy the OS markup for a plain page: spacing comes from CSS, split headings join up,
    // and lines that only make sense inside AayushOS are reworded or linked
    const tidy = (h) =>
        demote(h)
            .replace(/<br>/g, '')
            .replace(/<h2>([^<]+)<\/h2><h3>(&amp;[^<]+)<\/h3>/g, '<h2>$1 $2</h2>')
            .replace(/reach out using this form or email me at/g, 'email me at')
            .replace(/on my Websites page\./g, 'on my <a href="/projects/">Projects</a> page.')
            .replace(/<p>\s*<\/p>/g, '');
    let written = 0;
    for (const pg of PAGES_OUT) {
        if (!pg.body) {
            console.warn('[prerender] no content for /' + pg.slug + '/, keeping the old short link');
            continue;
        }
        const url = `${SITE}/${pg.slug}/`;
        const ld = {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': pg.type,
                    '@id': url,
                    url,
                    name: pg.title,
                    description: pg.desc,
                    isPartOf: { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: 'Aayush Agrawal' },
                    ...(pg.type === 'ProfilePage' ? { mainEntity: PERSON } : { about: { '@id': SITE + '/#person' } }),
                    ...(pg.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: SITE + pg.image.src, width: pg.image.width, height: pg.image.height, caption: pg.image.alt } } : {}),
                },
                {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Aayush Agrawal', item: SITE + '/' },
                        { '@type': 'ListItem', position: 2, name: pg.h1, item: url },
                    ],
                },
                ...(pg.type === 'ProfilePage' ? [] : [PERSON]),
            ],
        };
        const nav = NAV.map(([slug, name]) => `<a href="/${slug}/"${slug === pg.slug ? ' aria-current="page"' : ''}>${name}</a>`).join('') + '<a href="/resume/">Resume</a>';
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escAttr(pg.title)}</title>
  <meta name="description" content="${escAttr(pg.desc)}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${url}" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/images/android-chrome-192x192.png" type="image/png" sizes="192x192" />
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
  <meta property="og:type" content="${pg.type === 'ProfilePage' ? 'profile' : 'website'}" />
  <meta property="og:site_name" content="Aayush Agrawal" />
  <meta property="og:title" content="${escAttr(pg.title)}" />
  <meta property="og:description" content="${escAttr(pg.desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/images/og/${pg.slug}.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escAttr(pg.title)}" />
  <meta name="twitter:description" content="${escAttr(pg.desc)}" />
  <meta name="twitter:image" content="${SITE}/images/og/${pg.slug}.jpg" />
  <link rel="stylesheet" href="/pages.css?v=3" />
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <script>window.goatcounter = { path: function (p) { return location.host + p } };</script>
  <script data-goatcounter="https://clienterr.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</head>
<body>
  <header class="top">
    <a class="name" href="/">Aayush Agrawal</a>
    <nav aria-label="Pages">${nav}</nav>
  </header>
  <main>
    <p class="crumbs"><a href="/">aayushagrawal.in</a> / ${pg.h1}</p>
    <h1>${pg.h1}</h1>
    <div class="open">
      <p>This is the plain version of this page. It also lives inside my 3D portfolio, on a retro computer you can use.</p>
      <p class="btns"><a class="primary" href="/os/#${pg.os}">Open it in AayushOS</a><a href="/">See the 3D desk</a></p>
    </div>
    ${pg.image ? `<figure class="shot"><img src="${pg.image.src}" width="${pg.image.width}" height="${pg.image.height}" alt="${escAttr(pg.image.alt)}" decoding="async" /><figcaption>${pg.image.caption}</figcaption></figure>` : ''}
    <article>${tidy(pg.body)}${pg.extra || ''}</article>
  </main>
  <footer class="foot">
    <nav aria-label="More pages">${nav}<a href="/os/">AayushOS</a><a href="https://aayushagrawal.codes">aayushagrawal.codes</a></nav>
    <p>© 2026 Aayush Agrawal · Bengaluru, India</p>
  </footer>
</body>
</html>
`;
        fs.mkdirSync(path.join(PUBLIC, pg.slug), { recursive: true });
        fs.writeFileSync(path.join(PUBLIC, pg.slug, 'index.html'), html);
        written++;
    }
    console.log(`[prerender] wrote ${written} indexable pages`);

    // ---------- Sitemap with today's date ----------
    const today = new Date().toISOString().slice(0, 10);
    // /os/ is left out: Google crawls as a phone, and phones are sent on to /os-lite/.
    const urls = ['/', '/about/', '/experience/', '/projects/', '/contact/', '/resume/', '/os-lite/', '/os/files/Aayush-Agrawal-Resume.pdf'];
    const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.map((u) => `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n') +
        '\n</urlset>\n';
    fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), xml);
    console.log('[prerender] sitemap.xml: ' + urls.length + ' URLs');
})();
