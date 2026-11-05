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
    mine: '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="2" y="2" width="28" height="28" fill="#c0c0c0" stroke="#000"/><circle cx="16" cy="17" r="7" fill="#000"/><rect x="15" y="6" width="2" height="22" fill="#000"/><rect x="5" y="16" width="22" height="2" fill="#000"/><rect x="13" y="14" width="3" height="3" fill="#fff"/></svg>',
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
      title: 'About Me', icon: 'me', w: 640, h: 560, x: 150, y: 40,
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
      title: 'Projects', icon: 'folder', w: 700, h: 460, x: 210, y: 90,
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
      title: 'Experience', icon: 'briefcase', w: 620, h: 520, x: 260, y: 60,
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
      title: 'Resume.pdf', icon: 'doc', w: 660, h: 620, x: 300, y: 30,
      status: 'Aayush-Agrawal-Resume.pdf',
      render: function () {
        return '<div class="addr"><span>File</span><input readonly value="C:\\Aayush\\Documents\\Aayush-Agrawal-Resume.pdf">' +
          '<a class="button-link" href="' + ME.resume + '" download>Download</a>' +
          '<a class="button-link" href="' + ME.resume + '" target="_blank" rel="noopener">Open</a></div>' +
          '<iframe class="resume-frame" src="' + ME.resume + '#view=FitH" title="Aayush Agrawal resume"></iframe>';
      }
    },

    contact: {
      title: 'Contact', icon: 'mail', w: 520, h: 520, x: 340, y: 80,
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
      title: 'This Computer', icon: 'computer', w: 460, h: 400, x: 380, y: 120,
      status: 'System properties',
      render: function () {
        return '<div class="page" style="text-align:center">' +
          '<div style="width:72px;margin:6px auto 10px">' + I.computer + '</div>' +
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

    mines: {
      title: 'Minesweeper', icon: 'mine', w: 0, h: 0, x: 430, y: 100, fixed: true,
      status: '',
      render: function () { return '<div class="mines" id="mines"></div>'; },
      mount: function (win) { Minesweeper(win.querySelector('#mines')); }
    },

    credits: {
      title: 'Credits', icon: 'star', w: 520, h: 460, x: 360, y: 90,
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
      title: 'aayushagrawal.codes', icon: 'globe', external: ME.site
    }
  };

  var DESKTOP = ['about', 'projects', 'experience', 'resume', 'contact', 'mycomputer', 'mines', 'site', 'credits'];

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
      function move(ev) { win.style.width = Math.max(300, ow + ev.clientX - sx) + 'px'; win.style.height = Math.max(160, oh + ev.clientY - sy) + 'px'; }
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
  ['about', 'projects', 'experience', 'resume', 'contact', '-', 'mines', 'site', 'credits', '-', 'shutdown'].forEach(function (id) {
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

  // ---------- Minesweeper ----------
  function Minesweeper(root) {
    var W = 9, H = 9, M = 10;
    var cells, mines, opened, flags, over, started, timer, seconds;
    root.innerHTML =
      '<div class="mines-top status-field-border"><span class="lcd" id="ms-left"></span>' +
      '<button class="smiley" id="ms-face">🙂</button><span class="lcd" id="ms-time"></span></div>' +
      '<div class="grid status-field-border" id="ms-grid" style="grid-template-columns:repeat(' + W + ',24px)"></div>';
    var grid = root.querySelector('#ms-grid'), face = root.querySelector('#ms-face');
    var left = root.querySelector('#ms-left'), time = root.querySelector('#ms-time');
    function pad(n) { return ('00' + Math.max(0, n)).slice(-3); }
    function reset() {
      clearInterval(timer); seconds = 0; over = false; started = false; flags = 0; opened = 0;
      mines = []; cells = [];
      grid.innerHTML = '';
      for (var i = 0; i < W * H; i++) {
        var c = document.createElement('div'); c.className = 'cell'; c.dataset.i = i;
        grid.appendChild(c); cells.push({ el: c, mine: false, open: false, flag: false, n: 0 });
      }
      face.textContent = '🙂'; left.textContent = pad(M); time.textContent = pad(0);
    }
    function nbrs(i) {
      var x = i % W, y = Math.floor(i / W), r = [];
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        var nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < W && ny >= 0 && ny < H) r.push(ny * W + nx);
      }
      return r;
    }
    function place(safe) {
      var banned = nbrs(safe).concat(safe);
      while (mines.length < M) {
        var r = Math.floor(Math.random() * W * H);
        if (banned.indexOf(r) < 0 && !cells[r].mine) { cells[r].mine = true; mines.push(r); }
      }
      cells.forEach(function (c, i) { c.n = nbrs(i).filter(function (j) { return cells[j].mine; }).length; });
      started = true;
      timer = setInterval(function () { seconds = Math.min(999, seconds + 1); time.textContent = pad(seconds); }, 1000);
    }
    function reveal(i) {
      var c = cells[i];
      if (c.open || c.flag) return;
      c.open = true; opened++;
      c.el.classList.add('open');
      if (c.mine) return;
      if (c.n) { c.el.textContent = c.n; c.el.classList.add('n' + c.n); }
      else nbrs(i).forEach(reveal);
    }
    function end(win, hit) {
      over = true; clearInterval(timer);
      face.textContent = win ? '😎' : '😵';
      mines.forEach(function (m) {
        if (win) { cells[m].el.textContent = '🚩'; }
        else if (!cells[m].flag) { cells[m].el.classList.add('open'); cells[m].el.textContent = '💣'; }
      });
      if (hit != null) cells[hit].el.classList.add('boom');
      if (win) left.textContent = pad(0);
    }
    grid.addEventListener('mousedown', function (e) { if (!over && e.button === 0) face.textContent = '😮'; });
    grid.addEventListener('mouseup', function () { if (!over) face.textContent = '🙂'; });
    grid.addEventListener('click', function (e) {
      var t = e.target.closest('.cell'); if (!t || over) return;
      var i = +t.dataset.i;
      if (!started) place(i);
      if (cells[i].flag) return;
      if (cells[i].mine) { reveal(i); end(false, i); return; }
      reveal(i);
      if (opened === W * H - M) end(true);
    });
    grid.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      var t = e.target.closest('.cell'); if (!t || over) return;
      var c = cells[+t.dataset.i]; if (c.open) return;
      c.flag = !c.flag; flags += c.flag ? 1 : -1;
      c.el.textContent = c.flag ? '🚩' : '';
      left.textContent = pad(M - flags);
    });
    face.addEventListener('click', reset);
    reset();
  }

  // ---------- Boot ----------
  setTimeout(function () {
    document.getElementById('boot').classList.add('done');
    openApp('about');
  }, 1800);
})();
