# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary visitor is an internship recruiter or hiring engineer who has followed a link from a resume, LinkedIn or GitHub to check out Aayush Agrawal. They are usually short on time and want to answer one thing: is this student worth contacting? Success for this visitor is opening the resume (PDF or `/cv/`) or reaching the contact details.

Other developers and friends also visit to play with the room, but they are a secondary audience and do not outrank the recruiter.

## Product Purpose

aayushagrawal.in is the personal portfolio of Aayush Agrawal, a B.E. student in Artificial Intelligence and Machine Learning at BMS College of Engineering, Bengaluru (expected April 2028), who is open to internships. It exists to get him considered for an internship. It works when a recruiter leaves with the resume or contact details, and with a clear memory of who he is.

## Positioning

The site is itself the evidence. Instead of describing skills, it lets the visitor walk up to a CRT computer in a 3D bedroom and use AayushOS, a working retro desktop with apps, games and achievements. Craft comes first: it proves he builds detailed things and finishes them. Personality comes second and makes it memorable: his room, the cat, White the desk assistant, live Bangalore weather and time of day.

## Operating Context

- Visitors arrive from a resume link, LinkedIn, GitHub, a shared short link (`/resume`, `/os/#projects` and similar) or search.
- Desktop visitors get the 3D room, with AayushOS on the monitor. Phone visitors get a choice screen first and can explore the 3D room or go straight to AayushOS Lite.
- `/cv/` is the web resume and the source of the PDF. `/about/`, `/experience/`, `/projects/` and `/contact/` are plain indexable pages for search engines and job portals.
- A separate minimal portfolio lives at aayushagrawal.codes. It is a different project and is not changed from this one.

## Capabilities and Constraints

- Three surfaces share one body of content: the 3D room (`src/`), AayushOS (`os-app/`, served at `/os/`) and AayushOS Lite (`static/os-lite/`). Showcase content exists in both OS versions and must stay in step with the resume.
- The loading screen can always be skipped to go straight to the desktop.
- Static site on GitHub Pages. Every push to `main` goes live, so unfinished work stays behind a switch.
- The room's lighting is baked, and Three.js is pinned at r137.
- Terminology: the OS is "AayushOS" (the phone version is "AayushOS Lite"); the energy drink and the desk assistant are both called "White".
- Open decision: phones currently load the 3D room only on request, which keeps the mobile PageSpeed score high. This is how the site works today, but it was not confirmed as a fixed commitment.

## Brand Commitments

- AayushOS and AayushOS Lite keep their Windows 98 look: a retro desktop with pixel fonts. Design work refines it and never replaces it.
- No brand artwork or copyrighted designs anywhere in the room or the OS. Objects stay generic.
- Only open-licence fonts (listed in the README). No Microsoft or Adobe fonts.
- Credits to Henry Heffernan (the scene and the inner site, used with permission), 98.css and the font authors stay in the README, `LICENSE.md`, `NOTICE.md` and the Credits app.
- Copy is first person, plain and lightly playful (for example the Terminal's `sudo hire aayush`).

## Evidence on Hand

- Resume: `static/cv/index.html`, and the PDF rendered from it.
- Real projects, listed at the top of `static/os-lite/os.js` and in `os-app/src/components/showcase/`: imgurr.me, a Discord moderation bot, a QR code generator, a typing test, clienterr.com, an attendance calculator Shortcut and aayushagrawal.codes.
- Education, volunteering (BMSCE UTSAV, Rotaract Club of BMSCE) and two certifications, as written on the resume.
- A demo recording at `docs/demo.gif` and preview cards in `static/images/og/`.
- There is no work experience at a company, and there are no testimonials, client logos or usage numbers. Future work must not invent any.

## Product Principles

1. The recruiter's path is never blocked. The resume, `/cv/` and contact details stay reachable in a click or two without going through the 3D room.
2. The build is the proof. Every detail a visitor can touch should work properly, because the site's finish is the argument for hiring him.
3. Personality supports the case and never gets in its way. Toys and jokes are welcome as long as they don't slow down or hide the facts.
4. One truth across surfaces. The resume, the two OS versions and the indexable pages say the same things.
5. Honest content only: real projects and real dates.

## Accessibility & Inclusion

- Anything that moves on its own respects the system's reduce-motion setting, and the 3D room can be skipped.
- On touch devices everything has a tap path; nothing depends on double-click or hover.
- The content is available as plain HTML (`/cv/`, the indexable pages and the text version of the OS) for visitors and tools that can't run the 3D scene.
