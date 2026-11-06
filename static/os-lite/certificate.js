/*
 * AayushOS completion certificate. Shared by AayushOS (/os/) and AayushOS Lite (/os-lite/).
 *
 *   aosCertificate.download({ name: 'Ada', titles: ['Explorer', ...] })
 *
 * Draws a landscape certificate on a canvas with the site's own fonts and saves it as a PNG.
 * Everything happens in the browser; nothing is uploaded.
 */
(function () {
  var BASE = '/os-lite/fonts/';
  var W = 1600, H = 1131;
  var fontsReady = null;

  function loadFonts() {
    if (fontsReady) return fontsReady;
    var faces = [
      new FontFace('CertFraunces', 'url(' + BASE + 'fraunces-full.woff2)', { weight: '100 900' }),
      new FontFace('CertTinos', 'url(' + BASE + 'tinos-400.woff2)', { weight: '400' }),
      new FontFace('CertTinos', 'url(' + BASE + 'tinos-400-italic.woff2)', { weight: '400', style: 'italic' }),
      new FontFace('CertPixel', 'url(' + BASE + 'dotgothic16.woff2)')
    ];
    fontsReady = Promise.all(faces.map(function (f) {
      return f.load().then(function (l) { document.fonts.add(l); }).catch(function () {});
    }));
    return fontsReady;
  }

  function istDate() {
    try {
      return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
    } catch (e) {
      return new Date().toDateString();
    }
  }

  function fit(g, text, font, size, max) {
    var s = size;
    do { g.font = font.replace('{s}', s + 'px'); s -= 2; } while (g.measureText(text).width > max && s > 20);
  }

  function trophy(g, x, y, k) {
    // the same pixel trophy as the desktop icon, k px per pixel
    var P = [
      [3, 1, 10, 1, '#000'], [2, 2, 1, 4, '#000'], [13, 2, 1, 4, '#000'], [1, 2, 1, 1, '#000'], [14, 2, 1, 1, '#000'],
      [4, 2, 8, 5, '#f6c94d'], [4, 2, 2, 5, '#ffec8c'], [5, 7, 6, 1, '#f6c94d'], [6, 8, 4, 1, '#f6c94d'],
      [7, 9, 2, 2, '#c9962c'], [5, 11, 6, 1, '#c9962c'], [4, 12, 8, 2, '#8a5a2b'], [3, 6, 1, 1, '#000'], [12, 6, 1, 1, '#000']
    ];
    P.forEach(function (p) { g.fillStyle = p[4]; g.fillRect(x + p[0] * k, y + p[1] * k, p[2] * k, p[3] * k); });
  }

  function draw(opts) {
    var name = (opts.name || '').trim() || 'A Very Curious Visitor';
    var titles = opts.titles || [];
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g = c.getContext('2d');

    // paper
    g.fillStyle = '#fbf7ec'; g.fillRect(0, 0, W, H);
    g.globalAlpha = 0.05;
    for (var i = 0; i < 9000; i++) { g.fillStyle = i % 2 ? '#8a6a3a' : '#ffffff'; g.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
    g.globalAlpha = 1;

    // double border: navy outside, orange inside, with pixel corners
    g.fillStyle = '#0000a3';
    g.fillRect(36, 36, W - 72, 14); g.fillRect(36, H - 50, W - 72, 14); g.fillRect(36, 36, 14, H - 72); g.fillRect(W - 50, 36, 14, H - 72);
    g.fillStyle = '#ff6a1a';
    g.fillRect(66, 66, W - 132, 4); g.fillRect(66, H - 70, W - 132, 4); g.fillRect(66, 66, 4, H - 132); g.fillRect(W - 70, 66, 4, H - 132);
    [[50, 50], [W - 86, 50], [50, H - 86], [W - 86, H - 86]].forEach(function (p) {
      g.fillStyle = '#0000a3'; g.fillRect(p[0], p[1], 36, 36);
      g.fillStyle = '#ff6a1a'; g.fillRect(p[0] + 12, p[1] + 12, 12, 12);
    });

    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';

    // logo: orange A tile + wordmark
    var lx = W / 2 - 170, ly = 120;
    g.fillStyle = '#ff6a1a'; g.fillRect(lx, ly, 64, 64);
    g.fillStyle = '#b84a0e'; g.fillRect(lx, ly + 58, 64, 6); g.fillRect(lx + 58, ly, 6, 64);
    g.fillStyle = '#fff'; g.font = '900 48px CertFraunces, serif'; g.fillText('A', lx + 30, ly + 50);
    g.textAlign = 'left'; g.fillStyle = '#111'; g.font = '900 46px CertFraunces, serif'; g.fillText('AayushOS', lx + 84, ly + 50);
    var wm = g.measureText('AayushOS').width;
    g.fillStyle = '#ff6a1a'; g.fillText('98', lx + 84 + wm + 12, ly + 50);
    g.textAlign = 'center';

    g.fillStyle = '#0000a3'; g.font = '30px CertPixel, monospace';
    g.fillText('CERTIFICATE OF COMPLETION', W / 2, 262);

    g.fillStyle = '#333'; g.font = 'italic 34px CertTinos, serif';
    g.fillText('This certifies that', W / 2, 340);

    g.fillStyle = '#111'; fit(g, name, '900 {s} CertFraunces, serif', 96, W - 360);
    g.fillText(name, W / 2, 450);
    var nw = Math.min(g.measureText(name).width + 80, W - 300);
    g.fillStyle = '#ff6a1a'; g.fillRect(W / 2 - nw / 2, 478, nw, 4);

    g.fillStyle = '#333'; g.font = '34px CertTinos, serif';
    g.fillText('unlocked every achievement in AayushOS 98 on aayushagrawal.in,', W / 2, 548);
    g.fillText('found the secrets, survived the screensaver and never gave up on Shut Down.', W / 2, 592);

    // achievement badges, two rows
    var per = Math.ceil(titles.length / 2), bw = 168, gap = 8;
    g.font = '17px CertPixel, monospace';
    titles.forEach(function (t, i) {
      var row = i < per ? 0 : 1, col = row ? i - per : i, n = row ? titles.length - per : per;
      var x0 = W / 2 - (n * bw + (n - 1) * gap) / 2 + col * (bw + gap), y0 = 630 + row * 88;
      g.fillStyle = '#efe7d2'; g.fillRect(x0, y0, bw, 78);
      g.fillStyle = '#d8ccae'; g.fillRect(x0, y0 + 74, bw, 4); g.fillRect(x0 + bw - 4, y0, 4, 78);
      trophy(g, x0 + bw / 2 - 24, y0 + 6, 3);
      g.fillStyle = '#222'; fit(g, t, '{s} CertPixel, monospace', 17, bw - 14); g.fillText(t, x0 + bw / 2, y0 + 68);
    });

    // footer: date, seal, signature
    var fy = 920;
    g.fillStyle = '#111'; g.font = '30px CertTinos, serif'; g.fillText(istDate(), 340, fy);
    g.fillStyle = '#555'; g.fillRect(200, fy + 16, 280, 2);
    g.font = '20px CertPixel, monospace'; g.fillText('DATE (IST)', 340, fy + 48);

    g.fillStyle = '#111'; g.font = 'italic 44px CertTinos, serif'; g.fillText('Aayush Agrawal', W - 340, fy - 4);
    g.fillStyle = '#555'; g.fillRect(W - 480, fy + 16, 280, 2);
    g.font = '20px CertPixel, monospace'; g.fillText('SYSADMIN, AAYUSHOS', W - 340, fy + 48);

    // seal
    var sx = W / 2, sy = fy - 6;
    g.fillStyle = '#ff6a1a'; g.beginPath();
    for (var k = 0; k < 32; k++) { var a = (k / 32) * Math.PI * 2, r = k % 2 ? 84 : 95; g.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); }
    g.closePath(); g.fill();
    g.fillStyle = '#fbf7ec'; g.beginPath(); g.arc(sx, sy, 68, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ff6a1a'; g.beginPath(); g.arc(sx, sy, 61, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.font = '900 38px CertFraunces, serif'; g.fillText('100%', sx, sy + 8);
    g.font = '15px CertPixel, monospace'; g.fillText('COMPLETE', sx, sy + 32);

    g.fillStyle = '#777'; g.font = '20px CertPixel, monospace';
    g.fillText('aayushagrawal.in  ·  issued by AayushOS 98, Bangalore Edition', W / 2, H - 92);
    return c;
  }

  function download(opts) {
    return loadFonts().then(function () {
      var c = draw(opts || {});
      return new Promise(function (res) {
        c.toBlob(function (blob) {
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url; a.download = 'AayushOS-certificate.png';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          res(blob);
        }, 'image/png');
      });
    });
  }

  window.aosCertificate = { download: download, draw: function (o) { return loadFonts().then(function () { return draw(o || {}); }); } };
})();
