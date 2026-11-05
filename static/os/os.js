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
    folder: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M2 8h11l2 3h15v17H2z" fill="#f6c94d" stroke="#000"/><rect x="2" y="13" width="28" height="15" fill="#ffdd6e" stroke="#000"/></svg>',
    instagram: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#feda75"/><stop offset=".35" stop-color="#fa7e1e"/><stop offset=".6" stop-color="#d62976"/><stop offset=".85" stop-color="#962fbf"/><stop offset="1" stop-color="#4f5bd5"/></linearGradient></defs><rect x="3" y="3" width="26" height="26" rx="7" fill="url(#igg)" stroke="#000"/><rect x="8" y="8" width="16" height="16" rx="5" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="16" cy="16" r="4" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="21" y="9" width="2.5" height="2.5" fill="#fff"/></svg>',
    github: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="3" width="26" height="26" rx="13" fill="#24292f" stroke="#000"/><path d="M10 9l3 3h6l3-3v5c1 1 1.5 2.5 1.5 4 0 3.5-2.5 5.5-6 6v3h-3v-3c-3.5-.5-6-2.5-6-6 0-1.5.5-3 1.5-4z" fill="#fff"/><path d="M9 23c1.5 0 2 1.5 4 1.5" stroke="#fff" stroke-width="1.5" fill="none"/></svg>',
    linkedin: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="3" width="26" height="26" rx="3" fill="#0a66c2" stroke="#000"/><rect x="8" y="13" width="4" height="12" fill="#fff"/><rect x="8" y="7" width="4" height="4" fill="#fff"/><path d="M15 13h4v2c1-1.5 2.5-2.3 4.3-2.3 2.6 0 3.7 1.7 3.7 4.6V25h-4v-7c0-1.5-.6-2.3-1.9-2.3-1.4 0-2.1 1-2.1 2.6V25h-4z" fill="#fff"/></svg>',
    terminal: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="2" y="4" width="28" height="24" fill="#c0c0c0" stroke="#000"/><rect x="2" y="4" width="28" height="4" fill="#000080"/><rect x="4" y="10" width="24" height="16" fill="#000"/><path d="M6 13h2v1h1v1h1v1h-1v1h-1v1H6v-1h1v-1h1v-1H7v-1H6z" fill="#c0c0c0"/><rect x="12" y="18" width="7" height="2" fill="#c0c0c0"/></svg>',
    recycle: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M7 9h18l-2 20H9z" fill="#dfe8e8" stroke="#000"/><rect x="5" y="6" width="22" height="3" fill="#c0c0c0" stroke="#000"/><rect x="13" y="3" width="6" height="3" fill="#c0c0c0" stroke="#000"/><path d="M12 13v12M16 13v12M20 13v12" stroke="#808080"/><rect x="10" y="18" width="5" height="4" fill="#fff" stroke="#000"/><rect x="16" y="15" width="5" height="4" fill="#ffdd6e" stroke="#000"/></svg>',
    bulb: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><circle cx="16" cy="12" r="9" fill="#ff0" stroke="#000"/><rect x="12" y="20" width="8" height="5" fill="#c0c0c0" stroke="#000"/><rect x="13" y="25" width="6" height="3" fill="#808080" stroke="#000"/><path d="M13 13l3 4 3-4" fill="none" stroke="#a80"/></svg>',
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

    projects: { title: 'Projects', icon: 'folder', alias: ['showcase', 'projects'] },

    github: { title: 'GitHub', icon: 'github', external: ME.github },
    linkedin: { title: 'LinkedIn', icon: 'linkedin', external: ME.linkedin },
    instagram: { title: 'Instagram', icon: 'instagram', external: ME.instagram },
    site: { title: 'My Website', icon: 'globe', external: ME.site }
  };

  var DESKTOP = ['showcase', 'projects', 'resume', 'terminal', 'tetris', 'mycomputer', 'github', 'linkedin', 'instagram', 'site', 'credits'];

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

  // ---------- Start menu ----------
  var startBtn = document.getElementById('start-btn');
  var startMenu = document.getElementById('start-menu');
  var startList = document.getElementById('start-list');
  var START = [
    ['showcase', null, 'My Showcase'], ['showcase', 'about', 'About'], ['showcase', 'experience', 'Experience'],
    ['showcase', 'projects', 'Projects'], ['showcase', 'contact', 'Contact'], '-',
    ['resume', null], ['terminal', null], ['tetris', null], ['github', null], ['linkedin', null], ['instagram', null], ['site', null], ['credits', null], '-', 'shutdown'
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
    tbody.addEventListener('dblclick', function (e) { var tr = e.target.closest('tr'); if (tr) msgBox(TRASH[+tr.dataset.i].name, esc(TRASH[+tr.dataset.i].note)); });
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
      on = true; saver.hidden = false; size(); seed(); raf = requestAnimationFrame(frame);
    }
    function stop() { if (!on) return; on = false; saver.hidden = true; cancelAnimationFrame(raf); }
    function poke() { stop(); clearTimeout(idleT); idleT = setTimeout(start, IDLE_MS); }
    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) { addEventListener(ev, poke, { passive: true }); });
    addEventListener('resize', function () { if (on) size(); });
    window.__aayushosSaver = { start: start, stop: stop };
    poke();
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
      'secret.txt': function () { return ['Nice try. The only secret is that I debug with print statements.']; },
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
          '<b>Owner</b>: Aayush Agrawal', '<b>Kernel</b>: Curiosity 3.0', '<b>Shell</b>: cmd.js', '<b>Fuel</b>: Chai'];
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
          setTimeout(function () { openApp('showcase', 'contact'); }, 900);
          return ['[sudo] password for recruiter: ********',
            '<span class="ok">Permission granted. Excellent choice.</span>',
            'Opening the contact page so you can say hi...'];
        }
        return ['guest is not in the sudoers file. This incident will be reported.'];
      },
      chai: function () { return ['☕ Brewing chai... done. Productivity +10.']; },
      coffee: function () { return ['Error 418: I\'m a chai person.']; },
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

  // ---------- Boot ----------
  setTimeout(function () {
    document.getElementById('boot').classList.add('done');
    openApp('showcase');
    var off = false; try { off = localStorage.getItem('aayushos-welcome-off') === '1'; } catch (e) {}
    if (!off && !SMALL) setTimeout(function () { openApp('welcome'); }, 700);
  }, 1800);
})();
