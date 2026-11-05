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
    showcase: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="2" y="3" width="28" height="26" fill="#fff" stroke="#000"/><rect x="2" y="3" width="28" height="5" fill="#000080"/><rect x="25" y="4" width="3" height="3" fill="#c0c0c0"/><path d="M9 26l5-15h4l5 15h-3l-1-3h-6l-1 3zm5-6h4l-2-6z" fill="#000"/></svg>',
    doc: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M6 2h14l6 6v22H6z" fill="#fff" stroke="#000"/><path d="M20 2v6h6" fill="#ddd" stroke="#000"/><rect x="9" y="12" width="14" height="2" fill="#000080"/><rect x="9" y="16" width="14" height="2" fill="#777"/><rect x="9" y="20" width="10" height="2" fill="#777"/><rect x="9" y="24" width="12" height="2" fill="#777"/></svg>',
    computer: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="4" y="3" width="24" height="18" fill="#c0c0c0" stroke="#000"/><rect x="7" y="6" width="18" height="12" fill="#008080"/><rect x="9" y="8" width="5" height="4" fill="#fff"/><rect x="12" y="21" width="8" height="3" fill="#888"/><rect x="6" y="24" width="20" height="5" fill="#c0c0c0" stroke="#000"/></svg>',
    tetris: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="4" y="18" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="12" y="18" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="20" y="18" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="20" y="10" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="4" y="2" width="8" height="8" fill="#00c8e6" stroke="#000"/><rect x="4" y="10" width="8" height="8" fill="#00c8e6" stroke="#000"/><rect x="12" y="10" width="8" height="8" fill="#a347d6" stroke="#000"/></svg>',
    globe: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><circle cx="16" cy="16" r="12" fill="#4fa3e0" stroke="#000"/><path d="M10 9h6v5h-4v4h-3v-4H7zM18 16h6v6h-3v4h-4v-6h1z" fill="#3c9a3c"/><path d="M4 16h24M16 4v24" stroke="#1d5f99" fill="none"/></svg>',
    credits: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M6 2h20v28H6z" fill="#fff" stroke="#000"/><rect x="9" y="6" width="14" height="2" fill="#000"/><rect x="11" y="11" width="10" height="2" fill="#555"/><rect x="9" y="15" width="14" height="2" fill="#000"/><rect x="11" y="20" width="10" height="2" fill="#555"/><rect x="9" y="24" width="14" height="2" fill="#000"/></svg>',
    mail: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="8" width="26" height="17" fill="#fff" stroke="#000"/><path d="M3 8l13 10L29 8" fill="none" stroke="#000"/></svg>',
    power: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="3" width="26" height="26" fill="#c0c0c0" stroke="#000"/><path d="M11 10a8 8 0 1 0 10 0" fill="none" stroke="#c00" stroke-width="3"/><rect x="14.5" y="6" width="3" height="10" fill="#c00"/></svg>',
    speaker: '<svg viewBox="0 0 16 16" shape-rendering="crispEdges"><path d="M2 6h3l4-3v10l-4-3H2z" fill="#ff0" stroke="#000"/><path d="M11 5c1.5 1.5 1.5 4.5 0 6M13 3c2.7 2.7 2.7 7.3 0 10" fill="none" stroke="#000"/></svg>'
  };

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
          return '<div class="sc-project">' +
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

  function Showcase(win) {
    var root = win.querySelector('.sc');
    function render(page) {
      if (page === 'home') {
        root.className = 'sc sc-home';
        root.innerHTML =
          '<div class="sc-hero">' +
            '<h1>Aayush<br>Agrawal</h1>' +
            '<h2>Developer &amp; AI/ML Student</h2>' +
            '<nav class="sc-hnav">' + NAV.slice(1).map(function (n) { return '<a href="#" data-page="' + n[0] + '">' + n[1].toUpperCase() + '</a>'; }).join('') + '</nav>' +
          '</div>';
      } else {
        root.className = 'sc sc-inner';
        root.innerHTML =
          '<aside class="sc-side">' +
            '<h1>Aayush<br>Agrawal</h1>' +
            '<h3>Showcase \'26</h3>' +
            '<nav class="sc-vnav">' + NAV.map(function (n) {
              return '<a href="#" data-page="' + n[0] + '"' + (n[0] === page ? ' class="cur"' : '') + '>' + n[1].toUpperCase() + '</a>';
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
      var a = e.target.closest('[data-page]');
      if (a) { e.preventDefault(); render(a.dataset.page); }
    });
    win.showPage = render;
    render('home');
  }

  // ---------- Apps ----------
  var APPS = {
    showcase: {
      title: 'Aayush Agrawal - Showcase 2026', short: 'My Showcase', icon: 'showcase', w: 1060, h: 860, x: 120, y: 24, ie: true,
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
          '<a class="button-link" href="' + ME.resume + '" target="_blank" rel="noopener">Open</a></div>' +
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
          '<dt>Fuel</dt><dd>Chai</dd>' +
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

    tetris: {
      title: 'Tetris', icon: 'tetris', w: 0, h: 0, x: 380, y: 30, fixed: true,
      status: 'Arrow keys to play · Space to drop',
      render: function () { return '<div class="tetris" id="tetris"></div>'; },
      mount: function (win) { Tetris(win.querySelector('#tetris'), win); }
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

    site: { title: 'My Website', icon: 'globe', external: ME.site }
  };

  var DESKTOP = ['showcase', 'resume', 'tetris', 'mycomputer', 'site', 'credits'];

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
    if (app.external) { window.open(app.external, '_blank', 'noopener'); return; }
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
    open[id].win.remove();
    open[id].task.remove();
    delete open[id];
  }

  function drag(win, handle) {
    handle.addEventListener('mousedown', function (e) {
      if (e.target.closest('button') || win.classList.contains('max')) return;
      var sx = e.clientX, sy = e.clientY, ox = win.offsetLeft, oy = win.offsetTop;
      function move(ev) {
        var nx = Math.min(Math.max(ox + ev.clientX - sx, -win.offsetWidth + 80), window.innerWidth - 80);
        var ny = Math.min(Math.max(oy + ev.clientY - sy, 0), window.innerHeight - 60);
        win.style.left = nx + 'px'; win.style.top = ny + 'px';
      }
      function up() { removeEventListener('mousemove', move); removeEventListener('mouseup', up); }
      addEventListener('mousemove', move); addEventListener('mouseup', up);
      e.preventDefault();
    });
  }

  function resize(win, handle) {
    handle.addEventListener('mousedown', function (e) {
      var sx = e.clientX, sy = e.clientY, ow = win.offsetWidth, oh = win.offsetHeight;
      function move(ev) { win.style.width = Math.max(380, ow + ev.clientX - sx) + 'px'; win.style.height = Math.max(220, oh + ev.clientY - sy) + 'px'; }
      function up() { removeEventListener('mousemove', move); removeEventListener('mouseup', up); }
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
    b.addEventListener('keydown', function (e) { if (e.key === 'Enter') openApp(id); });
    iconsEl.appendChild(b);
  });
  document.getElementById('desktop').addEventListener('mousedown', function (e) {
    if (e.target.id === 'desktop' || e.target.id === 'icons') {
      Array.prototype.forEach.call(iconsEl.children, function (c) { c.classList.remove('selected'); });
      closeStart();
    }
  });

  // ---------- Start menu ----------
  var startBtn = document.getElementById('start-btn');
  var startMenu = document.getElementById('start-menu');
  var startList = document.getElementById('start-list');
  var START = [
    ['showcase', null, 'My Showcase'], ['showcase', 'about', 'About'], ['showcase', 'experience', 'Experience'],
    ['showcase', 'projects', 'Projects'], ['showcase', 'contact', 'Contact'], '-',
    ['resume', null], ['tetris', null], ['site', null], ['credits', null], '-', 'shutdown'
  ];
  START.forEach(function (item) {
    if (item === '-') { startList.appendChild(el('<hr>')); return; }
    if (item === 'shutdown') {
      var s = el('<li>' + I.power + '<span>Shut Down...</span></li>');
      s.addEventListener('click', shutdown);
      startList.appendChild(s);
      return;
    }
    var app = APPS[item[0]];
    var icon = item[1] === 'contact' ? I.mail : (item[1] ? I.doc : I[app.icon]);
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

  function shutdown() {
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
  document.getElementById('tray-speaker').innerHTML = I.speaker;
  var clock = document.getElementById('clock');
  function tick() { clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
  tick(); setInterval(tick, 10000);

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

    document.addEventListener('keydown', function onKey(e) {
      if (!document.body.contains(board)) { document.removeEventListener('keydown', onKey); return; }
      if (win.hidden || !win.classList.contains('active')) return;
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      var k = e.key;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].indexOf(k) >= 0) e.preventDefault();
      if (k === 'Enter' && (state === 'idle' || state === 'over')) { start(); return; }
      if (k === 'p' || k === 'P' || k === 'Escape') { pause(); return; }
      if (state !== 'playing') return;
      if (k === 'ArrowLeft') move(-1);
      else if (k === 'ArrowRight') move(1);
      else if (k === 'ArrowUp' || k === 'x' || k === 'X') tryRotate();
      else if (k === 'ArrowDown') softDrop();
      else if (k === ' ') hardDrop();
      updateHud(); draw();
    });

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

  // ---------- Boot ----------
  setTimeout(function () {
    document.getElementById('boot').classList.add('done');
    openApp('showcase');
  }, 1800);
})();
