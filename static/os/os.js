/* AayushOS 98 — a small retro desktop for aayushagrawal.in
 * Original code by Aayush Agrawal. UI styling from 98.css (MIT, Jordan Scales).
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
    { name: 'aayushagrawal.codes', type: 'Website', stack: ['HTML', 'CSS', 'JavaScript'], url: 'https://aayushagrawal.codes', urlLabel: 'Open site',
      desc: 'My minimal portfolio: light and dark themes, no build step, hosted on GitHub Pages.' }
  ];

  // ---------- Icons (original pixel art) ----------
  var I = {
    me: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="4" y="2" width="24" height="28" fill="#fff" stroke="#000"/><rect x="11" y="6" width="10" height="9" fill="#e9b48a"/><rect x="10" y="5" width="12" height="3" fill="#2b1a10"/><rect x="8" y="17" width="16" height="10" fill="#ff6a1a"/><rect x="13" y="16" width="6" height="2" fill="#e9b48a"/></svg>',
    folder: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M2 8h11l2 3h15v17H2z" fill="#f6c94d" stroke="#000"/><rect x="2" y="13" width="28" height="15" fill="#ffdd6e" stroke="#000"/></svg>',
    doc: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M6 2h14l6 6v22H6z" fill="#fff" stroke="#000"/><path d="M20 2v6h6" fill="#ddd" stroke="#000"/><rect x="9" y="12" width="14" height="2" fill="#000080"/><rect x="9" y="16" width="14" height="2" fill="#777"/><rect x="9" y="20" width="10" height="2" fill="#777"/><rect x="9" y="24" width="12" height="2" fill="#777"/></svg>',
    briefcase: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="12" y="5" width="8" height="5" fill="none" stroke="#000" stroke-width="2"/><rect x="3" y="9" width="26" height="18" fill="#8a5a2b" stroke="#000"/><rect x="3" y="15" width="26" height="2" fill="#5c3a19"/><rect x="14" y="14" width="4" height="4" fill="#f6c94d" stroke="#000"/></svg>',
    mail: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="8" width="26" height="17" fill="#fff" stroke="#000"/><path d="M3 8l13 10L29 8" fill="none" stroke="#000"/><rect x="22" y="3" width="7" height="7" fill="#ff6a1a" stroke="#000"/></svg>',
    phone: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="9" y="2" width="14" height="28" rx="2" fill="#222" stroke="#000"/><rect x="11" y="5" width="10" height="19" fill="#4fc3f7"/><rect x="13" y="8" width="6" height="3" fill="#fff"/><rect x="13" y="13" width="6" height="3" fill="#ff6a1a"/><rect x="15" y="26" width="2" height="2" fill="#888"/></svg>',
    computer: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="4" y="3" width="24" height="18" fill="#c0c0c0" stroke="#000"/><rect x="7" y="6" width="18" height="12" fill="#0f6f6a"/><rect x="9" y="8" width="5" height="4" fill="#ff6a1a"/><rect x="12" y="21" width="8" height="3" fill="#888"/><rect x="6" y="24" width="20" height="5" fill="#c0c0c0" stroke="#000"/></svg>',
    tetris: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="4" y="18" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="12" y="18" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="20" y="18" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="20" y="10" width="8" height="8" fill="#ff6a1a" stroke="#000"/><rect x="4" y="2" width="8" height="8" fill="#00c8e6" stroke="#000"/><rect x="4" y="10" width="8" height="8" fill="#00c8e6" stroke="#000"/><rect x="12" y="10" width="8" height="8" fill="#a347d6" stroke="#000"/></svg>',
    globe: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><circle cx="16" cy="16" r="12" fill="#4fa3e0" stroke="#000"/><path d="M10 9h6v5h-4v4h-3v-4H7zM18 16h6v6h-3v4h-4v-6h1z" fill="#3c9a3c"/><path d="M4 16h24M16 4v24" stroke="#1d5f99" fill="none"/></svg>',
    star: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M16 3l4 9 10 1-7.5 7 2 10L16 25l-8.5 5 2-10L2 13l10-1z" fill="#f6c94d" stroke="#000"/></svg>',
    power: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="3" width="26" height="26" fill="#c0c0c0" stroke="#000"/><path d="M11 10a8 8 0 1 0 10 0" fill="none" stroke="#c00" stroke-width="3"/><rect x="14.5" y="6" width="3" height="10" fill="#c00"/></svg>'
  };

  // ---------- Helpers ----------
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ext(url, label) { return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label || url) + '</a>'; }
  function btnLink(url, label) { return '<a class="button-link" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + '</a>'; }

  // ---------- Apps ----------
  var APPS = {
    about: {
      title: 'About Me', icon: 'me', w: 820, h: 760, x: 170, y: 30,
      status: 'aayushagrawal.in',
      render: function () {
        return '<div class="page">' +
          '<div class="hero"><div class="avatar">A</div><div>' +
          '<h1>Aayush Agrawal</h1>' +
          '<p class="accent"><b>Developer · AI &amp; ML student · Bangalore</b></p>' +
          '<p>I build small, useful software: Python tools, Discord bots and websites.</p>' +
          '</div></div>' +
          '<h2>About</h2>' +
          '<p>I\'m an undergraduate in Artificial Intelligence &amp; Machine Learning at <b>BMS College of Engineering</b>, Bangalore. I enjoy building things from scratch: a quick Python utility, a bot for a community, or a long dig into how a model actually learns.</p>' +
          '<p>I\'m part of <b>@clienterrverse</b>, where I work on open-source projects with other developers and learn how real-world software gets made.</p>' +
          '<p>When I\'m not coding, I\'m reading docs, taking things apart to see how they work, and collecting ideas for the next side project.</p>' +
          '<dl class="facts">' +
          '<dt>Degree</dt><dd>B.E. AI &amp; ML (expected Apr 2028)</dd>' +
          '<dt>College</dt><dd>BMS College of Engineering</dd>' +
          '<dt>Location</dt><dd>Bangalore, India</dd>' +
          '<dt>Languages</dt><dd>English, Hindi, Nepali</dd>' +
          '<dt>Status</dt><dd>Open to internships &amp; collaborations</dd>' +
          '</dl>' +
          '<h2>Tools I use</h2><div class="tags">' +
          ['Python', 'JavaScript', 'Java', 'C', 'HTML & CSS', 'Node.js', 'Discord.js', 'MySQL', 'MongoDB', 'Machine Learning', 'Git'].map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
          '</div>' +
          '<div class="btn-row">' +
          '<button data-open="projects">My Projects</button>' +
          '<button data-open="resume">Resume</button>' +
          '<button data-open="contact">Contact</button>' +
          '</div></div>';
      }
    },

    projects: {
      title: 'Projects', icon: 'folder', w: 900, h: 600, x: 190, y: 60,
      status: PROJECTS.length + ' object(s)',
      render: function () {
        return '<div class="addr"><span>Address</span><input id="proj-addr" readonly value="C:\\Aayush\\Projects\\' + esc(PROJECTS[0].name) + '"></div>' +
          '<div class="explorer">' +
          '<div class="list"><ul class="tree-view" id="proj-list">' +
          PROJECTS.map(function (p, i) { return '<li data-i="' + i + '"' + (i === 0 ? ' class="sel"' : '') + '>📁 ' + esc(p.name) + '</li>'; }).join('') +
          '</ul></div>' +
          '<div class="detail"><div class="page" id="proj-detail"></div></div>' +
          '</div>';
      },
      mount: function (win) {
        var list = win.querySelector('#proj-list');
        var detail = win.querySelector('#proj-detail');
        var addr = win.querySelector('#proj-addr');
        function show(i) {
          var p = PROJECTS[i];
          detail.innerHTML =
            '<div class="row"><h1>' + esc(p.name) + '</h1>' + (p.date ? '<span class="date">' + esc(p.date) + '</span>' : '') + '</div>' +
            '<p class="accent"><b>' + esc(p.type) + '</b></p>' +
            '<p>' + esc(p.desc) + '</p>' +
            '<div class="tags">' + p.stack.map(function (s) { return '<span class="tag">' + esc(s) + '</span>'; }).join('') + '</div>' +
            '<div class="btn-row">' + btnLink(p.url, p.urlLabel) + '</div>';
          addr.value = 'C:\\Aayush\\Projects\\' + p.name;
          Array.prototype.forEach.call(list.children, function (li) { li.classList.toggle('sel', +li.dataset.i === i); });
        }
        list.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) show(+li.dataset.i); });
        show(0);
      }
    },

    experience: {
      title: 'Experience', icon: 'briefcase', w: 820, h: 740, x: 230, y: 40,
      status: 'Education, leadership & certifications',
      render: function () {
        return '<div class="page">' +
          '<h1>Experience</h1><p class="muted">Education, leadership and certifications.</p>' +
          '<h2>Education</h2>' +
          '<div class="row"><h3>BMS College of Engineering</h3><span class="date">Expected Apr 2028</span></div>' +
          '<p>B.E. in Artificial Intelligence &amp; Machine Learning, Bengaluru</p>' +
          '<div class="row"><h3>Shiv Jyoti International School</h3><span class="date">Apr 2024</span></div>' +
          '<p>CBSE Grade 11–12: Physics, Chemistry, Math, Kota</p>' +
          '<div class="row"><h3>Mayo College</h3><span class="date">Jul 2022</span></div>' +
          '<p>CBSE Grade 5–10, Ajmer</p>' +
          '<h2>Leadership</h2>' +
          '<div class="row"><h3>Student Volunteer, BMSCE UTSAV</h3><span class="date">Apr 2025 – May 2026</span></div>' +
          '<ul><li>Managed end-to-end distribution of festival merchandise across sales counters.</li>' +
          '<li>Worked with committee members on merch strategy and sales targets for the fest.</li></ul>' +
          '<div class="row"><h3>Rotaract Club of BMSCE, Member</h3><span class="date">Apr 2023 – Apr 2024</span></div>' +
          '<ul><li>Community service and leadership initiatives across Bengaluru.</li>' +
          '<li>40+ hours of social and community service.</li></ul>' +
          '<h2>Certifications</h2>' +
          '<div class="row"><p><b>C for Beginners</b>, Great Learning</p><span class="date">Jan 2025</span></div>' +
          '<div class="row"><p><b>Using MongoDB with Python</b>, MongoDB</p><span class="date">Nov 2024</span></div>' +
          '</div>';
      }
    },

    resume: {
      title: 'Resume.pdf', icon: 'doc', w: 820, h: 800, x: 260, y: 20,
      status: 'Aayush-Agrawal-Resume.pdf',
      render: function () {
        return '<div class="addr"><span>File</span><input readonly value="C:\\Aayush\\Documents\\Aayush-Agrawal-Resume.pdf">' +
          '<a class="button-link" href="' + ME.resume + '" download>Download</a>' +
          '<a class="button-link" href="' + ME.resume + '" target="_blank" rel="noopener">Open</a></div>' +
          '<iframe class="resume-frame" src="' + ME.resume + '#view=FitH" title="Aayush Agrawal resume"></iframe>';
      }
    },

    contact: {
      title: 'Contact', icon: 'mail', w: 700, h: 720, x: 300, y: 50,
      status: 'Replies usually within a day or two',
      render: function () {
        return '<div class="page">' +
          '<h1>Say hi 👋</h1>' +
          '<p>Want to collaborate, talk about AI and ML, or offer an internship? My inbox is open.</p>' +
          '<form class="form" id="contact-form">' +
          '<div class="field-row-stacked"><label for="c-name">Your name</label><input id="c-name" type="text" required></div>' +
          '<div class="field-row-stacked"><label for="c-msg">Message</label><textarea id="c-msg" required></textarea></div>' +
          '<div class="btn-row" style="margin-top:2px"><button type="submit">Send email</button></div>' +
          '</form>' +
          '<h2>Elsewhere</h2>' +
          '<ul>' +
          '<li>Email: ' + ext('mailto:' + ME.email, ME.email) + '</li>' +
          '<li>GitHub: ' + ext(ME.github, 'github.com/aayushagrawall') + '</li>' +
          '<li>LinkedIn: ' + ext(ME.linkedin, 'linkedin.com/in/aayush-agrawall') + '</li>' +
          '<li>Instagram: ' + ext(ME.instagram, '@_aayush.agrawal') + '</li>' +
          '<li>Website: ' + ext(ME.site, 'aayushagrawal.codes') + '</li>' +
          '</ul></div>';
      },
      mount: function (win) {
        win.querySelector('#contact-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var name = win.querySelector('#c-name').value.trim();
          var msg = win.querySelector('#c-msg').value.trim();
          var url = 'mailto:' + ME.email + '?subject=' + encodeURIComponent('Hello from ' + (name || 'aayushagrawal.in')) + '&body=' + encodeURIComponent(msg + '\n\n— ' + name);
          window.open(url, '_blank');
        });
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
          '<div class="facts" style="text-align:left;max-width:320px;margin:14px auto">' +
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
      title: 'Credits', icon: 'star', w: 700, h: 620, x: 320, y: 70,
      status: '© 2026 Aayush Agrawal',
      render: function () {
        return '<div class="page credits">' +
          '<h1>Credits</h1><p class="muted">aayushagrawal.in, 2026</p>' +
          '<h2>Content &amp; AayushOS</h2><p>Aayush Agrawal</p>' +
          '<h2>3D scene</h2><p>Based on the open-source portfolio by <b>Henry Heffernan</b> ' + ext('https://github.com/henryjeff/portfolio-website', '(MIT licence)') + '</p>' +
          '<p>Computer model: Mickael Boitte · Environment models: Sean Nicolas</p>' +
          '<h2>Interface</h2><p>' + ext('https://github.com/jdan/98.css', '98.css') + ' by Jordan Scales (MIT licence)</p>' +
          '</div>';
      }
    },

    site: {
      title: 'My Website', icon: 'globe', external: ME.site
    }
  };

  var DESKTOP = ['about', 'projects', 'experience', 'resume', 'contact', 'mycomputer', 'tetris', 'site', 'credits'];

  // ---------- Window manager ----------
  var windowsEl = document.getElementById('windows');
  var taskEl = document.getElementById('task-buttons');
  var open = {};
  var z = 10;

  function focus(id) {
    Object.keys(open).forEach(function (k) {
      open[k].win.classList.toggle('active', k === id);
      open[k].task.classList.toggle('active', k === id && !open[k].win.hidden);
    });
    if (open[id]) open[id].win.style.zIndex = ++z;
  }

  function openApp(id) {
    var app = APPS[id];
    if (!app) return;
    if (app.external) { window.open(app.external, '_blank', 'noopener'); return; }
    closeStart();
    if (open[id]) { open[id].win.hidden = false; focus(id); return; }

    var win = el(
      '<div class="window win" role="dialog" aria-label="' + esc(app.title) + '">' +
        '<div class="title-bar"><div class="title-bar-text">' + I[app.icon] + '<span>' + esc(app.title) + '</span></div>' +
        '<div class="title-bar-controls">' +
          '<button aria-label="Minimize"></button>' +
          (app.fixed ? '' : '<button aria-label="Maximize"></button>') +
          '<button aria-label="Close"></button>' +
        '</div></div>' +
        '<div class="window-body">' + app.render() + '</div>' +
        (app.status ? '<div class="status-bar"><p class="status-bar-field">' + esc(app.status) + '</p></div>' : '') +
        (app.fixed ? '' : '<div class="resize"></div>') +
      '</div>');

    var offset = Object.keys(open).length * 18;
    win.style.left = (app.x + offset) + 'px';
    win.style.top = (app.y + offset) + 'px';
    if (!app.fixed) { win.style.width = app.w + 'px'; win.style.height = app.h + 'px'; }
    windowsEl.appendChild(win);

    var task = el('<button>' + I[app.icon] + '<span>' + esc(app.title) + '</span></button>');
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
    var b = el('<button class="icon" title="' + esc(app.title) + '">' + I[app.icon] + '<span>' + esc(app.title) + '</span></button>');
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
  ['about', 'projects', 'experience', 'resume', 'contact', '-', 'tetris', 'site', 'credits', '-', 'shutdown'].forEach(function (id) {
    if (id === '-') { startList.appendChild(el('<hr>')); return; }
    if (id === 'shutdown') {
      var s = el('<li>' + I.power + '<span>Shut Down...</span></li>');
      s.addEventListener('click', shutdown);
      startList.appendChild(s);
      return;
    }
    var li = el('<li>' + I[APPS[id].icon] + '<span>' + esc(APPS[id].title) + '</span></li>');
    li.addEventListener('click', function () { openApp(id); });
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
      setTimeout(function () { boot.classList.add('done'); openApp('about'); }, 1700);
    });
  }

  // ---------- Clock ----------
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
    openApp('about');
  }, 1800);
})();
