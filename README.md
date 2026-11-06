# aayushagrawal.in

A 3D portfolio for **Aayush Agrawal**. Walk up to a retro computer and use **AayushOS 98**, a small desktop with my projects, experience, resume and contact.

Live at **[aayushagrawal.in](https://aayushagrawal.in)** · Minimal version at **[aayushagrawal.codes](https://aayushagrawal.codes)**

![Walking up to the desk and using AayushOS](docs/demo.gif)

## How it works

- **3D scene** (`src/`): Three.js scene of a desk and CRT computer. The monitor shows the OS through an iframe placed in 3D with `CSS3DRenderer`.
- **AayushOS** (`os-app/`, served at `/os/`): a React desktop adapted from Henry Heffernan's [portfolio-inner-site](https://github.com/henryjeff/portfolio-inner-site), **used with his permission**. Outline window dragging and resizing, a Start menu, the Showcase site (Home, About, Experience, Projects, Contact), Resume, Codele (a Wordle spin-off), Credits and the shutdown sequence. Extras: 15 achievements, Chai the desk assistant, a screensaver, the Konami code and a boot screen with the startup chime.
- **Desktop niceties**: right-click the desktop for Arrange Icons, Refresh and Properties (wallpaper picker); the taskbar speaker mutes the whole site, 3D sounds included; Alt+W / Alt+M / Alt+Q switch, minimise and close windows, arrow keys + Enter open desktop icons.
- **Short links**: `aayushagrawal.in/projects`, `/resume`, `/about`, `/experience`, `/contact` and `/achievements` each have their own preview card (`static/images/og/`) and open AayushOS on that page.
- **Web resume** (`static/cv/`): an HTML version of the resume at `/cv/`, readable on phones, by search engines and job portals, and print-ready on one A4 page. Keep it in step with the PDF.
- **Night desktop**: from 7 pm to 6 am IST (or with `?night=1`) the default wallpaper is Bangalore Night, and inside the 3D monitor the screen dims slightly to match the room.
- **What's New**: the changelog lives in `os-app/src/components/applications/WhatsNew.tsx`; add new entries at the top.
- **Analytics**: app opens, Chai questions, achievements and resume downloads are counted as GoatCounter events (`os/...` and `os-lite/...`), once per visit.
- **Shareable links**: `/os/#projects`, `#about`, `#experience`, `#contact`, `#resume`, `#terminal`, `#tetris`, `#paint`, `#codele`, `#achievements` open AayushOS straight to that window or page. They work on AayushOS Lite too, and phones are sent there with the link intact.
- **AayushOS Lite** (`static/os-lite/`, served at `/os-lite/`): my original plain HTML/CSS/JS desktop built on [98.css](https://github.com/jdan/98.css). It is the phone-friendly version, and its Terminal (try `help` or `sudo hire aayush`), Tetris, Paint and Recycle Bin also run inside AayushOS windows through `/os-lite/?app=terminal` and friends.
- **Deploy**: `npm run build` writes the whole site to `public/`, which is published to GitHub Pages (`gh-pages` branch, or `.github/workflows/deploy.yml`).

## Run locally

```bash
npm ci
npm run os:install   # once, installs the React OS
npm run dev          # 3D scene dev server
npm run build        # scene + OS, production build into public/
```

To work on the OS alone, run `npm start` inside `os-app/`. The lite OS needs no build: open `static/os-lite/index.html`.

## Editing content

- AayushOS: showcase pages are in `os-app/src/components/showcase/`, desktop apps in `os-app/src/components/os/Desktop.tsx`.
- AayushOS Lite: all content lives at the top of `static/os-lite/os.js`.
- Resume: edit `static/cv/index.html` (the web version at `/cv/`), then run `npm run resume`. It renders that page into the one-page PDF (adding the phone number, which stays off the public page) and writes it to `os-app/public/files/`, `static/os-lite/files/` and, if it's checked out next to this repo, `../aayushagrawal.codes/assets/docs/`. `npm run build` does this too. Needs Playwright once: `npm i -D playwright && npx playwright install chromium`.

## Credits

- **Henry Heffernan** ([henryheffernan.com](https://henryheffernan.com)):
  - The 3D scene is based on [henryjeff/portfolio-website](https://github.com/henryjeff/portfolio-website) (MIT licence, see `LICENSE.md`). Computer model by Mickael Boitte, environment models by Sean Nicolas, as credited in that project.
  - AayushOS is adapted from [henryjeff/portfolio-inner-site](https://github.com/henryjeff/portfolio-inner-site), used with Henry's permission. See `NOTICE.md`. Thank you, Henry!
- [98.css](https://github.com/jdan/98.css) by Jordan Scales (MIT licence, see `static/os-lite/vendor/98css/LICENSE`).
- Fonts: Fraunces (SIL OFL), Tinos (Apache 2.0) and VT323 (SIL OFL), licences in `os-app/src/assets/fonts/` and `static/os-lite/fonts/`.
- Content, icons, AayushOS Lite and the startup chime are by Aayush Agrawal.
