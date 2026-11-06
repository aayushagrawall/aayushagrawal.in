/**
 * Builds the resume PDF from the web resume (static/cv/index.html), so the two
 * can never drift apart. Edit static/cv/index.html, then run:
 *
 *     npm run resume
 *
 * It renders the page in Chromium (real, selectable text that job portals can
 * read), adds the phone number (kept off the public web page), picks the largest
 * size that fits one A4 page, and writes the PDF to:
 *   - os-app/public/files/            (AayushOS, /os/files/...)
 *   - static/os-lite/files/           (AayushOS Lite)
 *   - ../aayushagrawal.codes/assets/docs/  (if that repo is checked out next to this one)
 *
 * Needs Playwright with Chromium once:  npm i -D playwright && npx playwright install chromium
 */
const fs = require('fs');
const path = require('path');

const PHONE = '8936869120';
const NAME = 'Aayush-Agrawal-Resume.pdf';
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'static/cv/index.html');
const TARGETS = [
    path.join(ROOT, 'os-app/public/files', NAME),
    path.join(ROOT, 'static/os-lite/files', NAME),
    path.join(ROOT, '../aayushagrawal.codes/assets/docs', NAME),
];

let playwright;
try {
    playwright = require('playwright');
} catch (e) {
    console.warn('[resume] Playwright is not installed, so the PDF was not rebuilt.');
    console.warn('[resume] Install it once with: npm i -D playwright && npx playwright install chromium');
    process.exit(0);
}

const countPages = (buf) => (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;

(async () => {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    // only local files: no analytics or other network requests in the PDF render
    await page.route(/^https?:/, (r) => r.abort());
    await page.goto('file://' + SOURCE, { waitUntil: 'load' });
    await page.evaluate((phone) => {
        const email = document.querySelector('.contact a[href^="mailto"]');
        const span = document.createElement('span');
        span.textContent = phone;
        email.after(span);
        document.title = 'Aayush Agrawal - Resume';
    }, PHONE);
    await page.addStyleTag({
        content: `
        @page { size: A4; margin: 15mm 16mm; }
        html, body { background: #fff !important; }
        .bar, .foot { display: none !important; }
        main { box-shadow: none !important; margin: 0 !important; padding: 0 !important; max-width: none !important; }
        a { color: var(--accent) !important; }
        .contact span { color: var(--muted); }`,
    });
    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => document.fonts.ready);

    let pdf = null;
    let used = 0;
    for (const scale of [1, 0.96, 0.92, 0.88, 0.85, 0.82, 0.8, 0.77, 0.74, 0.7, 0.66, 0.62]) {
        const buf = await page.pdf({ format: 'A4', printBackground: true, scale, preferCSSPageSize: true });
        if (countPages(buf) === 1) {
            pdf = buf;
            used = scale;
            break;
        }
    }
    await browser.close();
    if (!pdf) {
        console.error('[resume] The resume no longer fits on one A4 page, even at 62%. Shorten static/cv/index.html.');
        process.exit(1);
    }
    // ignore the timestamps and ID Chrome stamps into every PDF, so an unchanged
    // resume doesn't show up as a changed file in git
    const strip = (b) => b.toString('latin1').replace(/\/(CreationDate|ModDate) \(D:[^)]*\)/g, '').replace(/\/ID \[<[^\]]*\]/g, '');
    for (const t of TARGETS) {
        if (!fs.existsSync(path.dirname(t))) continue;
        if (fs.existsSync(t) && strip(fs.readFileSync(t)) === strip(pdf)) {
            console.log('[resume] unchanged', path.relative(ROOT, t));
            continue;
        }
        fs.writeFileSync(t, pdf);
        console.log('[resume] wrote', path.relative(ROOT, t));
    }
    console.log(`[resume] one A4 page at ${Math.round(used * 100)}% scale, ${(pdf.length / 1024).toFixed(0)} KB`);
})();
