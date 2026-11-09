# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## aayushagrawal.in

Aayush Agrawal's 3D portfolio: a Three.js bedroom with a CRT computer that runs AayushOS. Live at https://aayushagrawal.in (GitHub Pages). `README.md` has the full feature-by-feature notes; read the relevant bullet there before changing a feature, and update it when behaviour changes.

## Layout

| Path | What it is |
|---|---|
| `src/` | The 3D scene (TypeScript, Three.js r137, webpack). `src/script.ts` lazy-loads `Application/Application.ts`. |
| `src/index.html` | Page shell: SEO tags, phone choice screen (`#phone-gate-room`), preloads. |
| `os-app/` | AayushOS, a React (CRA) desktop served at `/os/` and shown on the 3D monitor in an iframe (`World/MonitorScreen.ts`, placed in 3D with `CSS3DRenderer`). |
| `static/os-lite/` | AayushOS Lite: plain HTML/CSS/JS, no build. The phone version; also runs single apps inside AayushOS via `?app=`. |
| `static/cv/` | Web resume at `/cv/`; the PDF is rendered from it. |
| `scripts/` | `prerender.js` (indexable pages, sitemap), `resume-pdf.js`, texture/sound generators, `room-blender/` (Blender bake of the room). |
| `public/` | Build output. Git-ignored; never edit. |

Key scene files: `World/BakedRoom.ts` (room, lighting, rain), `World/Toys.ts` (football, cat, bed, phone, neon), `World/Personal.ts` (desk items), `Camera/Camera.ts` + `CameraKeyframes.ts`, `UI/components/LoadingScreen.tsx`, `UI/PhoneLite.ts`, `config.ts` (switches).

## Commands

```bash
npm ci && npm run os:install   # first time
npm run dev                    # 3D scene dev server
npm run build                  # everything into public/ (resume PDF, scene, OS, prerender)
npm run build:scene            # scene only (fast); then: rm -rf public/os && cp -r os-app/build public/os
cd os-app && npm start         # AayushOS alone (port 3000); open the scene with ?dev to show it on the monitor
```

`npm run build` needs Playwright for the resume PDF and the prerender; without it both are skipped with only a warning, and the build still exits 0. Install it with `npm i --no-save playwright@1.63.0 && npx playwright install chromium` (the version the deploy workflow pins). Claude Code cloud sessions already have that version and Chromium, so skip the install there. To check a build: `cd public && python3 -m http.server 8080`.

There is no test suite. Verify changes by building and loading the page (desktop and a phone-sized viewport), and check the browser console for errors. TypeScript errors fail the AayushOS build, and so the deploy, so always run it before pushing. ESLint warnings fail it only when `CI=true`; the deploy workflow runs `CI=false npm run build`.

## Deploying

**Every push to `main` deploys to the live site** (`.github/workflows/deploy.yml`). So:

- Build locally and test before pushing.
- Anything not ready for everyone goes behind a switch (`NEXT_FOR_EVERYONE` in `src/Application/config.ts`, with a copy in `src/index.html`; try it with `?next=1`).
- GitHub Pages caches HTML for 10 minutes; add `?v=N` to see a deploy immediately.
- The workflow checks that `/about/`, `/experience/`, `/projects/` and `/contact/` were prerendered. If prerender is skipped they turn into noindex fallbacks and drop out of Google.

## Rules

- **Keep the credits.** The scene is based on Henry Heffernan's MIT code and AayushOS on his inner site, used with permission. Don't remove `LICENSE.md`, `NOTICE.md` or the credits in the README and the Credits app.
- **No brand artwork or copyrighted designs.** The energy drink and the desk assistant are called "White"; the earbuds case, sneakers and posters are generic. No Microsoft or Adobe fonts (only the open-licence fonts listed in the README).
- **Keep content in step.** The resume lives in `static/cv/index.html`; skills are in `DEVICES` in `static/os-lite/os.js`; Showcase pages exist in both `os-app/src/components/showcase/` and the top of `static/os-lite/os.js`. Change both.
- **Changelog.** User-visible changes get a line at the top of `os-app/src/components/applications/WhatsNew.tsx`, in plain language.
- **Bump cache versions** in `static/os-lite/index.html` (`os.css?v=`, `os.js?v=`) when those files change.
- Don't touch the separate profile-README repo or `aayushagrawal.codes` from here. One exception is built in: `npm run resume` (and so `npm run build`) also writes the PDF into `../aayushagrawal.codes/assets/docs/` when that repo is checked out next to this one.

## Things that bite

- **Phones.** `PHONE`/`TOUCH` in `config.ts`. Phones see the choice screen first and load the 3D only after "Explore the 3D room" (this is what keeps the mobile PageSpeed score high; don't load `Application` eagerly). On phones the monitor opens Lite in an overlay (`PhoneLite.ts`). No double-click on touch: give everything a tap path. No full-screen layers over scrollable content on touch devices.
- **Loading screen.** No START button: the room opens when loading finishes; slow or reduced-motion devices get a START 3D / SKIP choice. Audio starts on the first click (`unlock` in `Audio/AudioManager.ts`). Nothing renders before `loadingScreenDone` except one warm-up frame.
- **Room models** are meshopt-compressed and quantized, so node transforms carry an offset and scale: rotate props about the stored pivots in `World/roomData.ts`, and do shader maths in world space. Regenerate with `scripts/room-blender/build_room.py` + `install.sh`, never by hand.
- **Room lighting** is baked: `MeshBasicMaterial` with albedo x lightmap, day and night maps cross-faded in `BakedRoom.compose()`. There are no real lights to tweak.
- **Three.js is r137**; newer APIs and shader chunks may not exist.
- **Respect `REDUCED_MOTION`** for anything that animates on its own.
- Messages between the room, AayushOS and Lite go through `postMessage` (`aos-*` types) and shared `localStorage` keys (`aayushos-*`).
