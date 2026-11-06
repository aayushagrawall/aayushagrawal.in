/* AayushOS 98 — a small retro desktop for aayushagrawal.in
 * Original code by Aayush Agrawal. UI chrome from 98.css (MIT, Jordan Scales).
 * Fonts: Fraunces (OFL) and Tinos (Apache 2.0).
 */
(function () {
  'use strict';

  // ---------- Content ----------
  var ME = {
    name: 'Aayush Agrawal',
    email: 'agrawal.aayush38@gmail.com',
    github: 'https://github.com/aayushagrawall',
    linkedin: 'https://www.linkedin.com/in/aayush-agrawall/',
    instagram: 'https://instagram.com/_aayush.agrawal',
    site: 'https://aayushagrawal.codes',
    resume: 'files/Aayush-Agrawal-Resume.pdf'
  };

  var PROJECTS = [
    { name: 'imgurr.me', type: 'Web app', stack: ['JavaScript'], url: 'https://imgurr.me/', urlLabel: 'Open imgurr.me',
      desc: 'Share an image or a short video without making an account. Drop a file, get a link, send it. Files up to 10 MB.' },
    { name: 'Discord Moderation Bot', type: 'Bot', stack: ['Python', 'MongoDB', 'Discord API'], date: 'Sept 2024', url: 'https://github.com/aayushagrawall/clienterrverse-bot', urlLabel: 'View on GitHub',
      desc: 'A feature-rich Discord bot that improves the server experience and adds moderation commands, with slash commands and buttons. Built for the Clienterrverse community.' },
    { name: 'QR Code Generator', type: 'Python tool', stack: ['Python'], date: 'Oct 2024', url: 'https://github.com/aayushagrawall/QR-Code-Generator', urlLabel: 'View on GitHub',
      desc: 'Turns any URL or text into a scannable QR code. Handles custom sizing and encoding.' },
    { name: 'Words Per Minute Test', type: 'Python tool', stack: ['Python'], date: 'Jan 2025', url: 'https://github.com/aayushagrawall/Typing-Test-using-Python', urlLabel: 'View on GitHub',
      desc: 'A console typing test that measures WPM and accuracy against random text prompts. My first-semester project.' },
    { name: 'clienterr.com', type: 'Website', stack: ['JavaScript'], url: 'https://github.com/aayushagrawall/clienterr.com', urlLabel: 'View on GitHub',
      desc: 'Source for the Clienterrverse website, built together with the open-source community.' },
    { name: 'Attendance Calculator', type: 'iOS Shortcut', stack: ['iOS Shortcuts'], url: 'https://routinehub.co/shortcut/25458/', urlLabel: 'Get the shortcut',
      desc: 'An iPhone Shortcut that tells you how many classes you can skip, or must attend, to stay above 85% attendance.' },
    { name: 'aayushagrawal.codes', type: 'Website', stack: ['HTML', 'CSS', 'JavaScript'], url: 'https://aayushagrawal.codes', urlLabel: 'Visit site',
      desc: 'My minimal portfolio: light and dark themes, no build step, hosted on GitHub Pages.' }
  ];

  // ---------- Icons (original pixel art) ----------
  var I = {
    trophy: '<svg viewBox="0 0 16 16" shape-rendering="crispEdges"><path d="M3 1h10v1h2v4h-1v1h-1v1h-1v1h-1v1H9v2h2v1h1v2H4v-2h1v-1h2v-2H6V9H5V8H4V7H3V6H2V2h1z" fill="#000"/><path d="M4 2h8v5h-1v1h-1v1H6V8H5V7H4z" fill="#f6c94d"/><path d="M4 2h2v5H5V7H4z" fill="#ffec8c"/><path d="M5 13h6v1H5z" fill="#805014"/></svg>',
    ultra: '<svg viewBox="0 0 24 26" shape-rendering="crispEdges"><g class="ultra-fizz" fill="#bfe3ff"><rect x="3" y="9" width="1" height="1"/><rect x="20" y="13" width="1" height="1"/><rect x="3" y="16" width="1" height="1"/><rect x="20" y="6" width="1" height="1"/></g><rect x="6" y="24" width="12" height="1" fill="#000" opacity=".25"/><rect x="12" y="1" width="4" height="1" fill="#000"/><rect x="7" y="2" width="10" height="1" fill="#000"/><rect x="6" y="3" width="1" height="1" fill="#000"/><rect x="17" y="3" width="1" height="1" fill="#000"/><rect x="5" y="4" width="1" height="18" fill="#000"/><rect x="18" y="4" width="1" height="18" fill="#000"/><rect x="6" y="22" width="1" height="1" fill="#000"/><rect x="17" y="22" width="1" height="1" fill="#000"/><rect x="7" y="23" width="10" height="1" fill="#000"/><rect x="7" y="3" width="10" height="1" fill="#c9cfd6"/><rect x="6" y="4" width="12" height="2" fill="#aeb5be"/><rect x="7" y="4" width="3" height="1" fill="#e8ecf0"/><rect x="6" y="6" width="12" height="15" fill="#f4f5f7"/><rect x="6" y="6" width="1" height="15" fill="#ffffff"/><rect x="16" y="6" width="2" height="15" fill="#d6dade"/><rect x="15" y="6" width="1" height="15" fill="#a9c1d6"/><rect x="6" y="21" width="12" height="1" fill="#aeb5be"/><rect x="7" y="22" width="10" height="1" fill="#8d949d"/><rect x="12" y="15" width="1" height="1" fill="#7f9db8"/><rect x="11" y="16" width="2" height="1" fill="#7f9db8"/><rect x="11" y="17" width="1" height="1" fill="#7f9db8"/><rect x="10" y="18" width="1" height="1" fill="#7f9db8"/><rect x="8" y="10" width="2" height="2" fill="#000"/><rect x="13" y="10" width="2" height="2" fill="#000"/><rect x="8" y="10" width="1" height="1" fill="#fff"/><rect x="13" y="10" width="1" height="1" fill="#fff"/><rect x="7" y="13" width="1" height="1" fill="#ff9aa8"/><rect x="16" y="13" width="1" height="1" fill="#ff9aa8"/><rect x="9" y="13" width="1" height="1" fill="#000"/><rect x="13" y="13" width="1" height="1" fill="#000"/><rect x="10" y="14" width="3" height="1" fill="#000"/></svg>',
    showcase: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="2" y="3" width="28" height="26" fill="#fff" stroke="#000"/><rect x="2" y="3" width="28" height="5" fill="#000080"/><rect x="25" y="4" width="3" height="3" fill="#c0c0c0"/><path d="M9 26l5-15h4l5 15h-3l-1-3h-6l-1 3zm5-6h4l-2-6z" fill="#000"/></svg>',
    folder: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M2 8h11l2 3h15v17H2z" fill="#f6c94d" stroke="#000"/><rect x="2" y="13" width="28" height="15" fill="#ffdd6e" stroke="#000"/></svg>',
    instagram: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#feda75"/><stop offset=".35" stop-color="#fa7e1e"/><stop offset=".6" stop-color="#d62976"/><stop offset=".85" stop-color="#962fbf"/><stop offset="1" stop-color="#4f5bd5"/></linearGradient></defs><rect x="3" y="3" width="26" height="26" rx="7" fill="url(#igg)" stroke="#000"/><rect x="8" y="8" width="16" height="16" rx="5" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="16" cy="16" r="4" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="21" y="9" width="2.5" height="2.5" fill="#fff"/></svg>',
    github: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="3" width="26" height="26" rx="13" fill="#24292f" stroke="#000"/><path d="M10 9l3 3h6l3-3v5c1 1 1.5 2.5 1.5 4 0 3.5-2.5 5.5-6 6v3h-3v-3c-3.5-.5-6-2.5-6-6 0-1.5.5-3 1.5-4z" fill="#fff"/><path d="M9 23c1.5 0 2 1.5 4 1.5" stroke="#fff" stroke-width="1.5" fill="none"/></svg>',
    linkedin: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="3" width="26" height="26" rx="3" fill="#0a66c2" stroke="#000"/><rect x="8" y="13" width="4" height="12" fill="#fff"/><rect x="8" y="7" width="4" height="4" fill="#fff"/><path d="M15 13h4v2c1-1.5 2.5-2.3 4.3-2.3 2.6 0 3.7 1.7 3.7 4.6V25h-4v-7c0-1.5-.6-2.3-1.9-2.3-1.4 0-2.1 1-2.1 2.6V25h-4z" fill="#fff"/></svg>',
    terminal: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="2" y="4" width="28" height="24" fill="#c0c0c0" stroke="#000"/><rect x="2" y="4" width="28" height="4" fill="#000080"/><rect x="4" y="10" width="24" height="16" fill="#000"/><path d="M6 13h2v1h1v1h1v1h-1v1h-1v1H6v-1h1v-1h1v-1H7v-1H6z" fill="#c0c0c0"/><rect x="12" y="18" width="7" height="2" fill="#c0c0c0"/></svg>',
    recycle: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M7 9h18l-2 20H9z" fill="#dfe8e8" stroke="#000"/><rect x="5" y="6" width="22" height="3" fill="#c0c0c0" stroke="#000"/><rect x="13" y="3" width="6" height="3" fill="#c0c0c0" stroke="#000"/><path d="M12 13v12M16 13v12M20 13v12" stroke="#808080"/><rect x="10" y="18" width="5" height="4" fill="#fff" stroke="#000"/><rect x="16" y="15" width="5" height="4" fill="#ffdd6e" stroke="#000"/></svg>',
    bulb: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><circle cx="16" cy="12" r="9" fill="#ff0" stroke="#000"/><rect x="12" y="20" width="8" height="5" fill="#c0c0c0" stroke="#000"/><rect x="13" y="25" width="6" height="3" fill="#808080" stroke="#000"/><path d="M13 13l3 4 3-4" fill="none" stroke="#a80"/></svg>',
    paint: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M4 16c0-7 6-12 13-12 6 0 11 4 11 9 0 4-3 5-6 5h-3c-2 0-3 1-3 3 0 2 1 3 1 4 0 2-2 3-4 3-5 0-9-5-9-12z" fill="#e8d3a8" stroke="#000"/><circle cx="10" cy="13" r="2.2" fill="#e5393b"/><circle cx="15" cy="9" r="2.2" fill="#f6c94d"/><circle cx="21" cy="9" r="2.2" fill="#3cbf4a"/><circle cx="24" cy="14" r="2.2" fill="#2f5fe0"/><path d="M18 31l9-14 2 1-8 14z" fill="#8a5a2b" stroke="#000"/></svg>',
    doc: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M6 2h14l6 6v22H6z" fill="#fff" stroke="#000"/><path d="M20 2v6h6" fill="#ddd" stroke="#000"/><rect x="9" y="12" width="14" height="2" fill="#000080"/><rect x="9" y="16" width="14" height="2" fill="#777"/><rect x="9" y="20" width="10" height="2" fill="#777"/><rect x="9" y="24" width="12" height="2" fill="#777"/></svg>',
    computer: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="4" y="3" width="24" height="18" fill="#c0c0c0" stroke="#000"/><rect x="7" y="6" width="18" height="12" fill="#008080"/><rect x="9" y="8" width="5" height="4" fill="#fff"/><rect x="12" y="21" width="8" height="3" fill="#888"/><rect x="6" y="24" width="20" height="5" fill="#c0c0c0" stroke="#000"/></svg>',
    tetris: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="4" y="18" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="12" y="18" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="20" y="18" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="20" y="10" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="4" y="2" width="8" height="8" fill="#00c8e6" stroke="#000"/><rect x="4" y="10" width="8" height="8" fill="#00c8e6" stroke="#000"/><rect x="12" y="10" width="8" height="8" fill="#a347d6" stroke="#000"/></svg>',
    globe: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><circle cx="16" cy="16" r="12" fill="#4fa3e0" stroke="#000"/><path d="M10 9h6v5h-4v4h-3v-4H7zM18 16h6v6h-3v4h-4v-6h1z" fill="#3c9a3c"/><path d="M4 16h24M16 4v24" stroke="#1d5f99" fill="none"/></svg>',
    credits: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M6 2h20v28H6z" fill="#fff" stroke="#000"/><rect x="9" y="6" width="14" height="2" fill="#000"/><rect x="11" y="11" width="10" height="2" fill="#555"/><rect x="9" y="15" width="14" height="2" fill="#000"/><rect x="11" y="20" width="10" height="2" fill="#555"/><rect x="9" y="24" width="14" height="2" fill="#000"/></svg>',
    mail: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="8" width="26" height="17" fill="#fff" stroke="#000"/><path d="M3 8l13 10L29 8" fill="none" stroke="#000"/></svg>',
    power: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="3" width="26" height="26" fill="#c0c0c0" stroke="#000"/><path d="M11 10a8 8 0 1 0 10 0" fill="none" stroke="#c00" stroke-width="3"/><rect x="14.5" y="6" width="3" height="10" fill="#c00"/></svg>',
    speaker: '<svg viewBox="0 0 16 16" shape-rendering="crispEdges"><path d="M2 6h3l4-3v10l-4-3H2z" fill="#ff0" stroke="#000"/><path d="M11 5c1.5 1.5 1.5 4.5 0 6M13 3c2.7 2.7 2.7 7.3 0 10" fill="none" stroke="#000"/></svg>'
  };

  var TOUCH = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  var SMALL = window.matchMedia && matchMedia('(max-width: 760px)').matches;
  // Single-app mode: /os-lite/?app=terminal runs one app full-frame inside a window
  // of the main AayushOS (the React desktop). Other apps open in the parent desktop.
  var SINGLE = (function () {
    try { return new URLSearchParams(location.search).get('app') || ''; } catch (e) { return ''; }
  })();
  if (SINGLE) SMALL = false;
  function toParent(msg) { try { window.parent.postMessage(msg, '*'); } catch (e) {} }
  // ---------- Achievements (progress is shared with the main AayushOS) ----------
  var ACH = [
    ['explorer', 'Explorer', 'Open every app on the desktop.', 'Opened every app on the desktop.'],
    ['reader', 'Background Check', 'Read every page of My Showcase.', 'Read About, Experience, Projects and Contact.'],
    ['resume', 'Due Diligence', 'Take a look at the resume.', 'Opened the resume.'],
    ['recruiter', 'Root Access', 'Find the magic words for the Terminal.', 'Ran sudo hire aayush.'],
    ['konami', 'Old School', 'Some codes never get old.', 'Entered the Konami code.'],
    ['tetris', 'Block Party', 'Score 1,000 points in Tetris.', 'Scored 1,000 points in Tetris.'],
    ['tetris4', 'Line Cook', 'Clear four lines at once in Tetris.', 'Cleared four lines at once.'],
    ['codele', 'Codebreaker', 'Win a game of Codele (on the big-screen AayushOS).', 'Solved Codele.'],
    ['artist', 'Artist', 'Save a drawing from Paint.', 'Saved a Paint masterpiece.'],
    ['dumpster', 'Dumpster Diver', "Peek inside something that's been thrown away.", 'Opened a file in the Recycle Bin.'],
    ['afk', 'AFK', 'Step away from the computer for a while.', 'Watched the screensaver.'],
    ['chatty', 'Small Talk', 'Ask White three questions.', 'Asked White three questions.'],
    ['refuel', 'Refuel', 'Crack open a can of White.', 'Opened a cold can of White.'],
    ['shutdown', 'Persistent', 'Try to turn the computer off. A few times.', 'Shut down AayushOS five times.'],
    ['night', 'Night Owl', 'Visit when Bangalore is asleep.', 'Visited between midnight and 5 am IST.'],
    ['all', 'Completionist', 'Unlock every other achievement.', 'Unlocked everything. Respect.']
  ];
  var LITE_APPS = ['showcase', 'resume', 'terminal', 'tetris', 'paint', 'mycomputer', 'recycle', 'credits', 'achievements'];
  var READER = ['about', 'experience', 'projects', 'contact'];
  function loadList(k) { try { var v = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function saveList(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function addTo(k, item, all) {
    var seen = loadList(k);
    if (seen.indexOf(item) < 0) { seen.push(item); saveList(k, seen); }
    return all.every(function (a) { return seen.indexOf(a) >= 0; });
  }
  var toastQ = [], toastOn = false;
  function achieve(id) {
    if (SINGLE) { toParent({ type: 'aos-achieve', id: id }); return; }
    var a = ACH.filter(function (x) { return x[0] === id; })[0];
    if (!a) return;
    var got = loadList('aayushos-achievements');
    if (got.indexOf(id) >= 0) return;
    got.push(id); saveList('aayushos-achievements', got);
    track('achievement/' + id, 'Achievement: ' + a[1]);
    toastQ.push(a); nextToast();
    if (typeof refreshAch === 'function') refreshAch();
    // Codele only exists on the big-screen OS, so phones can finish without it
    var need = ACH.map(function (x) { return x[0]; }).filter(function (x) { return x !== 'all' && x !== 'codele'; });
    if (need.every(function (x) { return got.indexOf(x) >= 0; })) setTimeout(function () { achieve('all'); }, 600);
  }
  function nextToast() {
    if (toastOn || !toastQ.length) return;
    var a = toastQ.shift(); toastOn = true;
    var t = document.createElement('div');
    t.className = 'window ach-toast';
    t.innerHTML = '<div class="title-bar"><div class="title-bar-text">' + I.trophy + '<span>Achievement unlocked!</span></div></div>' +
      '<div class="window-body ach-toast-body">' + I.trophy + '<div><b>' + esc(a[1]) + '</b><p>' + esc(a[3]) + '</p></div></div>';
    t.addEventListener('click', function () { t.remove(); openApp('achievements'); });
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); toastOn = false; nextToast(); }, 4200);
  }
  function loadScript(src, cb) {
    var id = 'js-' + src.replace(/\W/g, '');
    if (document.getElementById(id)) { if (window.aosCertificate) cb(); else document.getElementById(id).addEventListener('load', cb); return; }
    var sc = document.createElement('script'); sc.id = id; sc.src = src; sc.onload = cb; document.head.appendChild(sc);
  }
  var refreshAch = null;

  // ---------- Click tracking (GoatCounter events, once per visit each) ----------
  function track(path, title) {
    if (SINGLE) return; // the main AayushOS counts these
    try {
      var done = JSON.parse(sessionStorage.getItem('aayushos-lite-tracked') || '[]');
      if (done.indexOf(path) >= 0) return;
      var gc = window.goatcounter;
      if (!gc || !gc.count) return;
      gc.count({ path: 'os-lite/' + path, title: title || path, event: true });
      done.push(path); sessionStorage.setItem('aayushos-lite-tracked', JSON.stringify(done));
    } catch (e) {}
  }

  // ---------- Helpers ----------
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ext(url, label) { return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label || url) + '</a>'; }

  // ---------- Showcase (the main "website" window) ----------
  var NAV = [['home', 'Home'], ['about', 'About'], ['experience', 'Experience'], ['projects', 'Projects'], ['contact', 'Contact']];

  var PAGES = {
    about: function () {
      return '<h1 class="sc-title">Welcome</h1>' +
        '<h3 class="sc-sub">I\'m Aayush Agrawal!</h3>' +
        '<div class="sc-body">' +
        '<p>I\'m an undergraduate in Artificial Intelligence &amp; Machine Learning at <b>BMS College of Engineering</b> in Bangalore, expected to graduate in 2028. I build small, useful software: Python tools, Discord bots and websites.</p>' +
        '<p>I like building things from scratch, whether that\'s a quick Python utility, a bot for a community, or a long dig into how a model actually learns. I\'m part of <b>@clienterrverse</b>, where I work on open-source projects with other developers and learn how real-world software gets made.</p>' +
        '<div class="sc-callout"><p>Looking for my resume?</p>' +
        '<a href="' + ME.resume + '" download><b>Click here to download it!</b></a></div>' +
        '<h3 class="sc-h">Quick facts</h3>' +
        '<table class="sc-facts"><tbody>' +
        '<tr><td>Degree</td><td>B.E. AI &amp; ML (expected Apr 2028)</td></tr>' +
        '<tr><td>College</td><td>BMS College of Engineering</td></tr>' +
        '<tr><td>Based in</td><td>Bangalore, India</td></tr>' +
        '<tr><td>Languages</td><td>English, Hindi, Nepali</td></tr>' +
        '<tr><td>Status</td><td>Open to internships &amp; collaborations</td></tr>' +
        '</tbody></table>' +
        '<h3 class="sc-h">Tools I use</h3>' +
        '<p>Python, JavaScript, Java, C, HTML &amp; CSS, Node.js, Discord.js, MySQL, MongoDB, Machine Learning and Git.</p>' +
        '<p>When I\'m not coding, I\'m reading docs, taking things apart to see how they work, and collecting ideas for the next side project. Thanks for stopping by!</p>' +
        '</div>';
    },
    experience: function () {
      function job(title, where, date, bullets) {
        return '<div class="sc-job"><div class="sc-row"><h2>' + title + '</h2><span>' + date + '</span></div>' +
          '<div class="sc-row"><h3><i>' + where + '</i></h3></div>' +
          (bullets ? '<ul>' + bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') + '</ul>' : '') + '</div>';
      }
      return '<h1 class="sc-title">Experience</h1>' +
        '<div class="sc-body">' +
        '<div class="sc-callout"><p>Want the one-page version?</p><a href="' + ME.resume + '" download><b>Download my resume</b></a></div>' +
        '<h3 class="sc-h">Education</h3>' +
        job('BMS College of Engineering', 'B.E. Artificial Intelligence &amp; Machine Learning, Bengaluru', 'Expected 2028') +
        job('Shiv Jyoti International School', 'CBSE Grade 11–12, Physics, Chemistry, Math, Kota', '2024') +
        job('Mayo College', 'CBSE Grade 5–10, Ajmer', '2022') +
        '<h3 class="sc-h">Leadership</h3>' +
        job('Student Volunteer', 'BMSCE UTSAV, college fest', '2025 – 2026', [
          'Managed end-to-end distribution of festival merchandise across sales counters.',
          'Worked with committee members on merch strategy and sales targets for the fest.']) +
        job('Member', 'Rotaract Club of BMSCE', '2023 – 2024', [
          'Community service and leadership initiatives across Bengaluru.',
          'Contributed 40+ hours of social and community service.']) +
        '<h3 class="sc-h">Certifications</h3>' +
        job('C for Beginners', 'Great Learning', 'Jan 2025') +
        job('Using MongoDB with Python', 'MongoDB', 'Nov 2024') +
        '</div>';
    },
    projects: function () {
      return '<h1 class="sc-title">Projects</h1>' +
        '<h3 class="sc-sub">&amp; side quests</h3>' +
        '<div class="sc-body"><p>Things I\'ve built, from Python tools to bots and websites. Click a link to see the code or try it out.</p>' +
        PROJECTS.map(function (p) {
          return '<div class="sc-project" id="proj-' + PROJECTS.indexOf(p) + '">' +
            '<div class="sc-row"><h2>' + esc(p.name) + '</h2>' + (p.date ? '<span>' + esc(p.date) + '</span>' : '') + '</div>' +
            '<p class="sc-meta"><b>' + esc(p.type) + '</b> · ' + p.stack.map(esc).join(', ') + '</p>' +
            '<p>' + esc(p.desc) + '</p>' +
            '<p>' + ext(p.url, p.urlLabel + ' »') + '</p></div>';
        }).join('') +
        '</div>';
    },
    contact: function () {
      return '<h1 class="sc-title">Contact</h1>' +
        '<div class="sc-body">' +
        '<p>I\'m open to internships, collaborations, or just a chat about AI and ML. Send me a message here or reach me at ' + ext('mailto:' + ME.email, ME.email) + '.</p>' +
        '<div class="sc-socials">' +
          '<a class="sc-social" href="' + ME.github + '" target="_blank" rel="noopener"><b>GitHub</b><span>aayushagrawall</span></a>' +
          '<a class="sc-social" href="' + ME.linkedin + '" target="_blank" rel="noopener"><b>LinkedIn</b><span>aayush-agrawall</span></a>' +
          '<a class="sc-social" href="' + ME.instagram + '" target="_blank" rel="noopener"><b>Instagram</b><span>_aayush.agrawal</span></a>' +
        '</div>' +
        '<form class="sc-form" id="sc-form">' +
          '<label><span>Your name <span class="req">*</span></span><input id="sc-name" type="text" required></label>' +
          '<label><span>Message <span class="req">*</span></span><textarea id="sc-msg" required></textarea></label>' +
          '<div><button type="submit" class="sc-send">Send Message</button></div>' +
        '</form></div>';
    }
  };

  // Hit counter: reads the public GoatCounter count for the home page (needs
  // "Allow adding visitor counts on your website" enabled in GoatCounter settings).
  var hitCount = null;
  function loadCounter(root) {
    function paint(n) {
      var box = root.querySelector('#sc-counter'); if (!box) return;
      var digits = String(n).replace(/\D/g, '');
      if (!digits) return;
      while (digits.length < 6) digits = '0' + digits;
      root.querySelector('#sc-digits').innerHTML = digits.split('').map(function (d) { return '<i>' + d + '</i>'; }).join('');
      box.hidden = false;
    }
    if (hitCount !== null) return paint(hitCount);
    var path = encodeURIComponent((location.host || 'aayushagrawal.in') + '/');
    // GoatCounter answers 404 (with a JSON body of count 0) until the page has
    // recorded visits, and its numbers lag a little, so read the body either way
    // and include the current visitor (+1).
    fetch('https://clienterr.goatcounter.com/counter/' + path + '.json')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || j.count === undefined) return; // counts not public yet: keep the counter hidden
        hitCount = (parseInt(String(j.count).replace(/\D/g, ''), 10) || 0) + 1; paint(hitCount);
      })
      .catch(function () {});
  }

  function Showcase(win) {
    var root = win.querySelector('.sc');
    function render(page) {
      if (READER.indexOf(page) >= 0 && addTo('aayushos-seen-pages', '/' + page, READER.map(function (r) { return '/' + r; }))) achieve('reader');
      if (page === 'home') {
        root.className = 'sc sc-home';
        root.innerHTML =
          '<div class="sc-hero">' +
            '<h1>Aayush<br>Agrawal</h1>' +
            '<h2>Developer &amp; AI/ML Student</h2>' +
            '<nav class="sc-hnav">' + NAV.slice(1).map(function (n) { return '<a href="#" data-page="' + n[0] + '">' + n[1].toUpperCase() + '</a>'; }).join('') + '</nav>' +
            '<div class="sc-counter" id="sc-counter" hidden>You are visitor <span class="sc-digits" id="sc-digits"></span></div>' +
          '</div>';
        loadCounter(root);
      } else {
        root.className = 'sc sc-inner';
        root.innerHTML =
          '<aside class="sc-side">' +
            '<h1>Aayush<br>Agrawal</h1>' +
            '<h3>Showcase \'26</h3>' +
            '<nav class="sc-vnav">' + NAV.map(function (n) {
              var link = '<a href="#" data-page="' + n[0] + '"' + (n[0] === page ? ' class="cur"' : '') + '>' + n[1].toUpperCase() + '</a>';
              if (n[0] === 'projects' && page === 'projects') {
                link += '<div class="sc-subnav">' + PROJECTS.map(function (p, i) { return '<a href="#" data-proj="' + i + '">' + esc(p.name).toUpperCase() + '</a>'; }).join('') + '</div>';
              }
              return link;
            }).join('') + '</nav>' +
          '</aside>' +
          '<main class="sc-main">' + PAGES[page]() + '</main>';
        var form = root.querySelector('#sc-form');
        if (form) form.addEventListener('submit', function (e) {
          e.preventDefault();
          var name = root.querySelector('#sc-name').value.trim(), msg = root.querySelector('#sc-msg').value.trim();
          window.open('mailto:' + ME.email + '?subject=' + encodeURIComponent('Hello from ' + (name || 'aayushagrawal.in')) + '&body=' + encodeURIComponent(msg + '\n\n— ' + name), '_blank');
        });
      }
      root.scrollTop = 0;
      var main = root.querySelector('.sc-main'); if (main) main.scrollTop = 0;
    }
    root.addEventListener('click', function (e) {
      var pj = e.target.closest('[data-proj]');
      if (pj) {
        e.preventDefault();
        var t = root.querySelector('#proj-' + pj.dataset.proj);
        if (t) root.scrollTo({ top: t.offsetTop - 30, behavior: 'smooth' });
        return;
      }
      var a = e.target.closest('[data-page]');
      if (a) { e.preventDefault(); render(a.dataset.page); }
    });
    win.showPage = render;
    render('home');
  }

  // ---------- Apps ----------
  // ---------- Skills, shown as a Device Manager ----------
  // [category, icon, [[name, maker, used in], ...]]. Keep in step with the resume.
  var DEVICES = [
    ['Programming languages', 'chip', [['Python', 'Python Software Foundation', 'Python tools'], ['JavaScript', 'Ecma International (ECMAScript)', 'websites and Discord bots'], ['Java', 'Oracle', ''], ['C', 'ISO/IEC', '']]],
    ['Web', 'globe', [['HTML & CSS', 'W3C / WHATWG', 'clienterr.com, imgurr.me and this site'], ['Node.js', 'OpenJS Foundation', 'Discord bots'], ['Discord.js', 'discord.js contributors', 'a Discord moderation bot']]],
    ['Databases', 'db', [['MySQL', 'Oracle', ''], ['MongoDB', 'MongoDB, Inc.', '']]],
    ['AI & machine learning', 'brain', [['Machine learning', 'BMS College of Engineering (B.E. AI & ML)', 'coursework']]],
    ['Tools', 'tool', [['Git', 'Git contributors', 'every project, including this one']]],
    ['Spoken languages', 'talk', [['English (Professional)', '', ''], ['Hindi (Professional)', '', ''], ['Nepali (Native)', '', '']]],
    ['Fuel', 'can', [['White, 500 ml', '', 'late-night coding sessions']]]
  ];
  var DI = {
    pc: '<svg class="dmi" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect x="1" y="1" width="14" height="10" fill="#c0c0c0" stroke="#000"/><rect x="3" y="3" width="10" height="6" fill="#008080"/><rect x="5" y="12" width="6" height="2" fill="#808080"/><rect x="3" y="14" width="10" height="1" fill="#000"/></svg>',
    chip: '<svg class="dmi" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect x="3" y="3" width="10" height="10" fill="#333" stroke="#000"/><rect x="5" y="5" width="6" height="6" fill="#ff6a1a"/><path d="M1 5h2M1 8h2M1 11h2M13 5h2M13 8h2M13 11h2M5 1v2M8 1v2M11 1v2M5 13v2M8 13v2M11 13v2" stroke="#808080"/></svg>',
    globe: '<svg class="dmi" viewBox="0 0 16 16" shape-rendering="crispEdges"><circle cx="8" cy="8" r="6.5" fill="#3c7bd6" stroke="#000"/><path d="M4 5h3v2H5v3H3V6zM9 4h3v3h-2v3H9z" fill="#3cbf4a"/></svg>',
    db: '<svg class="dmi" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect x="3" y="3" width="10" height="11" fill="#f6c94d" stroke="#000"/><rect x="3" y="2" width="10" height="2" fill="#ffec8c" stroke="#000"/><path d="M3 7h10M3 10h10" stroke="#c9962c"/></svg>',
    brain: '<svg class="dmi" viewBox="0 0 16 16" shape-rendering="crispEdges"><path d="M5 2h6v1h2v2h1v5h-1v2h-2v1H9v1H7v-1H5v-1H3v-2H2V5h1V3h2z" fill="#ff9fb0" stroke="#000"/><path d="M8 3v10M5 6h2M9 8h3M5 10h2" stroke="#c06a7a"/></svg>',
    tool: '<svg class="dmi" viewBox="0 0 16 16" shape-rendering="crispEdges"><path d="M10 1h3v1h1v3h-1v1h-3L4 12v2H2v-2h2L10 6V3z" fill="#c0c0c0" stroke="#000"/></svg>',
    talk: '<svg class="dmi" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect x="1" y="2" width="14" height="9" fill="#fff" stroke="#000"/><path d="M4 11v3l3-3" fill="#fff" stroke="#000"/><path d="M4 5h8M4 8h5" stroke="#000080"/></svg>',
    can: '<svg class="dmi" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect x="4" y="2" width="8" height="13" fill="#f4f5f7" stroke="#000"/><rect x="4" y="2" width="8" height="2" fill="#aeb5be"/><path d="M8 7l-1 2h2l-1 2" stroke="#7f9db8"/></svg>'
  };
  I.chip = '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="7" y="7" width="18" height="18" fill="#333" stroke="#000"/><rect x="11" y="11" width="10" height="10" fill="#ff6a1a"/><rect x="13" y="13" width="3" height="3" fill="#ffb07a"/><path d="M2 10h5M2 14h5M2 18h5M2 22h5M25 10h5M25 14h5M25 18h5M25 22h5M10 2v5M14 2v5M18 2v5M22 2v5M10 25v5M14 25v5M18 25v5M22 25v5" stroke="#9a9a9a" stroke-width="2"/></svg>';

  var APPS = {
    showcase: {
      title: 'Aayush Agrawal - Showcase 2026', short: 'My Showcase', icon: 'showcase', w: 940, h: 860, x: 136, y: 24, ie: true,
      status: '© Copyright 2026 Aayush Agrawal',
      render: function () { return '<div class="sc"></div>'; },
      mount: Showcase
    },

    resume: {
      title: 'Resume.pdf', icon: 'doc', w: 820, h: 820, x: 300, y: 20,
      status: 'Aayush-Agrawal-Resume.pdf',
      render: function () {
        return '<div class="addr"><span>File</span><input readonly value="C:\\Aayush\\Documents\\Aayush-Agrawal-Resume.pdf">' +
          '<a class="button-link" href="' + ME.resume + '" download>Download</a>' +
          '<a class="button-link" href="' + ME.resume + '" target="_blank" rel="noopener">Open</a>' +
          '<a class="button-link" href="/cv/" target="_blank" rel="noopener">Web</a></div>' +
          '<iframe class="resume-frame" src="' + ME.resume + '#view=FitH" title="Aayush Agrawal resume"></iframe>';
      }
    },

    mycomputer: {
      title: 'This Computer', icon: 'computer', w: 600, h: 560, x: 340, y: 90,
      status: 'System properties',
      render: function () {
        return '<div class="page" style="text-align:center">' +
          '<div style="width:96px;margin:6px auto 10px">' + I.computer + '</div>' +
          '<h2 style="border:none;margin-top:0">AayushOS 98</h2>' +
          '<p>Bangalore Edition · Build 2026.11</p>' +
          '<p class="muted">Registered to: Aayush Agrawal</p>' +
          '<div class="facts" style="text-align:left;max-width:340px;margin:14px auto">' +
          '<dt>Processor</dt><dd>Curiosity @ 3.0 GHz</dd>' +
          '<dt>Memory</dt><dd>Too many open tabs</dd>' +
          '<dt>Fuel</dt><dd>White</dd>' +
          '<dt>Uptime</dt><dd id="uptime">0s</dd>' +
          '</div>' +
          '<div class="btn-row" style="justify-content:center"><button data-open="credits">Credits</button></div>' +
          '</div>';
      },
      mount: function (win) {
        var start = Date.now(), up = win.querySelector('#uptime');
        var t = setInterval(function () {
          if (!document.body.contains(up)) return clearInterval(t);
          var s = Math.floor((Date.now() - start) / 1000);
          up.textContent = (s >= 60 ? Math.floor(s / 60) + 'm ' : '') + (s % 60) + 's';
        }, 1000);
      }
    },

    welcome: {
      title: 'Welcome', icon: 'bulb', w: 0, h: 0, x: 300, y: 160, fixed: true,
      render: function () {
        return '<div class="wl">' +
          '<div class="wl-head">Welcome to <b>AayushOS</b><span class="wl-98">98</span></div>' +
          '<div class="wl-main">' +
            '<div class="wl-tipbox"><div class="wl-did">' + I.bulb + '<b>Did you know...</b></div><p id="wl-tip"></p></div>' +
            '<div class="wl-btns"><button id="wl-new">What\'s New</button><button id="wl-next">Next Tip</button><button id="wl-close">Close</button></div>' +
          '</div>' +
          '<div class="wl-foot"><input type="checkbox" id="wl-show" checked><label for="wl-show">Show this Welcome Screen next time you start AayushOS</label></div>' +
        '</div>';
      },
      mount: function (win) {
        Welcome(win);
        win.style.left = Math.max(10, (window.innerWidth - win.offsetWidth) / 2) + 'px';
        win.style.top = Math.max(10, (window.innerHeight - 44 - win.offsetHeight) / 2) + 'px';
      }
    },

    recycle: {
      title: 'Recycle Bin', icon: 'recycle', w: 780, h: 470, x: 300, y: 150,
      render: function () {
        return '<div class="rb-bar"><button id="rb-restore">Restore</button><button id="rb-empty">Empty Recycle Bin</button></div>' +
          '<div class="sunken-panel rb-panel"><table class="interactive rb-table"><thead><tr><th>Name</th><th>Type</th><th>Size</th></tr></thead><tbody id="rb-list"></tbody></table></div>' +
          '<div class="status-bar"><p class="status-bar-field" id="rb-count"></p><p class="status-bar-field">Double-click a file to peek inside</p></div>';
      },
      mount: Recycle
    },

    paint: {
      title: 'untitled - Paint', short: 'Paint', icon: 'paint', w: 0, h: 0, x: 180, y: 30, fixed: true,
      render: function () { return '<div class="pt" id="pt"></div>'; },
      mount: function (win) { Paint(win.querySelector('#pt'), win); }
    },

    terminal: {
      title: 'C:\\WINDOWS\\cmd.exe', short: 'Terminal', icon: 'terminal', w: 860, h: 600, x: 260, y: 60,
      render: function () { return '<div class="term" id="term"></div>'; },
      mount: function (win) { Terminal(win.querySelector('#term'), win); }
    },

    tetris: {
      title: 'Tetris', icon: 'tetris', w: 0, h: 0, x: 380, y: 30, fixed: true,
      status: 'Arrow keys to play · Space to drop',
      render: function () { return '<div class="tetris" id="tetris"></div>'; },
      mount: function (win) { Tetris(win.querySelector('#tetris'), win); }
    },

    skills: {
      title: 'Device Manager', icon: 'chip', w: 520, h: 560, x: 360, y: 60,
      status: 'Double-click a device for details',
      render: function () {
        var tree = DEVICES.map(function (cat, ci) {
          return '<li><details open><summary>' + DI[cat[1]] + esc(cat[0]) + '</summary><ul>' +
            cat[2].map(function (d, di) { return '<li><a href="#" class="dm-dev" data-c="' + ci + '" data-d="' + di + '">' + DI[cat[1]] + esc(d[0]) + '</a></li>'; }).join('') +
            '</ul></details></li>';
        }).join('');
        return '<div class="dm">' +
          '<p class="dm-view"><b>View devices by type</b></p>' +
          '<ul class="tree-view dm-tree"><li><details open><summary>' + DI.pc + 'AAYUSH-PC</summary><ul>' + tree + '</ul></details></li></ul>' +
          '<div class="dm-btns"><button data-dm="props">Properties</button><button data-dm="refresh">Refresh</button><button disabled>Remove</button><button data-dm="print">Print...</button></div>' +
          '</div>';
      },
      mount: function (win) {
        var sel = null;
        var status = win.querySelector('.status-bar-field');
        function props(c, d) {
          var cat = DEVICES[c], dev = cat[2][d];
          var old = win.querySelector('.dm-props'); if (old) old.remove();
          var box = el('<div class="window dm-props"><div class="title-bar"><div class="title-bar-text">' + esc(dev[0]) + ' Properties</div><div class="title-bar-controls"><button aria-label="Close"></button></div></div>' +
            '<div class="window-body"><div class="dm-ph">' + DI[cat[1]] + '<b>' + esc(dev[0]) + '</b></div>' +
            '<table class="dm-pt"><tr><td>Device type:</td><td>' + esc(cat[0]) + '</td></tr>' + (dev[1] ? '<tr><td>Manufacturer:</td><td>' + esc(dev[1]) + '</td></tr>' : '') + '</table>' +
            '<fieldset><legend>Device status</legend><p>This device is working properly.</p>' + (dev[2] ? '<p>Used in: ' + esc(dev[2]) + '</p>' : '') + '</fieldset>' +
            '<div class="dm-ok"><button class="default" data-dm="ok">OK</button></div></div></div>');
          box.querySelector('[aria-label=Close]').addEventListener('click', function () { box.remove(); });
          box.querySelector('[data-dm=ok]').addEventListener('click', function () { box.remove(); });
          win.querySelector('.dm').appendChild(box);
          track('skills/' + dev[0].toLowerCase().replace(/[^a-z0-9]+/g, '-'), 'Device: ' + dev[0]);
        }
        win.addEventListener('click', function (e) {
          var a = e.target.closest('.dm-dev');
          if (a) {
            e.preventDefault();
            win.querySelectorAll('.dm-dev.sel').forEach(function (x) { x.classList.remove('sel'); });
            a.classList.add('sel'); sel = a;
            return;
          }
          var b = e.target.closest('[data-dm]'); if (!b) return;
          var act = b.dataset.dm;
          if (act === 'props') { if (sel) props(+sel.dataset.c, +sel.dataset.d); else if (status) status.textContent = 'Select a device first.'; }
          if (act === 'refresh' && status) {
            status.textContent = 'Scanning for new hardware...';
            setTimeout(function () { status.textContent = 'No new hardware found. Aayush is always learning, so check back soon.'; }, 1400);
          }
          if (act === 'print') window.open('/cv/', '_blank', 'noopener');
        });
        win.addEventListener('dblclick', function (e) {
          var a = e.target.closest('.dm-dev'); if (a) { e.preventDefault(); props(+a.dataset.c, +a.dataset.d); }
        });
      }
    },
    credits: {
      title: 'Credits', icon: 'credits', w: 700, h: 640, x: 320, y: 70,
      status: '© 2026 Aayush Agrawal',
      render: function () {
        return '<div class="page credits">' +
          '<h1>Credits</h1><p class="muted">aayushagrawal.in, 2026</p>' +
          '<h2>Content &amp; AayushOS</h2><p>Aayush Agrawal</p>' +
          '<h2>3D scene</h2><p>Based on the open-source portfolio by <b>Henry Heffernan</b> ' + ext('https://github.com/henryjeff/portfolio-website', '(MIT licence)') + '</p>' +
          '<p>Computer model: Mickael Boitte · Environment models: Sean Nicolas</p>' +
          '<h2>Interface</h2><p>' + ext('https://github.com/jdan/98.css', '98.css') + ' by Jordan Scales (MIT licence)</p>' +
          '<h2>Fonts</h2><p>Fraunces (SIL Open Font Licence) · Tinos (Apache 2.0)</p>' +
          '</div>';
      }
    },

    achievements: {
      title: 'Achievements', icon: 'trophy', w: 560, h: 680, x: 330, y: 30,
      status: 'Saved in this browser',
      render: function () { return '<div class="ach" id="ach"></div>'; },
      mount: function (win) {
        var box = win.querySelector('#ach'), certName = '';
        box.addEventListener('input', function (e) { if (e.target.id === 'cert-name') certName = e.target.value; });
        box.addEventListener('click', function (e) {
          if (!e.target.closest('#cert-go')) return;
          var btn = e.target.closest('#cert-go'); btn.disabled = true; btn.textContent = 'Drawing...';
          loadScript('certificate.js?v=2', function () {
            window.aosCertificate.download({ name: certName, titles: ACH.map(function (a) { return a[1]; }) }).then(function () {
              btn.disabled = false; btn.textContent = 'Download certificate'; track('certificate', 'Downloaded certificate');
            });
          });
        });
        function draw() {
          if (!document.body.contains(box)) { refreshAch = null; return; }
          var got = loadList('aayushos-achievements');
          var apps = loadList('aayushos-seen-apps').filter(function (a) { return LITE_APPS.indexOf(a) >= 0; }).length;
          var pages = loadList('aayushos-seen-pages').length;
          box.innerHTML = '<div class="ach-head">' + I.trophy + '<div><h2>Achievements</h2><p>' + got.length + ' of ' + ACH.length + ' unlocked. How many can you find?</p></div></div>' +
            '<div class="ach-meter"><span style="width:' + (got.length / ACH.length * 100) + '%"></span></div>' +
            (got.indexOf('all') >= 0 ? '<div class="ach-cert"><p><b>100%!</b> Put your name on a certificate.</p><div class="ach-cert-row"><input id="cert-name" maxlength="40" placeholder="Your name" value="' + esc(certName) + '"><button id="cert-go">Download certificate</button></div></div>' : '') +
            '<div class="ach-list sunken-panel">' + ACH.map(function (a) {
              var on = got.indexOf(a[0]) >= 0;
              var extra = a[0] === 'explorer' ? ' (' + Math.min(apps, LITE_APPS.length) + '/' + LITE_APPS.length + ')' : a[0] === 'reader' ? ' (' + Math.min(pages, 4) + '/4)' : '';
              return '<div class="ach-row' + (on ? '' : ' locked') + '">' + I.trophy + '<div><b>' + esc(a[1]) + (on ? '' : extra) + '</b><p>' + esc(on ? a[3] : a[2]) + '</p></div></div>';
            }).join('') + '</div>';
        }
        refreshAch = draw; draw();
      }
    },
    ultra: { title: 'Ask White', icon: 'ultra', render: function () { return ''; } },

    projects: { title: 'Projects', icon: 'folder', alias: ['showcase', 'projects'] },

    github: { title: 'GitHub', icon: 'github', external: ME.github },
    linkedin: { title: 'LinkedIn', icon: 'linkedin', external: ME.linkedin },
    instagram: { title: 'Instagram', icon: 'instagram', external: ME.instagram },
    site: { title: 'My Website', icon: 'globe', external: ME.site }
  };

  var DESKTOP = ['showcase', 'projects', 'resume', 'terminal', 'tetris', 'paint', 'mycomputer', 'skills', 'achievements', 'ultra', 'github', 'linkedin', 'instagram', 'site'];

  // ---------- Window manager ----------
  var windowsEl = document.getElementById('windows');
  var taskEl = document.getElementById('task-buttons');
  var open = {};
  var z = 10;
  function label(app) { return app.short || app.title; }

  function focus(id) {
    Object.keys(open).forEach(function (k) {
      open[k].win.classList.toggle('active', k === id);
      open[k].task.classList.toggle('active', k === id && !open[k].win.hidden);
    });
    if (open[id]) open[id].win.style.zIndex = ++z;
  }

  function openApp(id, page) {
    var app = APPS[id];
    if (!app) return;
    if (SINGLE && id !== SINGLE) {
      toParent({ type: 'aos-open', app: id, route: page && page !== 'home' ? '/' + page : page ? '/' : undefined });
      return;
    }
    if (!SINGLE) {
      track('open/' + id, 'Opened ' + (app.short || app.title));
      if (id === 'resume') achieve('resume');
      if (LITE_APPS.indexOf(id) >= 0 && addTo('aayushos-seen-apps', id, LITE_APPS)) achieve('explorer');
      if (id === 'ultra') { Ultra.show(); return; }
    }
    if (app.external) { window.open(app.external, '_blank', 'noopener'); return; }
    if (app.alias) { openApp(app.alias[0], app.alias[1]); return; }
    closeStart();
    if (open[id]) {
      open[id].win.hidden = false; focus(id);
      if (page && open[id].win.showPage) open[id].win.showPage(page);
      return;
    }

    var win = el(
      '<div class="window win' + (app.ie ? ' ie' : '') + '" role="dialog" aria-label="' + esc(app.title) + '">' +
        '<div class="title-bar"><div class="title-bar-text">' + I[app.icon] + '<span>' + esc(app.title) + '</span></div>' +
        '<div class="title-bar-controls">' +
          '<button aria-label="Minimize"></button>' +
          (app.fixed ? '' : '<button aria-label="Maximize"></button>') +
          '<button aria-label="Close"></button>' +
        '</div></div>' +
        '<div class="window-body">' + app.render() + '</div>' +
        (app.status ? '<div class="status-bar"><p class="status-bar-field">' + esc(app.status) + '</p>' +
          (app.ie ? '<p class="status-bar-field sb-sm"></p><p class="status-bar-field sb-sm"></p><p class="status-bar-field sb-md"></p>' : '') + '</div>' : '') +
        (app.fixed ? '' : '<div class="resize"></div>') +
      '</div>');

    var offset = Object.keys(open).length * 18;
    win.style.left = (app.x + offset) + 'px';
    win.style.top = (app.y + offset) + 'px';
    if (!app.fixed) { win.style.width = app.w + 'px'; win.style.height = app.h + 'px'; }
    if (SMALL) win.classList.add('max');
    windowsEl.appendChild(win);

    var task = el('<button>' + I[app.icon] + '<span>' + esc(label(app)) + '</span></button>');
    taskEl.appendChild(task);
    open[id] = { win: win, task: task };

    win.addEventListener('mousedown', function () { focus(id); });
    task.addEventListener('click', function () {
      if (win.hidden) { win.hidden = false; focus(id); }
      else if (win.classList.contains('active')) { win.hidden = true; task.classList.remove('active'); }
      else focus(id);
    });
    win.querySelector('[aria-label=Close]').addEventListener('click', function (e) { e.stopPropagation(); closeApp(id); });
    win.querySelector('[aria-label=Minimize]').addEventListener('click', function (e) { e.stopPropagation(); win.hidden = true; task.classList.remove('active'); });
    var maxBtn = win.querySelector('[aria-label=Maximize]');
    if (maxBtn) maxBtn.addEventListener('click', function () { win.classList.toggle('max'); });
    win.querySelector('.title-bar').addEventListener('dblclick', function () { if (maxBtn) win.classList.toggle('max'); });

    drag(win, win.querySelector('.title-bar'));
    var rz = win.querySelector('.resize');
    if (rz) resize(win, rz);
    win.addEventListener('click', function (e) {
      var b = e.target.closest('[data-open]');
      if (b) openApp(b.dataset.open);
    });
    if (app.mount) app.mount(win);
    if (page && win.showPage) win.showPage(page);
    focus(id);
  }

  function closeApp(id) {
    if (!open[id]) return;
    if (SINGLE) { toParent({ type: 'aos-close', app: SINGLE }); return; }
    open[id].win.remove();
    open[id].task.remove();
    delete open[id];
  }

  // Win95-style outline move/resize: a dithered outline follows the mouse and the
  // window jumps into place on release. Much smoother inside the 3D monitor than
  // repainting the whole window every frame.
  var outline = el('<div class="win-outline" hidden></div>');
  document.body.appendChild(outline);
  function showOutline(r) {
    outline.style.left = r.left + 'px'; outline.style.top = r.top + 'px';
    outline.style.width = r.width + 'px'; outline.style.height = r.height + 'px';
    outline.hidden = false;
  }

  function drag(win, handle) {
    handle.addEventListener('mousedown', function (e) {
      if (e.button !== 0 || e.target.closest('button') || win.classList.contains('max')) return;
      var sx = e.clientX, sy = e.clientY, ox = win.offsetLeft, oy = win.offsetTop;
      var w = win.offsetWidth, h = win.offsetHeight, nx = ox, ny = oy, moved = false;
      function move(ev) {
        nx = Math.min(Math.max(ox + ev.clientX - sx, -w + 80), window.innerWidth - 80);
        ny = Math.min(Math.max(oy + ev.clientY - sy, 0), window.innerHeight - 60);
        if (!moved && Math.abs(nx - ox) + Math.abs(ny - oy) < 3) return;
        if (!moved) { moved = true; showOutline({ left: ox, top: oy, width: w, height: h }); document.body.classList.add('dragging'); }
        outline.style.transform = 'translate(' + (nx - ox) + 'px,' + (ny - oy) + 'px)';
      }
      function up() {
        removeEventListener('mousemove', move); removeEventListener('mouseup', up);
        if (moved) { win.style.left = nx + 'px'; win.style.top = ny + 'px'; }
        outline.hidden = true; outline.style.transform = ''; document.body.classList.remove('dragging');
      }
      addEventListener('mousemove', move); addEventListener('mouseup', up);
      e.preventDefault();
    });
  }

  function resize(win, handle) {
    handle.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      var sx = e.clientX, sy = e.clientY, ow = win.offsetWidth, oh = win.offsetHeight;
      var r = { left: win.offsetLeft, top: win.offsetTop, width: ow, height: oh }, nw = ow, nh = oh;
      showOutline(r); document.body.classList.add('resizing');
      function move(ev) {
        nw = Math.max(380, ow + ev.clientX - sx); nh = Math.max(220, oh + ev.clientY - sy);
        outline.style.width = nw + 'px'; outline.style.height = nh + 'px';
      }
      function up() {
        removeEventListener('mousemove', move); removeEventListener('mouseup', up);
        win.style.width = nw + 'px'; win.style.height = nh + 'px';
        outline.hidden = true; document.body.classList.remove('resizing');
      }
      addEventListener('mousemove', move); addEventListener('mouseup', up);
      e.preventDefault(); e.stopPropagation();
    });
  }

  // ---------- Desktop icons ----------
  var iconsEl = document.getElementById('icons');
  DESKTOP.forEach(function (id) {
    var app = APPS[id];
    var b = el('<button class="icon" title="' + esc(label(app)) + '">' + I[app.icon] + '<span>' + esc(label(app)) + '</span></button>');
    b.addEventListener('click', function () {
      Array.prototype.forEach.call(iconsEl.children, function (c) { c.classList.remove('selected'); });
      b.classList.add('selected');
    });
    b.addEventListener('dblclick', function () { openApp(id); });
    if (TOUCH) b.addEventListener('click', function () { openApp(id); });
    b.addEventListener('keydown', function (e) { if (e.key === 'Enter') openApp(id); });
    iconsEl.appendChild(b);
  });
  (function () {
    var rb = el('<button class="icon recycle-icon" title="Recycle Bin">' + I.recycle + '<span>Recycle Bin</span></button>');
    rb.addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('.icon'), function (c) { c.classList.remove('selected'); });
      rb.classList.add('selected');
      if (TOUCH) openApp('recycle');
    });
    rb.addEventListener('dblclick', function () { openApp('recycle'); });
    document.getElementById('desktop').appendChild(rb);
  })();
  document.getElementById('desktop').addEventListener('mousedown', function (e) {
    if (e.target.id === 'desktop' || e.target.id === 'icons') {
      Array.prototype.forEach.call(iconsEl.children, function (c) { c.classList.remove('selected'); });
      closeStart();
    }
  });

  // ---------- Vintage CRT look ----------
  // The same layers the 3D monitor draws (inner shadow, static videos, glass smudges),
  // added over the page like light. Shared setting with AayushOS: 'aayushos-crt'.
  var Crt = (function () {
    var KEY = 'aayushos-crt', layers = [];
    function on() { try { return localStorage.getItem(KEY) !== '0'; } catch (e) { return true; } }
    function show() {
      if (layers.length || SINGLE) return;
      var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      var T = '/textures/monitor/';
      layers = [
        el('<img class="crt-layer crt-shadow" alt="" aria-hidden="true" src="' + T + 'layers/compressed/shadow-compressed.webp">'),
        el('<video class="crt-layer crt-add" aria-hidden="true" style="opacity:.5" src="' + T + 'video/base-static.mp4" muted loop playsinline' + (still ? '' : ' autoplay') + '></video>'),
        el('<video class="crt-layer crt-add" aria-hidden="true" style="opacity:.1" src="' + T + 'video/static-texture-layer.mp4" muted loop playsinline' + (still ? '' : ' autoplay') + '></video>'),
        el('<img class="crt-layer crt-add" alt="" aria-hidden="true" style="opacity:.12" src="' + T + 'layers/compressed/smudges.jpg">')
      ];
      layers.forEach(function (l) { document.body.appendChild(l); if (l.tagName === 'VIDEO') { l.muted = true; if (!still) { var pr = l.play(); if (pr && pr.catch) pr.catch(function () {}); } } });
    }
    function hide() { layers.forEach(function (l) { l.remove(); }); layers = []; }
    function set(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {} v ? show() : hide(); }
    addEventListener('storage', function (e) { if (e.key === KEY) on() ? show() : hide(); });
    if (on()) show();
    return { on: on, set: set };
  })();

  // ---------- Mouse and keyboard clicks ----------
  // The 3D room's recordings. Inside AayushOS (single-app iframes) the parent plays them instead.
  (function () {
    if (SINGLE) return;
    var FILES = { down: '/audio/mouse/mouse_down.mp3', up: '/audio/mouse/mouse_up.mp3' };
    for (var k = 1; k <= 6; k++) FILES['key' + k] = '/audio/keyboard/key_' + k + '.mp3';
    var buffers = {}, ctx = null, lastKey = '';
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC || !window.fetch) return;
    var decoder = new OAC(1, 1, 44100);
    Object.keys(FILES).forEach(function (name) {
      fetch(FILES[name]).then(function (r) { return r.ok ? r.arrayBuffer() : Promise.reject(); })
        .then(function (ab) { return new Promise(function (res, rej) { decoder.decodeAudioData(ab, res, rej); }); })
        .then(function (b) { buffers[name] = b; }).catch(function () {});
    });
    function play(name, vol) {
      if (isMuted() || !buffers[name]) return;
      if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ctx = new AC(); }
      if (ctx.state === 'suspended') ctx.resume();
      var src = ctx.createBufferSource(); src.buffer = buffers[name];
      src.playbackRate.value = 0.96 + Math.random() * 0.08;
      var g = ctx.createGain(); g.gain.value = vol;
      src.connect(g); g.connect(ctx.destination); src.start(0);
    }
    addEventListener('pointerdown', function () { play('down', 0.5); }, true);
    addEventListener('pointerup', function () { play('up', 0.5); }, true);
    addEventListener('keydown', function (e) {
      if (e.repeat || e.key === lastKey) return;
      lastKey = e.key; play('key' + (1 + Math.floor(Math.random() * 6)), 0.45);
    }, true);
    addEventListener('keyup', function () { lastKey = ''; }, true);
  })();

  // ---------- Start menu ----------
  var startBtn = document.getElementById('start-btn');
  var startMenu = document.getElementById('start-menu');
  var startList = document.getElementById('start-list');
  var START = [
    ['showcase', null, 'My Showcase'], ['showcase', 'about', 'About'], ['showcase', 'experience', 'Experience'],
    ['showcase', 'projects', 'Projects'], ['showcase', 'contact', 'Contact'], '-',
    ['resume', null], ['terminal', null], ['tetris', null], ['paint', null], ['github', null], ['linkedin', null], ['instagram', null], ['site', null], ['skills', null], ['achievements', null], ['ultra', null], ['welcome', null], ['credits', null], '-', 'crt', 'views', 'shutdown'
  ];
  START.forEach(function (item) {
    if (item === '-') { startList.appendChild(el('<hr>')); return; }
    if (item === 'crt') {
      // the vintage CRT look (same setting as AayushOS)
      var c = el('<li>' + I.computer + '<span></span></li>');
      var paint = function () { c.querySelector('span').textContent = 'CRT effect: ' + (Crt.on() ? 'On' : 'Off'); };
      c.addEventListener('click', function () { Crt.set(!Crt.on()); paint(); });
      paint();
      startList.appendChild(c);
      return;
    }
    if (item === 'views') {
      // back to aayushagrawal.in: phones get the view picker there, computers get the 3D desk
      var v = el('<li>' + I.computer + '<span>' + (TOUCH ? 'Switch view...' : '3D desk version') + '</span></li>');
      v.addEventListener('click', function () { location.href = '/'; });
      startList.appendChild(v);
      return;
    }
    if (item === 'shutdown') {
      var s = el('<li>' + I.power + '<span>Shut Down...</span></li>');
      s.addEventListener('click', shutdown);
      startList.appendChild(s);
      return;
    }
    var app = APPS[item[0]];
    var icon = item[1] === 'contact' ? I.mail : item[1] === 'projects' ? I.folder : (item[1] ? I.doc : I[app.icon]);
    var li = el('<li>' + icon + '<span>' + esc(item[2] || label(app)) + '</span></li>');
    li.addEventListener('click', function () { openApp(item[0], item[1]); });
    startList.appendChild(li);
  });
  function closeStart() { startMenu.hidden = true; startBtn.classList.remove('active'); }
  startBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    startMenu.hidden = !startMenu.hidden;
    startBtn.classList.toggle('active', !startMenu.hidden);
  });
  document.addEventListener('mousedown', function (e) {
    if (!startMenu.hidden && !startMenu.contains(e.target) && !startBtn.contains(e.target)) closeStart();
  });

  var shutdowns = 0;
  function shutdown() {
    if (++shutdowns >= 5) achieve('shutdown');
    closeStart();
    Object.keys(open).forEach(closeApp);
    var boot = document.getElementById('boot');
    boot.querySelector('.boot-note').textContent = 'It is now safe to turn off your computer. Click anywhere to restart.';
    boot.querySelector('.boot-bar').style.display = 'none';
    boot.classList.remove('done');
    boot.addEventListener('click', function restart() {
      boot.removeEventListener('click', restart);
      boot.querySelector('.boot-bar').style.display = '';
      boot.querySelector('.boot-note').textContent = 'Starting AayushOS...';
      var bar = boot.querySelector('.boot-bar span');
      bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
      setTimeout(function () { boot.classList.add('done'); openApp('showcase'); }, 1700);
    });
  }

  // ---------- Tray ----------
  var speaker = document.getElementById('tray-speaker');
  function isMuted() { try { return localStorage.getItem('aayushos-muted') === '1'; } catch (e) { return false; } }
  function paintSpeaker() { speaker.innerHTML = I.speaker; speaker.classList.toggle('muted', isMuted()); speaker.title = isMuted() ? 'Sound is off. Click to turn it on' : 'Sound is on. Click to mute'; }
  speaker.addEventListener('click', function () { try { localStorage.setItem('aayushos-muted', isMuted() ? '0' : '1'); } catch (e) {} paintSpeaker(); });
  addEventListener('storage', function (e) { if (e.key === 'aayushos-muted') paintSpeaker(); });
  paintSpeaker();
  var clock = document.getElementById('clock');
  function tick() { clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
  tick(); setInterval(tick, 10000);

  // Live Bangalore weather from Open-Meteo (free, no key). Cached 15 min in sessionStorage,
  // shared with AayushOS and the 3D room.
  var Weather = (function () {
    var KEY = 'aayushos-weather', pending = null;
    var URL = 'https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,weather_code,is_day&timezone=Asia%2FKolkata';
    function text(c) {
      if (c === 0) return 'clear skies'; if (c === 1) return 'mostly clear'; if (c === 2) return 'partly cloudy'; if (c === 3) return 'overcast';
      if (c === 45 || c === 48) return 'foggy'; if (c >= 51 && c <= 57) return 'drizzle';
      if (c === 61 || c === 80) return 'light rain'; if (c === 63 || c === 81) return 'rain'; if (c === 65 || c === 82) return 'heavy rain';
      if (c === 66 || c === 67) return 'freezing rain'; if (c >= 71 && c <= 77) return 'snow (in Bangalore?!)'; if (c >= 95) return 'thunderstorms';
      return 'weather';
    }
    function shape(w) {
      var rain = (w.code >= 51 && w.code <= 67) || (w.code >= 80 && w.code <= 82) || w.code >= 95;
      return { temp: Math.round(w.temp), code: w.code, isDay: w.isDay, text: text(w.code), rain: rain };
    }
    function get(cb) {
      try { var c = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (c && Date.now() - c.t < 900000) return cb(shape(c)); } catch (e) {}
      if (!pending) pending = fetch(URL).then(function (r) { return r.json(); }).then(function (j) {
        var cur = j && j.current; if (!cur || typeof cur.temperature_2m !== 'number') return null;
        var w = { t: Date.now(), temp: cur.temperature_2m, code: cur.weather_code, isDay: cur.is_day === 1 };
        try { sessionStorage.setItem(KEY, JSON.stringify(w)); } catch (e) {}
        return w;
      }).catch(function () { return null; });
      pending.then(function (w) { cb(w ? shape(w) : null); });
    }
    return { get: get };
  })();

  // Clock pop-up: Bangalore time and weather, a calendar and what Aayush is probably up to
  (function () {
    var wx = null;
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var pop = null, timer = 0;
    function ist() { var d = new Date(); return new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 330 * 60000); }
    function doing(t) {
      var h = t.getHours(), we = t.getDay() === 0 || t.getDay() === 6;
      if (h < 6) return 'probably asleep';
      if (h < 9) return 'probably cracking open his first can of White';
      if (h < 16) return we ? 'probably working on a side project' : 'probably in class at BMSCE';
      if (h < 19) return 'probably building a side project';
      if (h < 22) return 'probably coding or reading docs';
      return 'probably still coding (it is late!)';
    }
    function draw() {
      var t = ist(), now = new Date();
      var first = new Date(t.getFullYear(), t.getMonth(), 1).getDay(), days = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
      var cells = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(function (d) { return '<i class="dow">' + d + '</i>'; });
      for (var k = 0; k < first; k++) cells.push('<i></i>');
      for (var dd = 1; dd <= days; dd++) cells.push('<i' + (dd === t.getDate() ? ' class="today"' : '') + '>' + dd + '</i>');
      var zone = ''; try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
      var diff = 330 + now.getTimezoneOffset(), a = Math.abs(diff);
      var dtxt = diff === 0 ? '' : ' Bangalore is ' + Math.floor(a / 60) + 'h' + (a % 60 ? ' ' + (a % 60) + 'm' : '') + (diff > 0 ? ' ahead of you.' : ' behind you.');
      var short = t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      pop.querySelector('.window-body').innerHTML =
        '<p class="ck-time">' + t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' }) + '</p>' +
        '<p class="ck-date">' + DAYS[t.getDay()] + ', ' + t.getDate() + ' ' + MONTHS[t.getMonth()] + ' ' + t.getFullYear() + ' · IST</p>' +
        (wx ? '<p class="ck-wx"><span aria-hidden="true">' + (wx.rain ? '☂' : wx.code <= 1 ? (wx.isDay ? '☀' : '☾') : '☁') + '</span> ' + wx.temp + '°C, ' + wx.text + '</p>' : '') +
        '<div class="ck-cal sunken-panel"><div class="ck-month">' + MONTHS[t.getMonth()] + ' ' + t.getFullYear() + '</div><div class="ck-grid">' + cells.join('') + '</div></div>' +
        '<div class="ck-status"><p>It\'s ' + short + ' in Bangalore, so Aayush is <b>' + doing(t) + '</b>.</p><p class="ck-small">' +
        (/Calcutta|Kolkata/.test(zone) ? 'You\'re in the same time zone as Aayush!' : 'Your time: ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + (zone ? ' (' + esc(zone.split('/').pop().replace(/_/g, ' ')) + ')' : '') + '.' + dtxt) + '</p></div>';
    }
    function close() { if (pop) { pop.remove(); pop = null; clearInterval(timer); } }
    clock.style.cursor = 'pointer';
    clock.title = 'Bangalore time';
    clock.addEventListener('click', function (e) {
      e.stopPropagation();
      if (pop) { close(); return; }
      pop = el('<div class="window ck-pop"><div class="title-bar"><div class="title-bar-text"><span>Date/Time · Bangalore, India</span></div><div class="title-bar-controls"><button aria-label="Close"></button></div></div><div class="window-body"></div></div>');
      pop.querySelector('[aria-label=Close]').addEventListener('click', close);
      pop.addEventListener('mousedown', function (ev) { ev.stopPropagation(); });
      pop.addEventListener('touchstart', function (ev) { ev.stopPropagation(); }, { passive: true });
      document.body.appendChild(pop); draw(); timer = setInterval(draw, 1000);
      Weather.get(function (w) { wx = w; if (pop) draw(); });
    });
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', function (e) { if (pop && !pop.contains(e.target) && e.target !== clock) close(); }, { passive: true });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();

  // ---------- Message box ----------
  function msgBox(title, text, kind) {
    var icon = kind === 'warn'
      ? '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M16 3L30 28H2z" fill="#ff0" stroke="#000"/><rect x="15" y="11" width="2" height="9" fill="#000"/><rect x="15" y="22" width="2" height="2" fill="#000"/></svg>'
      : '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><circle cx="16" cy="16" r="13" fill="#fff" stroke="#000"/><rect x="15" y="13" width="3" height="11" fill="#000080"/><rect x="15" y="8" width="3" height="3" fill="#000080"/></svg>';
    var w = el('<div class="window win msg active" role="alertdialog" aria-label="' + esc(title) + '">' +
      '<div class="title-bar"><div class="title-bar-text"><span>' + esc(title) + '</span></div>' +
      '<div class="title-bar-controls"><button aria-label="Close"></button></div></div>' +
      '<div class="window-body"><div class="msg-row"><div class="msg-icon">' + icon + '</div><p>' + text + '</p></div>' +
      '<div class="msg-btns"><button class="msg-ok">OK</button></div></div></div>');
    windowsEl.appendChild(w);
    w.style.left = Math.max(10, (window.innerWidth - w.offsetWidth) / 2) + 'px';
    w.style.top = Math.max(10, (window.innerHeight - 44 - w.offsetHeight) / 2) + 'px';
    w.style.zIndex = ++z + 1000;
    drag(w, w.querySelector('.title-bar'));
    function close() { w.remove(); }
    w.querySelector('.msg-ok').addEventListener('click', close);
    w.querySelector('[aria-label=Close]').addEventListener('click', close);
    w.querySelector('.msg-ok').focus();
  }

  // ---------- Welcome dialog ----------
  var TIPS = [
    'Double-click <b>My Showcase</b> to read about me, my experience and my projects.',
    'Open the <b>Terminal</b> and type <b>help</b>. Recruiters: try <b>sudo hire aayush</b>.',
    'Bored? <b>Tetris</b> is on the desktop. Your best score is saved.',
    'Want the one-page version? Double-click <b>Resume.pdf</b> to view or download it.',
    'Leave the computer alone for a minute and the screensaver kicks in.',
    'Something you shouldn\'t open is sitting in the <b>Recycle Bin</b>.',
    'Prefer a modern site? <b>My Website</b> opens aayushagrawal.codes.'
  ];
  function Welcome(win) {
    var i = 0, tip = win.querySelector('#wl-tip');
    function show() { tip.innerHTML = TIPS[i]; }
    win.querySelector('#wl-next').addEventListener('click', function () { i = (i + 1) % TIPS.length; show(); });
    win.querySelector('#wl-new').addEventListener('click', function () { openApp('showcase', 'about'); });
    win.querySelector('#wl-close').addEventListener('click', function () { closeApp('welcome'); });
    var cb = win.querySelector('#wl-show');
    cb.addEventListener('change', function () { try { localStorage.setItem('aayushos-welcome-off', cb.checked ? '' : '1'); } catch (e) {} });
    show();
  }

  // ---------- Recycle Bin ----------
  var TRASH = [
    { name: 'first_website_2019.html', size: '4 KB', type: 'HTML Document', note: 'A marquee, three fonts and an autoplaying MIDI. It stays deleted.' },
    { name: 'bug_i_never_fixed.py', size: '2 KB', type: 'Python File', note: 'Works on my machine. Moved here for everyone\'s safety.' },
    { name: 'final_FINAL_v7_actually_final.docx', size: '86 KB', type: 'Word Document', note: 'There was a v8.' },
    { name: 'attendance_74.9%.png', size: '1.2 MB', type: 'PNG Image', note: 'This is why the Attendance Calculator shortcut exists.' },
    { name: 'tabs_vs_spaces.txt', size: '1 KB', type: 'Text Document', note: 'Spaces. Discussion closed.' },
    { name: 'node_modules', size: '2.3 GB', type: 'File Folder', note: 'Deleted to free up space. Came back on its own.' }
  ];
  function Recycle(win) {
    var tbody = win.querySelector('#rb-list'), sel = -1;
    function render() {
      tbody.innerHTML = TRASH.map(function (f, i) {
        return '<tr data-i="' + i + '"' + (i === sel ? ' class="highlighted"' : '') + '><td>' + (f.type === 'File Folder' ? '📁' : '📄') + ' ' + esc(f.name) + '</td><td>' + esc(f.type) + '</td><td>' + esc(f.size) + '</td></tr>';
      }).join('');
      win.querySelector('#rb-count').textContent = TRASH.length + ' object(s)';
    }
    tbody.addEventListener('click', function (e) { var tr = e.target.closest('tr'); if (tr) { sel = +tr.dataset.i; render(); } });
    tbody.addEventListener('dblclick', function (e) { var tr = e.target.closest('tr'); if (tr) achieve('dumpster'); if (tr) msgBox(TRASH[+tr.dataset.i].name, esc(TRASH[+tr.dataset.i].note)); });
    win.querySelector('#rb-restore').addEventListener('click', function () {
      if (sel < 0) return msgBox('Recycle Bin', 'Select a file to restore first.');
      msgBox('Restore', 'Restoring <b>' + esc(TRASH[sel].name) + '</b>?<br><br>Nope. Some things are better left in the bin.', 'warn');
    });
    win.querySelector('#rb-empty').addEventListener('click', function () {
      msgBox('Confirm File Delete', 'Are you sure you want to delete these ' + TRASH.length + ' items?<br><br>Actually, they\'re load-bearing mistakes. They have to stay.', 'warn');
    });
    render();
  }

  // ---------- Screensaver ----------
  (function () {
    if (SINGLE) return;
    var IDLE_MS = 60000, idleT = null, on = false, raf = 0;
    var saver = el('<div class="saver" hidden><canvas></canvas><div class="saver-logo"><span class="saver-mark">A</span><span>AayushOS <b>98</b></span></div></div>');
    document.body.appendChild(saver);
    var cv = saver.querySelector('canvas'), cx = cv.getContext('2d'), logo = saver.querySelector('.saver-logo');
    var stars = [], lx = 80, ly = 80, vx = 1.6, vy = 1.2;
    function size() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
    function seed() { stars = []; for (var i = 0; i < 260; i++) stars.push({ x: (Math.random() - .5) * cv.width, y: (Math.random() - .5) * cv.height, z: Math.random() * cv.width }); }
    function frame() {
      var w = cv.width, h = cv.height;
      cx.fillStyle = '#000'; cx.fillRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i]; s.z -= 6;
        if (s.z <= 1) { s.x = (Math.random() - .5) * w; s.y = (Math.random() - .5) * h; s.z = w; }
        var k = 160 / s.z, px = s.x * k + w / 2, py = s.y * k + h / 2;
        if (px < 0 || px > w || py < 0 || py > h) { s.z = w; continue; }
        var r = Math.max(.6, 2.6 * (1 - s.z / w)); cx.fillStyle = '#fff'; cx.fillRect(px, py, r, r);
      }
      var lw = logo.offsetWidth, lh = logo.offsetHeight;
      lx += vx; ly += vy;
      if (lx <= 0 || lx + lw >= w) { vx = -vx; lx = Math.max(0, Math.min(lx, w - lw)); }
      if (ly <= 0 || ly + lh >= h) { vy = -vy; ly = Math.max(0, Math.min(ly, h - lh)); }
      logo.style.transform = 'translate(' + lx + 'px,' + ly + 'px)';
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (on || !document.getElementById('boot').classList.contains('done')) return;
      on = true; saver.hidden = false; size(); seed(); raf = requestAnimationFrame(frame); achieve('afk');
    }
    function stop() { if (!on) return; on = false; saver.hidden = true; cancelAnimationFrame(raf); }
    function poke() { stop(); clearTimeout(idleT); idleT = setTimeout(start, IDLE_MS); }
    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) { addEventListener(ev, poke, { passive: true }); });
    addEventListener('resize', function () { if (on) size(); });
    window.__aayushosSaver = { start: start, stop: stop };
    poke();
  })();

  // ---------- Paint ----------
  function Paint(root, win) {
    var PALETTE = ['#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
                   '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff6a1a'];
    var TOOLS = [
      ['pencil', 'Pencil', '<path d="M4 20l2-6L16 4l4 4L10 18z" fill="#ffdd6e" stroke="#000"/><path d="M4 20l2-6 4 4z" fill="#000"/>'],
      ['brush', 'Brush', '<path d="M14 3l7 7-6 3-4-4z" fill="#8a5a2b" stroke="#000"/><path d="M10 10l4 4c-1 4-5 7-10 7 1-5 3-9 6-11z" fill="#3c7bd6" stroke="#000"/>'],
      ['eraser', 'Eraser', '<path d="M3 15l9-9 8 8-6 6H8z" fill="#ff9fb0" stroke="#000"/><path d="M3 15l5 5" stroke="#000"/>'],
      ['fill', 'Fill', '<path d="M5 11l7-7 7 7-7 7z" fill="#fff" stroke="#000"/><path d="M5 11h14l-7 7z" fill="#3c7bd6"/><path d="M20 14c1 2 2 3 1 5-1 1-3 0-2-2z" fill="#3c7bd6" stroke="#000"/>'],
      ['line', 'Line', '<path d="M4 20L20 4" stroke="#000" stroke-width="2"/>'],
      ['rect', 'Rectangle', '<rect x="4" y="6" width="16" height="12" fill="none" stroke="#000" stroke-width="2"/>'],
      ['ellipse', 'Ellipse', '<ellipse cx="12" cy="12" rx="8" ry="6" fill="none" stroke="#000" stroke-width="2"/>'],
      ['spray', 'Airbrush', '<rect x="9" y="9" width="6" height="12" fill="#c0c0c0" stroke="#000"/><rect x="10" y="6" width="4" height="3" fill="#000"/><path d="M5 3h1M3 5h1M6 6h1M4 8h1M8 3h1" stroke="#000"/>']
    ];
    var W = 760, H = 520;
    root.innerHTML =
      '<div class="pt-wrap">' +
        '<div class="pt-tools">' + TOOLS.map(function (t) { return '<button class="pt-tool" data-tool="' + t[0] + '" title="' + t[1] + '"><svg viewBox="0 0 24 24">' + t[2] + '</svg></button>'; }).join('') +
          '<div class="pt-sizes" title="Size">' + [2, 5, 10, 18].map(function (s) { return '<button class="pt-size" data-size="' + s + '"><span style="width:' + Math.min(18, s + 2) + 'px;height:' + Math.min(18, s) + 'px"></span></button>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="pt-canvas-wrap sunken-panel"><canvas id="pt-canvas" width="' + W + '" height="' + H + '"></canvas><canvas id="pt-overlay" width="' + W + '" height="' + H + '"></canvas></div>' +
      '</div>' +
      '<div class="pt-bottom">' +
        '<div class="pt-current" title="Current colours"><span id="pt-fg"></span><span id="pt-bg"></span></div>' +
        '<div class="pt-palette">' + PALETTE.map(function (c) { return '<button class="pt-swatch" data-color="' + c + '" style="background:' + c + '" title="' + c + '"></button>'; }).join('') + '</div>' +
        '<div class="pt-actions"><button id="pt-undo">Undo</button><button id="pt-clear">New</button><button id="pt-save">Save PNG</button></div>' +
      '</div>' +
      '<div class="status-bar"><p class="status-bar-field" id="pt-status">Left-click draws with the foreground colour, right-click with the background colour.</p><p class="status-bar-field pt-xy" id="pt-xy"></p></div>';

    var cv = root.querySelector('#pt-canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
    var ov = root.querySelector('#pt-overlay'), ox = ov.getContext('2d');
    var tool = 'pencil', size = 2, fg = '#000000', bg = '#ffffff';
    var undo = [], drawing = false, start = null, last = null, color = fg, sprayT = null;

    function clear() { cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, W, H); }
    function snapshot() { undo.push(cx.getImageData(0, 0, W, H)); if (undo.length > 25) undo.shift(); }
    function setTool(t) { tool = t; root.querySelectorAll('.pt-tool').forEach(function (b) { b.classList.toggle('on', b.dataset.tool === t); }); }
    function setSize(s) { size = s; root.querySelectorAll('.pt-size').forEach(function (b) { b.classList.toggle('on', +b.dataset.size === s); }); }
    function paintColors() { root.querySelector('#pt-fg').style.background = fg; root.querySelector('#pt-bg').style.background = bg; }
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: Math.round((e.clientX - r.left) * W / r.width), y: Math.round((e.clientY - r.top) * H / r.height) }; }
    function lineSize() { return tool === 'pencil' ? Math.max(1, Math.round(size / 2)) : tool === 'eraser' ? size * 2 : size; }
    function stroke(c, a, b, w, col) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
    function shape(c, a, b, col) {
      c.strokeStyle = col; c.lineWidth = Math.max(1, Math.round(size / 2)); c.beginPath();
      if (tool === 'line') { c.lineCap = 'round'; c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); }
      else if (tool === 'rect') { c.rect(Math.min(a.x, b.x) + .5, Math.min(a.y, b.y) + .5, Math.abs(b.x - a.x), Math.abs(b.y - a.y)); }
      else { c.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, Math.PI * 2); }
      c.stroke();
    }
    function spray(p) {
      cx.fillStyle = color; var r = size * 2 + 6;
      for (var i = 0; i < 18; i++) { var a = Math.random() * Math.PI * 2, d = Math.random() * r; cx.fillRect(Math.round(p.x + Math.cos(a) * d), Math.round(p.y + Math.sin(a) * d), 1, 1); }
    }
    function hexToRgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
    function flood(p, col) {
      var img = cx.getImageData(0, 0, W, H), d = img.data, i0 = (p.y * W + p.x) * 4;
      var t = [d[i0], d[i0 + 1], d[i0 + 2]], c = hexToRgb(col);
      if (t[0] === c[0] && t[1] === c[1] && t[2] === c[2]) return;
      function same(i) { return Math.abs(d[i] - t[0]) < 24 && Math.abs(d[i + 1] - t[1]) < 24 && Math.abs(d[i + 2] - t[2]) < 24; }
      var stack = [[p.x, p.y]];
      while (stack.length) {
        var q = stack.pop(), x = q[0], y = q[1], i = (y * W + x) * 4;
        while (x >= 0 && same(i)) { x--; i -= 4; }
        x++; i += 4;
        var up = false, down = false;
        while (x < W && same(i)) {
          d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
          if (y > 0) { if (same(i - W * 4)) { if (!up) { stack.push([x, y - 1]); up = true; } } else up = false; }
          if (y < H - 1) { if (same(i + W * 4)) { if (!down) { stack.push([x, y + 1]); down = true; } } else down = false; }
          x++; i += 4;
        }
      }
      cx.putImageData(img, 0, 0);
    }

    cv.style.touchAction = 'none'; ov.style.touchAction = 'none';
    ov.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    ov.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      ov.setPointerCapture(e.pointerId);
      var p = pos(e); color = e.button === 2 ? bg : fg;
      snapshot();
      if (tool === 'fill') { flood(p, color); return; }
      drawing = true; start = last = p;
      if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') stroke(cx, p, { x: p.x + .01, y: p.y }, lineSize(), tool === 'eraser' ? bg : color);
      if (tool === 'spray') { spray(p); sprayT = setInterval(function () { spray(last); }, 30); }
    });
    ov.addEventListener('pointermove', function (e) {
      var p = pos(e);
      root.querySelector('#pt-xy').textContent = (p.x >= 0 && p.y >= 0 && p.x < W && p.y < H) ? p.x + ',' + p.y : '';
      if (!drawing) return;
      if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') stroke(cx, last, p, lineSize(), tool === 'eraser' ? bg : color);
      else if (tool === 'line' || tool === 'rect' || tool === 'ellipse') { ox.clearRect(0, 0, W, H); shape(ox, start, p, color); }
      last = p;
    });
    function end(e) {
      if (!drawing) return;
      drawing = false; clearInterval(sprayT);
      if (tool === 'line' || tool === 'rect' || tool === 'ellipse') { ox.clearRect(0, 0, W, H); shape(cx, start, pos(e), color); }
    }
    ov.addEventListener('pointerup', end);
    ov.addEventListener('pointercancel', end);

    root.querySelectorAll('.pt-tool').forEach(function (b) { b.addEventListener('click', function () { setTool(b.dataset.tool); }); });
    root.querySelectorAll('.pt-size').forEach(function (b) { b.addEventListener('click', function () { setSize(+b.dataset.size); }); });
    root.querySelectorAll('.pt-swatch').forEach(function (b) {
      b.addEventListener('click', function () { fg = b.dataset.color; paintColors(); });
      b.addEventListener('contextmenu', function (e) { e.preventDefault(); bg = b.dataset.color; paintColors(); });
    });
    root.querySelector('#pt-undo').addEventListener('click', function () { if (undo.length) cx.putImageData(undo.pop(), 0, 0); });
    root.querySelector('#pt-clear').addEventListener('click', function () { snapshot(); clear(); });
    root.querySelector('#pt-save').addEventListener('click', function () {
      var a = document.createElement('a'); achieve('artist'); a.download = 'aayushos-paint.png'; a.href = cv.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove();
    });
    document.addEventListener('keydown', function onKey(e) {
      if (!document.body.contains(cv)) { document.removeEventListener('keydown', onKey); return; }
      if (win.hidden || !win.classList.contains('active')) return;
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); if (undo.length) cx.putImageData(undo.pop(), 0, 0); }
    });

    clear(); setTool('pencil'); setSize(2); paintColors();
    // a friendly starter doodle
    cx.fillStyle = '#ff6a1a'; cx.fillRect(24, 24, 44, 44);
    cx.fillStyle = '#fff'; cx.font = '900 34px Fraunces, Georgia, serif'; cx.fillText('A', 33, 58);
    cx.fillStyle = '#808080'; cx.font = '18px Tinos, "Times New Roman", serif'; cx.fillText('Draw something! Save it with "Save PNG".', 82, 52);
  }

  // ---------- Konami code ----------
  (function () {
    var SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], i = 0;
    addEventListener('keydown', function (e) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = (k === SEQ[i]) ? i + 1 : (k === SEQ[0] ? 1 : 0);
      if (i === SEQ.length) { i = 0; party(); }
    });
    function party() {
      achieve('konami');
      var c = document.createElement('canvas'); c.className = 'confetti';
      c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
      var g = c.getContext('2d'), cols = ['#ff6a1a', '#f6c94d', '#00c8e6', '#a347d6', '#3cbf4a', '#e5393b', '#2f5fe0', '#fff'];
      var bits = []; for (var n = 0; n < 220; n++) bits.push({ x: c.width / 2, y: c.height / 2, vx: (Math.random() - .5) * 22, vy: -Math.random() * 20 - 4, s: 4 + Math.random() * 6, c: cols[n % cols.length], r: Math.random() * 6 });
      var t0 = performance.now();
      (function tick(t) {
        g.clearRect(0, 0, c.width, c.height);
        bits.forEach(function (b) { b.vy += .55; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.r += .2; g.fillStyle = b.c; g.save(); g.translate(b.x, b.y); g.rotate(b.r); g.fillRect(-b.s / 2, -b.s / 2, b.s, b.s); g.restore(); });
        if (t - t0 < 4200) requestAnimationFrame(tick); else c.remove();
      })(t0);
      setTimeout(function () { msgBox('Cheat Code Accepted', '<b>↑ ↑ ↓ ↓ ← → ← → B A</b><br><br>+30 lives. Unlimited White. You clearly know your classics, so you\'d probably get along with me. Say hi from the Contact page!'); }, 400);
    }
  })();

  // ---------- Terminal ----------
  function Terminal(root, win) {
    var PROMPT = 'C:\\AAYUSH>';
    var hist = [], hi = 0;
    root.innerHTML = '<div class="term-out" id="term-out"></div>' +
      '<div class="term-line"><span class="term-prompt">' + PROMPT + '</span><input id="term-in" class="term-in" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal input"></div>';
    var out = root.querySelector('#term-out'), input = root.querySelector('#term-in');

    function print(html, cls) { var d = document.createElement('div'); d.className = 'term-row' + (cls ? ' ' + cls : ''); d.innerHTML = html; out.appendChild(d); }
    function lines(arr, cls) { arr.forEach(function (l) { print(l, cls); }); }
    function link(url, text) { return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(text || url) + '</a>'; }
    function scroll() { root.scrollTop = root.scrollHeight; }

    var FILES = {
      'about.txt': function () { return CMDS.about(); },
      'resume.pdf': function () { openApp('resume'); return ['Opening Resume.pdf...']; },
      'tetris.exe': function () { openApp('tetris'); return ['Starting TETRIS.EXE...']; },
      'secret.txt': function () { return ['Nice try. The only secret is that I debug with print statements.', 'Oh, and old-school gamers might try: ↑ ↑ ↓ ↓ ← → ← → B A']; },
      'projects': function () { return CMDS.projects(); }
    };

    var CMDS = {
      help: function () {
        return [
          'Available commands:',
          '  <b>about</b>        Who I am',
          '  <b>projects</b>     List my projects  (project &lt;number&gt; for details)',
          '  <b>experience</b>   Education, leadership and certifications',
          '  <b>skills</b>       Languages and tools I use',
          '  <b>resume</b>       Open my resume',
          '  <b>contact</b>      Email and socials',
          '  <b>open</b> &lt;x&gt;     Open github, linkedin, instagram, site, showcase or tetris',
          '  <b>neofetch</b>     System info',
          '  <b>dir</b>, <b>type</b> &lt;file&gt;, <b>cls</b>, <b>date</b>, <b>echo</b>, <b>history</b>, <b>exit</b>',
          '',
          'Psst... try <b>sudo hire aayush</b>'
        ];
      },
      about: function () {
        return [
          '<b>Aayush Agrawal</b> · Developer & AI/ML student · Bangalore, India',
          'B.E. Artificial Intelligence & Machine Learning, BMS College of Engineering (2028).',
          'I build small, useful software: Python tools, Discord bots and websites.',
          'Member of @clienterrverse, building open source with other developers.',
          'Open to internships & collaborations.'
        ];
      },
      whoami: function () { return ['guest@aayushos — but you\'re looking at <b>Aayush Agrawal</b>\'s portfolio. Type <b>about</b>.']; },
      projects: function () {
        return ['Projects (type <b>project &lt;number&gt;</b> for details):', ''].concat(
          PROJECTS.map(function (p, i) { return '  [' + (i + 1) + '] <b>' + esc(p.name) + '</b>  <span class="dim">' + esc(p.type) + '</span>'; }));
      },
      project: function (args) {
        var q = args.join(' ').toLowerCase(), n = parseInt(q, 10), p = null;
        if (!isNaN(n)) p = PROJECTS[n - 1];
        if (!p && q) p = PROJECTS.filter(function (x) { return x.name.toLowerCase().indexOf(q) >= 0; })[0];
        if (!p) return ['Usage: project &lt;number&gt;   (see <b>projects</b>)'];
        return ['<b>' + esc(p.name) + '</b>' + (p.date ? '  <span class="dim">' + esc(p.date) + '</span>' : ''),
          esc(p.type) + ' · ' + p.stack.map(esc).join(', '), esc(p.desc), link(p.url, p.urlLabel)];
      },
      experience: function () {
        return ['<b>EDUCATION</b>',
          '  BMS College of Engineering — B.E. AI & ML ............ expected 2028',
          '  Shiv Jyoti International School — CBSE 11–12, Kota ......... 2024',
          '  Mayo College — CBSE 5–10, Ajmer .......................... 2022',
          '', '<b>LEADERSHIP</b>',
          '  Student Volunteer, BMSCE UTSAV (merch distribution) .. 2025–2026',
          '  Member, Rotaract Club of BMSCE (40+ service hours) .... 2023–2024',
          '', '<b>CERTIFICATIONS</b>',
          '  C for Beginners — Great Learning ..................... Jan 2025',
          '  Using MongoDB with Python — MongoDB .................. Nov 2024'];
      },
      skills: function () {
        return ['<b>Languages</b>   Python, JavaScript, Java, C, HTML & CSS',
          '<b>Tools</b>       Node.js, Discord.js, Git, Machine Learning',
          '<b>Databases</b>   MySQL, MongoDB',
          '<b>Spoken</b>      English, Hindi, Nepali'];
      },
      resume: function () { openApp('resume'); return ['Opening Resume.pdf... (' + link(ME.resume, 'direct link') + ')']; },
      contact: function () {
        return ['Email      ' + link('mailto:' + ME.email, ME.email),
          'GitHub     ' + link(ME.github, 'github.com/aayushagrawall'),
          'LinkedIn   ' + link(ME.linkedin, 'linkedin.com/in/aayush-agrawall'),
          'Instagram  ' + link(ME.instagram, '@_aayush.agrawal'),
          'Website    ' + link(ME.site, 'aayushagrawal.codes')];
      },
      open: function (args) {
        var t = (args[0] || '').toLowerCase();
        var urls = { github: ME.github, linkedin: ME.linkedin, instagram: ME.instagram, site: ME.site, website: ME.site };
        if (urls[t]) { window.open(urls[t], '_blank', 'noopener'); return ['Opening ' + t + '...']; }
        if (APPS[t] && !APPS[t].external) { openApp(t); return ['Opening ' + t + '...']; }
        return ['Usage: open github | linkedin | instagram | site | showcase | tetris | resume'];
      },
      tetris: function () { openApp('tetris'); return ['Starting TETRIS.EXE...']; },
      neofetch: function () {
        var art = ['   ▄▄▄▄▄▄   ', '  █▀    ▀█  ', '  █▄▄▄▄▄▄█  ', '  █      █  ', '  ▀      ▀  '];
        var info = ['<b>guest</b>@<b>aayushos</b>', '----------------', '<b>OS</b>: AayushOS 98 (Bangalore Edition)', '<b>Host</b>: aayushagrawal.in',
          '<b>Owner</b>: Aayush Agrawal', '<b>Kernel</b>: Curiosity 3.0', '<b>Shell</b>: cmd.js', '<b>Fuel</b>: White'];
        var r = [];
        for (var i = 0; i < info.length; i++) r.push('<span class="accent">' + (art[i] || '            ').replace(/ /g, '&nbsp;') + '</span>  ' + info[i]);
        return r;
      },
      dir: function () {
        return [' Directory of C:\\AAYUSH', '',
          '11/06/2026  02:00 AM    &lt;DIR&gt;          projects',
          '11/06/2026  02:00 AM             1,024 about.txt',
          '11/06/2026  02:00 AM           177,525 resume.pdf',
          '11/06/2026  02:00 AM            31,337 tetris.exe',
          '11/06/2026  02:00 AM                42 secret.txt',
          '               4 File(s)        209,928 bytes'];
      },
      ls: function () { return CMDS.dir(); },
      type: function (args) {
        var f = (args[0] || '').toLowerCase();
        if (!f) return ['Usage: type &lt;file&gt;   (try <b>dir</b>)'];
        return FILES[f] ? FILES[f]() : ['File not found - ' + esc(f.toUpperCase())];
      },
      cat: function (a) { return CMDS.type(a); },
      cd: function (args) {
        var d = (args[0] || '').toLowerCase().replace(/\\$/, '');
        if (d === 'projects') return CMDS.projects();
        return ['Access denied. You\'re already in the best folder.'];
      },
      date: function () { return [new Date().toString()]; },
      time: function () { return [new Date().toLocaleTimeString()]; },
      echo: function (args) { return [esc(args.join(' '))]; },
      history: function () { return hist.map(function (h, i) { return '  ' + (i + 1) + '  ' + esc(h); }); },
      cls: function () { out.innerHTML = ''; return []; },
      clear: function () { return CMDS.cls(); },
      exit: function () { setTimeout(function () { closeApp('terminal'); }, 150); return ['Goodbye!']; },
      hire: function () { return CMDS.sudo(['hire', 'aayush']); },
      sudo: function (args) {
        if (args.join(' ').toLowerCase() === 'hire aayush') {
          achieve('recruiter');
          setTimeout(function () { openApp('showcase', 'contact'); }, 900);
          return ['[sudo] password for recruiter: ********',
            '<span class="ok">Permission granted. Excellent choice.</span>',
            'Opening the contact page so you can say hi...'];
        }
        return ['guest is not in the sudoers file. This incident will be reported.'];
      },
      white: function () { achieve('refuel'); return ['*pssht* One cold can of White, opened. Productivity +10.']; },
      chai: function () { return ['Out of chai. There is a cold can of White in the fridge though: try <b>white</b>.']; },
      coffee: function () { return ['Error 418: this desk runs on White, not coffee.']; },
      hello: function () { return ['Hi there! Type <b>help</b> to see what I can do.']; },
      hi: function () { return CMDS.hello(); }
    };

    function run(raw) {
      var line = raw.trim();
      print('<span class="term-prompt">' + PROMPT + '</span>' + esc(raw));
      if (!line) return;
      hist.push(line); hi = hist.length;
      var parts = line.split(/\s+/), cmd = parts[0].toLowerCase(), args = parts.slice(1);
      var fn = CMDS[cmd];
      var res = fn ? fn(args) : ["'" + esc(parts[0]) + "' is not recognized as an internal or external command.", 'Type <b>help</b> for a list of commands.'];
      lines(res);
      print('&nbsp;');
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { run(input.value); input.value = ''; scroll(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; input.value = hist[hi]; } }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) { hi++; input.value = hist[hi]; } else { hi = hist.length; input.value = ''; } }
      else if (e.key === 'Tab') {
        e.preventDefault();
        var v = input.value.toLowerCase();
        var m = Object.keys(CMDS).filter(function (c) { return c.indexOf(v) === 0; });
        if (m.length === 1) input.value = m[0] + ' ';
        else if (m.length > 1) { print('<span class="term-prompt">' + PROMPT + '</span>' + esc(input.value)); print(m.join('   ')); scroll(); }
      }
    });
    root.addEventListener('mouseup', function () { if (!window.getSelection().toString()) input.focus(); });

    lines(['AayushOS 98 [Version 2026.11]', '(C) Aayush Agrawal. All rights reserved.', '',
      'Welcome! Type <b>help</b> to see what you can do here.', '&nbsp;']);
    setTimeout(function () { input.focus(); }, 50);
  }

  // ---------- Tetris ----------
  function Tetris(root, win) {
    var COLS = 10, ROWS = 20, S = 30;
    var COLORS = { I: '#00c8e6', O: '#f6c94d', T: '#a347d6', S: '#3cbf4a', Z: '#e5393b', J: '#2f5fe0', L: '#ff6a1a' };
    var SHAPES = {
      I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
      O: [[1,1],[1,1]],
      T: [[0,1,0],[1,1,1],[0,0,0]],
      S: [[0,1,1],[1,1,0],[0,0,0]],
      Z: [[1,1,0],[0,1,1],[0,0,0]],
      J: [[1,0,0],[1,1,1],[0,0,0]],
      L: [[0,0,1],[1,1,1],[0,0,0]]
    };
    root.innerHTML =
      '<div class="tetris-board status-field-border"><canvas id="tt-board" width="' + COLS * S + '" height="' + ROWS * S + '" tabindex="0"></canvas>' +
        '<div class="tt-overlay" id="tt-overlay"><b>TETRIS</b><span>Press Start or Enter</span></div></div>' +
      '<div class="tetris-side">' +
        '<fieldset><legend>Next</legend><canvas id="tt-next" width="120" height="90"></canvas></fieldset>' +
        '<fieldset><legend>Score</legend><div class="tt-num" id="tt-score">0</div></fieldset>' +
        '<fieldset><legend>Lines</legend><div class="tt-num" id="tt-lines">0</div></fieldset>' +
        '<fieldset><legend>Level</legend><div class="tt-num" id="tt-level">1</div></fieldset>' +
        '<fieldset><legend>Best</legend><div class="tt-num" id="tt-best">0</div></fieldset>' +
        '<button id="tt-start">Start</button>' +
        '<p class="tt-help">← → move<br>↑ rotate<br>↓ soft drop<br>Space hard drop<br>P pause</p>' +
        (TOUCH ? '<div class="tt-pad"><button data-tk="ArrowLeft">◀</button><button data-tk="ArrowUp">⟳</button><button data-tk="ArrowRight">▶</button><button data-tk="ArrowDown">▼</button><button data-tk=" ">⤓</button></div>' : '') +
      '</div>';
    var board = root.querySelector('#tt-board'), ctx = board.getContext('2d');
    var nextC = root.querySelector('#tt-next'), nctx = nextC.getContext('2d');
    var overlay = root.querySelector('#tt-overlay'), startBtn = root.querySelector('#tt-start');
    var $score = root.querySelector('#tt-score'), $lines = root.querySelector('#tt-lines');
    var $level = root.querySelector('#tt-level'), $best = root.querySelector('#tt-best');
    var best = 0;
    try { best = +localStorage.getItem('aayushos-tetris-best') || 0; } catch (e) {}
    $best.textContent = best;

    var grid, piece, next, bag, score, lines, level, state = 'idle', dropAcc = 0, last = 0;

    function newGrid() { var g = []; for (var r = 0; r < ROWS; r++) { g.push(new Array(COLS).fill(null)); } return g; }
    function fromBag() {
      if (!bag || !bag.length) { bag = Object.keys(SHAPES); for (var i = bag.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = bag[i]; bag[i] = bag[j]; bag[j] = t; } }
      var k = bag.pop();
      return { k: k, m: SHAPES[k].map(function (r) { return r.slice(); }), x: 0, y: 0 };
    }
    function spawn() {
      piece = next || fromBag(); next = fromBag();
      piece.x = Math.floor((COLS - piece.m[0].length) / 2); piece.y = piece.k === 'I' ? -1 : 0;
      if (collides(piece.m, piece.x, piece.y)) gameOver();
      drawNext();
    }
    function collides(m, ox, oy) {
      for (var y = 0; y < m.length; y++) for (var x = 0; x < m[y].length; x++) {
        if (!m[y][x]) continue;
        var nx = ox + x, ny = oy + y;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && grid[ny][nx]) return true;
      }
      return false;
    }
    function rotate(m) { var n = m.length, r = []; for (var y = 0; y < n; y++) { r.push([]); for (var x = 0; x < n; x++) r[y].push(m[n - 1 - x][y]); } return r; }
    function tryRotate() {
      if (piece.k === 'O') return;
      var r = rotate(piece.m);
      var kicks = [0, -1, 1, -2, 2];
      for (var i = 0; i < kicks.length; i++) if (!collides(r, piece.x + kicks[i], piece.y)) { piece.m = r; piece.x += kicks[i]; return; }
    }
    function move(dx) { if (!collides(piece.m, piece.x + dx, piece.y)) piece.x += dx; }
    function softDrop() { if (!collides(piece.m, piece.x, piece.y + 1)) { piece.y++; score += 1; } else lock(); dropAcc = 0; }
    function hardDrop() { var d = 0; while (!collides(piece.m, piece.x, piece.y + 1)) { piece.y++; d++; } score += d * 2; lock(); }
    function lock() {
      piece.m.forEach(function (row, y) { row.forEach(function (v, x) { if (v && piece.y + y >= 0) grid[piece.y + y][piece.x + x] = piece.k; }); });
      var cleared = 0;
      for (var r = ROWS - 1; r >= 0; r--) {
        if (grid[r].every(Boolean)) { grid.splice(r, 1); grid.unshift(new Array(COLS).fill(null)); cleared++; r++; }
      }
      if (cleared) {
        score += [0, 100, 300, 500, 800][cleared] * level;
        lines += cleared;
        if (cleared === 4) achieve('tetris4');
        if (score >= 1000) achieve('tetris');
        level = Math.floor(lines / 10) + 1;
      }
      updateHud();
      if (state === 'playing') spawn();
    }
    function speed() { return Math.max(80, 800 - (level - 1) * 70); }
    function updateHud() { $score.textContent = score; $lines.textContent = lines; $level.textContent = level; }

    function cell(c, x, y, color, size) {
      c.fillStyle = color; c.fillRect(x, y, size, size);
      c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(x, y, size, 3); c.fillRect(x, y, 3, size);
      c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(x, y + size - 3, size, 3); c.fillRect(x + size - 3, y, 3, size);
    }
    function draw() {
      ctx.fillStyle = '#0b0b14'; ctx.fillRect(0, 0, board.width, board.height);
      ctx.strokeStyle = 'rgba(255,255,255,.05)';
      for (var gx = 1; gx < COLS; gx++) { ctx.beginPath(); ctx.moveTo(gx * S + .5, 0); ctx.lineTo(gx * S + .5, board.height); ctx.stroke(); }
      for (var gy = 1; gy < ROWS; gy++) { ctx.beginPath(); ctx.moveTo(0, gy * S + .5); ctx.lineTo(board.width, gy * S + .5); ctx.stroke(); }
      grid.forEach(function (row, y) { row.forEach(function (k, x) { if (k) cell(ctx, x * S, y * S, COLORS[k], S); }); });
      if (piece && state !== 'over') {
        var gyy = piece.y; while (!collides(piece.m, piece.x, gyy + 1)) gyy++;
        piece.m.forEach(function (row, y) { row.forEach(function (v, x) {
          if (!v) return;
          if (gyy + y >= 0) { ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.strokeRect((piece.x + x) * S + 1.5, (gyy + y) * S + 1.5, S - 3, S - 3); }
          if (piece.y + y >= 0) cell(ctx, (piece.x + x) * S, (piece.y + y) * S, COLORS[piece.k], S);
        }); });
      }
    }
    function drawNext() {
      nctx.fillStyle = '#0b0b14'; nctx.fillRect(0, 0, nextC.width, nextC.height);
      if (!next) return;
      var m = next.m, s = 22, h = m.filter(function (r) { return r.some(Boolean); });
      var w = Math.max.apply(null, h.map(function (r) { return r.lastIndexOf(1) + 1; })) - Math.min.apply(null, h.map(function (r) { return r.indexOf(1); }));
      var minX = Math.min.apply(null, h.map(function (r) { return r.indexOf(1); }));
      var ox = (nextC.width - w * s) / 2, oy = (nextC.height - h.length * s) / 2;
      h.forEach(function (row, y) { row.forEach(function (v, x) { if (v) cell(nctx, ox + (x - minX) * s, oy + y * s, COLORS[next.k], s); }); });
    }
    function start() {
      grid = newGrid(); bag = null; next = null; score = 0; lines = 0; level = 1; dropAcc = 0;
      state = 'playing'; overlay.hidden = true; startBtn.textContent = 'Pause';
      updateHud(); spawn(); board.focus();
    }
    function pause() {
      if (state === 'playing') { state = 'paused'; overlay.innerHTML = '<b>PAUSED</b><span>Press P to resume</span>'; overlay.hidden = false; startBtn.textContent = 'Resume'; }
      else if (state === 'paused') { state = 'playing'; overlay.hidden = true; startBtn.textContent = 'Pause'; board.focus(); }
    }
    function gameOver() {
      state = 'over';
      if (score > best) { best = score; try { localStorage.setItem('aayushos-tetris-best', best); } catch (e) {} $best.textContent = best; }
      overlay.innerHTML = '<b>GAME OVER</b><span>Score ' + score + '<br>Press Start or Enter</span>';
      overlay.hidden = false; startBtn.textContent = 'Start';
    }
    startBtn.addEventListener('click', function () { if (state === 'playing' || state === 'paused') pause(); else start(); });
    overlay.addEventListener('click', function () { if (state === 'idle' || state === 'over') start(); else if (state === 'paused') pause(); });
    board.addEventListener('mousedown', function () { board.focus(); });

    root.querySelectorAll('[data-tk]').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); act(btn.dataset.tk); });
    });
    document.addEventListener('keydown', function onKey(e) {
      if (!document.body.contains(board)) { document.removeEventListener('keydown', onKey); return; }
      if (win.hidden || !win.classList.contains('active')) return;
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].indexOf(e.key) >= 0) e.preventDefault();
      act(e.key);
    });
    function act(k) {
      if (k === 'Enter' && (state === 'idle' || state === 'over')) { start(); return; }
      if (k === 'p' || k === 'P' || k === 'Escape') { pause(); return; }
      if (state !== 'playing') return;
      if (k === 'ArrowLeft') move(-1);
      else if (k === 'ArrowRight') move(1);
      else if (k === 'ArrowUp' || k === 'x' || k === 'X') tryRotate();
      else if (k === 'ArrowDown') softDrop();
      else if (k === ' ') hardDrop();
      updateHud(); draw();
    }

    grid = newGrid(); draw(); drawNext();
    function loop(t) {
      if (!document.body.contains(board)) return;
      var dt = Math.min(100, t - (last || t)); last = t;
      if (state === 'playing' && !win.hidden) {
        dropAcc += dt;
        if (dropAcc >= speed()) { dropAcc = 0; if (!collides(piece.m, piece.x, piece.y + 1)) piece.y++; else lock(); }
      } else if (state === 'playing' && win.hidden) { pause(); }
      draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // ---------- White, the desk assistant (a talking can of his energy drink) ----------
  var Ultra = (function () {
    var QAS = [
      ['Who is Aayush?', "He's an AI & Machine Learning undergrad at BMS College of Engineering in Bangalore, graduating in 2028. He builds small, useful software: Python tools, Discord bots and websites.", [['About me', 'showcase', 'about']]],
      ["What's his tech stack?", 'Python, JavaScript, Java and C, plus HTML & CSS, Node.js, Discord.js, MySQL, MongoDB, machine learning and Git.', []],
      ['Which project should I look at first?', 'Start with clienterr.com and imgurr.me on the Projects page. If you like bots, the Discord moderation bot is there too.', [['Projects', 'showcase', 'projects']]],
      ['Can I see his resume?', "Of course. It's one page, and you can download it too. There's also a web version at aayushagrawal.in/cv that's easy to read on a phone.", [['Open resume', 'resume']]],
      ['Is he open to internships?', "Best to ask him directly! Send a message from the Contact page or email agrawal.aayush38@gmail.com and he'll get back to you.", [['Contact', 'showcase', 'contact']]],
      ['How was this site built?', "On a big screen, the desk is a Three.js scene running a React desktop adapted from Henry Heffernan's portfolio, with his permission. This phone-friendly version, with its Terminal, Tetris and Paint, is Aayush's own.", [['Credits', 'credits']]],
      ['Any secrets?', 'A few. Type "sudo hire aayush" in the Terminal, try the Konami code, peek in the Recycle Bin, or keep pressing Shut Down. Your progress is in Achievements.', [['Achievements', 'achievements']]]
    ];
    var box = null, asked = {};
    function close() { if (box) { box.remove(); box = null; } }
    function draw(qa) {
      var inner = qa
        ? '<p class="ultra-qt">' + esc(qa[0]) + '</p><p>' + esc(qa[1]) + '</p><div class="ultra-acts">' +
          qa[2].map(function (a, i) { return '<button data-act="' + i + '">' + esc(a[0]) + '</button>'; }).join('') + '<button data-back>Ask something else</button></div>'
        : '<p>Hi! I\'m <b>White</b>, Aayush\'s desk assistant (and his energy drink). What would you like to know?</p><div class="ultra-qs">' +
          QAS.map(function (q, i) { return '<a href="#" data-q="' + i + '">' + esc(q[0]) + '</a>'; }).join('') + '</div>';
      box.querySelector('.ultra-bubble-in').innerHTML = inner;
      box._qa = qa;
    }
    function show() {
      if (!box) {
        box = el('<div class="ultra"><div class="ultra-bubble"><button class="ultra-x" aria-label="Close">×</button><div class="ultra-bubble-in"></div></div><div class="ultra-cup">' + I.ultra + '</div></div>');
        box.addEventListener('click', function (e) {
          if (e.target.closest('.ultra-x')) { close(); return; }
          var q = e.target.closest('[data-q]');
          if (q) {
            e.preventDefault();
            var qa = QAS[+q.dataset.q];
            asked[qa[0]] = 1;
            track('ultra/' + qa[0].toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''), 'Asked White: ' + qa[0]);
            if (Object.keys(asked).length >= 3) achieve('chatty');
            draw(qa); return;
          }
          if (e.target.closest('[data-back]') || e.target.closest('.ultra-cup')) { draw(null); return; }
          var act = e.target.closest('[data-act]');
          if (act && box._qa) { var a = box._qa[2][+act.dataset.act]; openApp(a[1], a[2]); if (SMALL) close(); }
        });
        document.body.appendChild(box);
      }
      draw(null);
    }
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    return { show: show, close: close };
  })();

  // ---------- Shareable links: /os-lite/#projects ----------
  var LINKS = {
    home: ['showcase', 'home'], about: ['showcase', 'about'], experience: ['showcase', 'experience'], projects: ['showcase', 'projects'],
    'projects/software': ['showcase', 'projects'], 'projects/tools': ['showcase', 'projects'], contact: ['showcase', 'contact'],
    resume: ['resume'], terminal: ['terminal'], tetris: ['tetris'], paint: ['paint'], recycle: ['recycle'], credits: ['credits'],
    achievements: ['achievements'], skills: ['skills'], computer: ['mycomputer'], codele: ['showcase', 'home']
  };
  function openLink() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, '')).toLowerCase();
    var l = LINKS[h];
    if (l) { openApp(l[0], l[1]); track('link/' + h, 'Arrived via #' + h); }
    return !!l;
  }
  addEventListener('hashchange', openLink);

  // ---------- Boot ----------
  if (SINGLE) {
    document.documentElement.classList.add('single');
    document.getElementById('boot').classList.add('done');
    openApp(SINGLE);
    var w0 = open[SINGLE] && open[SINGLE].win;
    if (w0) { w0.classList.add('active'); w0.style.left = ''; w0.style.top = ''; }
    // clicking inside brings the parent window to the front
    addEventListener('mousedown', function () { toParent({ type: 'aos-focus', app: SINGLE }); }, true);
    // mouse and keyboard clicks: AayushOS plays the sounds (or passes them to the 3D room)
    addEventListener('mousedown', function () { toParent({ type: 'aos-input', kind: 'down' }); }, true);
    addEventListener('mouseup', function () { toParent({ type: 'aos-input', kind: 'up' }); }, true);
    addEventListener('keydown', function (e) { if (!e.repeat) toParent({ type: 'aos-input', kind: 'key', key: e.key }); }, true);
    addEventListener('keyup', function (e) { toParent({ type: 'aos-input', kind: 'keyup', key: e.key }); }, true);
    // keep the parent's screensaver from starting while someone plays Tetris or types
    var lastPing = 0;
    ['keydown', 'mousemove', 'wheel', 'touchstart'].forEach(function (ev) {
      addEventListener(ev, function () {
        var t = Date.now();
        if (t - lastPing > 2000) { lastPing = t; toParent({ type: 'aos-activity' }); }
      }, { passive: true, capture: true });
    });
    return;
  }
  setTimeout(function () {
    document.getElementById('boot').classList.add('done');
    openApp('showcase');
    var linked = openLink();
    var ist = (new Date().getUTCHours() + new Date().getUTCMinutes() / 60 + 5.5) % 24;
    if (ist < 5) setTimeout(function () { achieve('night'); }, 6000);
    var ultraSeen = false; try { ultraSeen = sessionStorage.getItem('aayushos-ultra-shown') === '1'; } catch (e) {}
    if (!ultraSeen) setTimeout(function () { Ultra.show(); try { sessionStorage.setItem('aayushos-ultra-shown', '1'); } catch (e) {} }, 25000);
    if (linked) return;
    var off = false; try { off = localStorage.getItem('aayushos-welcome-off') === '1'; } catch (e) {}
    // In the 3D monitor, open on the clean Showcase hero; the tips dialog is in the Start menu.
    var inMonitor = window.parent !== window;
    if (!off && !SMALL && !inMonitor) setTimeout(function () { openApp('welcome'); }, 700);
  }, 1100);
})();
