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
        if (html) sections.push(`<section><h2>${title}</h2>${html}</section>`);
        else console.warn('[prerender] nothing found for #' + route);
    }
    await browser.close();

    const block =
        '<section id="text-version" aria-label="Text version">' +
        '<h1>Aayush Agrawal</h1><p>Developer and AI &amp; ML student at BMS College of Engineering, Bengaluru.</p>' +
        '<p><a href="https://aayushagrawal.in/cv/">Resume (web)</a> · <a href="https://aayushagrawal.in/os/files/Aayush-Agrawal-Resume.pdf">Resume (PDF)</a> · ' +
        '<a href="https://github.com/aayushagrawall">GitHub</a> · <a href="https://www.linkedin.com/in/aayush-agrawall/">LinkedIn</a></p>' +
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
        html = html.replace('</head>', style + '</head>');
        html = html.replace(/<body([^>]*)>/, `<body$1>${block}<!--/text-version-->`);
        fs.writeFileSync(file, html);
        console.log(`[prerender] ${rel}: ${sections.length} pages, ${Math.round(block.length / 1024)} KB of text`);
    }
})();
