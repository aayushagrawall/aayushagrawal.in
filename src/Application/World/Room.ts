import * as THREE from 'three';
import type Personal from './Personal';

/**
 * The lo-fi bedroom around the desk: walls, a window onto Bangalore, a wooden floor with a
 * wavy rug, an LED backlight behind the desk, fairy lights with polaroids, a floating shelf
 * and two posters. Textures come from scripts/room-textures.py (all drawn from scratch).
 *
 * It's a diorama: the walls are single-sided and face into the room, so from outside, the
 * walls between the camera and the desk disappear and the room reads like a cut-away model.
 * Like the rest of the scene the materials are unlit; the time of day tints them (Personal),
 * and the lights (LEDs, fairy lights, window) are glows added on top.
 */

// room box (scene units; the desk top is at y = -452, the floor at about -2985)
const FLOOR_Y = -2982;
const TOP_Y = 5200;
const X0 = -6000;
const X1 = 6200;
const BACK_Z = -2600;
const FRONT_Z = 6400;

export type RoomMood = 'lofi' | 'sunset' | 'cyber' | 'off';

const MOODS: { [k in RoomMood]: [string, string, string] } = {
    lofi: ['#8a5cff', '#ff5fb4', '#4f7dff'],
    sunset: ['#ff7a3d', '#ff4f8b', '#ffb347'],
    cyber: ['#00e5ff', '#3d5afe', '#c040ff'],
    off: ['#000000', '#000000', '#000000'],
};

export default class Room {
    personal: Personal;
    group: THREE.Group;
    windowMat?: THREE.MeshBasicMaterial;
    windowTex: { [k: string]: THREE.Texture } = {};
    led?: { glow: THREE.MeshBasicMaterial; line: THREE.MeshBasicMaterial; floor: THREE.MeshBasicMaterial; canvas: HTMLCanvasElement; tex: THREE.CanvasTexture; lineTex: THREE.CanvasTexture; lineCanvas: HTMLCanvasElement };
    bulbs: THREE.MeshBasicMaterial[] = [];
    moonGlow?: THREE.MeshBasicMaterial;
    mood: RoomMood = 'lofi';
    level = 0;

    constructor(personal: Personal) {
        this.personal = personal;
        this.group = new THREE.Group();
        this.group.name = 'room';
        personal.group.add(this.group);

        this.addShell();
        this.addWindow();
        this.addLedStrip();
        this.addShelf();
        this.addFairyLights();
        this.addPosters();
    }

    tex(name: string, repeat?: [number, number]) {
        const t = this.personal.texture(`textures/room/${name}`);
        if (repeat) {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(repeat[0], repeat[1]);
        }
        return t;
    }

    /** A box with simple per-face shading (light from the front-left, above). */
    box(w: number, h: number, d: number, color: number, map?: THREE.Texture) {
        const P = this.personal;
        const k = [0.86, 0.7, 1.0, 0.55, 0.93, 0.6]; // +x, -x, +y, -y, +z, -z
        const mats = k.map((s) => P.basic({ color: P.shade(color, s), map: map || null }));
        return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
    }

    // ---------- walls, floor, rug
    addShell() {
        const P = this.personal;
        const H = TOP_Y - FLOOR_Y;
        const midY = (TOP_Y + FLOOR_Y) / 2;

        const back = new THREE.Mesh(
            new THREE.PlaneGeometry(X1 - X0, H),
            P.basic({ color: new THREE.Color(0.8, 0.75, 0.93), map: this.tex('wall-back.webp') })
        );
        back.position.set((X0 + X1) / 2, midY, BACK_Z);
        this.group.add(back);

        const sideLen = FRONT_Z - BACK_Z;
        const leftMap = this.tex('wall-side.webp');
        const left = new THREE.Mesh(new THREE.PlaneGeometry(sideLen, H), P.basic({ color: new THREE.Color(0.7, 0.65, 0.84), map: leftMap }));
        left.rotation.y = Math.PI / 2; // faces +x; texture's right edge (darker corner) is at the back
        left.position.set(X0, midY, (BACK_Z + FRONT_Z) / 2);
        this.group.add(left);

        const rightMap = this.tex('wall-side.webp');
        rightMap.wrapS = THREE.RepeatWrapping;
        rightMap.repeat.x = -1; // mirror, so its darker corner is at the back too
        const right = new THREE.Mesh(new THREE.PlaneGeometry(sideLen, H), P.basic({ color: new THREE.Color(0.75, 0.7, 0.88), map: rightMap }));
        right.rotation.y = -Math.PI / 2;
        right.position.set(X1, midY, (BACK_Z + FRONT_Z) / 2);
        this.group.add(right);

        // skirting boards
        const skirt = (w: number, x: number, z: number, ry: number) => {
            const s = this.box(w, 220, 40, 0xf4f0fa);
            s.position.set(x, FLOOR_Y + 110, z);
            s.rotation.y = ry;
            this.group.add(s);
        };
        skirt(X1 - X0, 0, BACK_Z + 20, 0);
        skirt(sideLen, X0 + 20, (BACK_Z + FRONT_Z) / 2, Math.PI / 2);
        skirt(sideLen, X1 - 20, (BACK_Z + FRONT_Z) / 2, -Math.PI / 2);

        // wooden floor and the rug are multiplied over the baked floor, so the desk's and the
        // chair's baked shadows still show through (and the time of day tint, already on it)
        const multiply = (map: THREE.Texture) =>
            new THREE.MeshBasicMaterial({ map, blending: THREE.MultiplyBlending, transparent: true, depthWrite: false });
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(X1 - X0, sideLen), multiply(this.tex('floor.webp', [4, 3])));
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, FLOOR_Y + 4, (BACK_Z + FRONT_Z) / 2);
        floor.renderOrder = 1;
        this.group.add(floor);

        const rug = new THREE.Mesh(new THREE.PlaneGeometry(4800, 4800), multiply(this.tex('rug.webp')));
        rug.rotation.x = -Math.PI / 2;
        rug.position.set(700, FLOOR_Y + 8, 2500);
        rug.renderOrder = 2;
        this.group.add(rug);
    }

    // ---------- window onto Bangalore (day, sunset and night pictures)
    addWindow() {
        const P = this.personal;
        for (const m of ['day', 'sunset', 'night']) this.windowTex[m] = this.tex(`window-${m}.webp`);
        // the view is its own light: not tinted by the time of day
        this.windowMat = new THREE.MeshBasicMaterial({ map: this.windowTex.day });
        const W = 2400;
        const H = 3000;
        const cx = -3500;
        const cy = 1950;
        const win = new THREE.Mesh(new THREE.PlaneGeometry(W, H), this.windowMat);
        win.position.set(cx, cy, BACK_Z + 6);
        this.group.add(win);
        const sill = this.box(W + 300, 110, 300, 0xf6f4f0);
        sill.position.set(cx, cy - H / 2 - 40, BACK_Z + 150);
        this.group.add(sill);
        // moonlight / city glow spilling onto the wall around the window at night
        this.moonGlow = new THREE.MeshBasicMaterial({
            map: P.glowTexture(),
            color: new THREE.Color('#7b6cff'),
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const glow = new THREE.Mesh(new THREE.PlaneGeometry(W * 2.2, H * 1.9), this.moonGlow);
        glow.position.set(cx, cy, BACK_Z + 3);
        this.group.add(glow);
        // a tiny plant on the sill
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(110, 85, 200, 20), P.basic({ color: P.shade(0xf2a7a0, 0.95) }));
        pot.position.set(cx + 800, cy - H / 2 + 115, BACK_Z + 160);
        this.group.add(pot);
        const leafMat = P.basic({ color: P.shade(0x7fbf8e, 0.95) });
        for (const [dx, dy, s] of [[0, 200, 1], [-70, 150, 0.8], [75, 160, 0.85], [-20, 260, 0.7]] as [number, number, number][]) {
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(90 * s, 12, 10), leafMat);
            leaf.scale.set(1, 1.4, 0.7);
            leaf.position.set(pot.position.x + dx, pot.position.y + dy, pot.position.z);
            this.group.add(leaf);
        }
    }

    // ---------- LED backlight behind the desk
    addLedStrip() {
        const P = this.personal;
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const tex = new THREE.CanvasTexture(canvas);
        const lineCanvas = document.createElement('canvas');
        lineCanvas.width = 512;
        lineCanvas.height = 4;
        const lineTex = new THREE.CanvasTexture(lineCanvas);
        const add = (map: THREE.Texture, opacity = 1) =>
            new THREE.MeshBasicMaterial({ map, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
        const glow = add(tex);
        const floor = add(tex);
        const line = new THREE.MeshBasicMaterial({ map: lineTex });
        this.led = { glow, line, floor, canvas, tex, lineTex, lineCanvas };

        const x0 = -3700;
        const x1 = 2700;
        const y = -330;
        // the strip itself, on the wall just above the desk top
        const strip = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 26, 26), line);
        strip.position.set((x0 + x1) / 2, y, BACK_Z + 16);
        this.group.add(strip);
        // light washing up the wall
        const wash = new THREE.Mesh(new THREE.PlaneGeometry((x1 - x0) * 1.35, 4200), glow);
        wash.position.set((x0 + x1) / 2, y + 2100 - 500, BACK_Z + 10);
        this.group.add(wash);
        // and a little spill under the desk onto the floor (the strip under the desk top)
        const spill = new THREE.Mesh(new THREE.PlaneGeometry((x1 - x0) * 1.2, 3000), floor);
        spill.rotation.x = -Math.PI / 2;
        spill.position.set((x0 + x1) / 2, FLOOR_Y + 12, -400);
        spill.renderOrder = 3;
        this.group.add(spill);
        this.paintLed();
        void P;
    }

    /** Redraw the LED gradient for the current mood (cheap: two small canvases). */
    paintLed() {
        const L = this.led;
        if (!L) return;
        const [a, b, c] = MOODS[this.mood];
        const g = L.canvas.getContext('2d')!;
        const W = L.canvas.width;
        const H = L.canvas.height;
        g.clearRect(0, 0, W, H);
        const across = g.createLinearGradient(0, 0, W, 0);
        across.addColorStop(0.08, a);
        across.addColorStop(0.5, b);
        across.addColorStop(0.92, c);
        g.fillStyle = across;
        g.fillRect(0, 0, W, H);
        // fade upwards and towards the ends
        g.globalCompositeOperation = 'destination-in';
        const up = g.createLinearGradient(0, H, 0, 0);
        up.addColorStop(0, 'rgba(0,0,0,1)');
        up.addColorStop(0.18, 'rgba(0,0,0,0.75)');
        up.addColorStop(0.55, 'rgba(0,0,0,0.22)');
        up.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = up;
        g.fillRect(0, 0, W, H);
        const ends = g.createLinearGradient(0, 0, W, 0);
        ends.addColorStop(0, 'rgba(0,0,0,0)');
        ends.addColorStop(0.16, 'rgba(0,0,0,1)');
        ends.addColorStop(0.84, 'rgba(0,0,0,1)');
        ends.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = ends;
        g.fillRect(0, 0, W, H);
        g.globalCompositeOperation = 'source-over';
        L.tex.needsUpdate = true;

        const lg = L.lineCanvas.getContext('2d')!;
        const lw = L.lineCanvas.width;
        const line = lg.createLinearGradient(0, 0, lw, 0);
        const lit = this.mood !== 'off';
        line.addColorStop(0, lit ? a : '#2a2a30');
        line.addColorStop(0.5, lit ? b : '#2a2a30');
        line.addColorStop(1, lit ? c : '#2a2a30');
        lg.fillStyle = line;
        lg.fillRect(0, 0, lw, 4);
        if (lit) {
            lg.globalAlpha = 0.55;
            lg.fillStyle = '#fff';
            lg.fillRect(0, 1, lw, 2);
            lg.globalAlpha = 1;
        }
        L.lineTex.needsUpdate = true;
    }

    setMood(mood: RoomMood) {
        this.mood = mood;
        this.paintLed();
        this.paint(this.level);
    }

    // ---------- floating shelf with books, a cactus, a cassette and an instant camera
    addShelf() {
        const P = this.personal;
        const cx = 3000;
        const y = 1500;
        const z = BACK_Z + 200;
        const plank = this.box(2600, 90, 400, 0xc8955f, P.texture('textures/personal/walnut.webp'));
        plank.position.set(cx, y, z);
        this.group.add(plank);
        const top = y + 45;

        // books, upright, one leaning
        const books: [number, number, number][] = [
            [120, 600, 0xb9a6ff],
            [90, 540, 0x8fd3c1],
            [140, 640, 0xffb4a2],
            [100, 560, 0x3d3a6b],
            [120, 520, 0xff8fb8],
        ];
        let x = cx - 1180;
        books.forEach(([w, h, c], i) => {
            const b = this.box(w, h, 300, c);
            b.position.set(x + w / 2, top + h / 2, z);
            if (i === books.length - 1) {
                b.rotation.z = -0.32;
                b.position.x += 110;
                b.position.y -= 28;
            }
            this.group.add(b);
            x += w + 8;
        });

        // a little cactus in a pink pot
        const potMat = P.basic({ color: P.shade(0xf7a8c4, 0.95) });
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(120, 95, 220, 20), potMat);
        pot.position.set(cx - 250, top + 110, z);
        this.group.add(pot);
        const green = P.basic({ color: P.shade(0x76c48a, 0.95) });
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(70, 75, 360, 16), green);
        stem.position.set(pot.position.x, top + 220 + 180, z);
        this.group.add(stem);
        const cap = new THREE.Mesh(new THREE.SphereGeometry(70, 16, 10), green);
        cap.position.set(stem.position.x, stem.position.y + 180, z);
        this.group.add(cap);
        for (const s of [-1, 1]) {
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(40, 40, 160, 12), green);
            arm.position.set(stem.position.x + s * 105, stem.position.y + (s > 0 ? 40 : -20), z);
            this.group.add(arm);
            const armCap = new THREE.Mesh(new THREE.SphereGeometry(40, 12, 8), green);
            armCap.position.set(arm.position.x, arm.position.y + 80, z);
            this.group.add(armCap);
            const elbow = new THREE.Mesh(new THREE.CylinderGeometry(36, 36, 70, 10), green);
            elbow.rotation.z = Math.PI / 2;
            elbow.position.set(stem.position.x + s * 70, arm.position.y - 70, z);
            this.group.add(elbow);
        }

        // a cassette leaning on the wall
        const tape = this.box(420, 270, 60, 0xf4f0fa);
        tape.position.set(cx + 250, top + 135, BACK_Z + 80);
        tape.rotation.x = -0.12;
        this.group.add(tape);
        const label = this.box(330, 120, 64, 0xff9ec6);
        label.position.set(tape.position.x, tape.position.y + 40, tape.position.z + 2);
        label.rotation.x = -0.12;
        this.group.add(label);
        for (const s of [-1, 1]) {
            const reel = new THREE.Mesh(new THREE.CylinderGeometry(38, 38, 70, 14), P.basic({ color: P.shade(0x2a2840, 1) }));
            reel.rotation.x = Math.PI / 2 - 0.12;
            reel.position.set(tape.position.x + s * 85, tape.position.y - 40, tape.position.z + 4);
            this.group.add(reel);
        }

        // an instant camera
        const cam = this.box(420, 300, 260, 0xbfe6ff);
        cam.position.set(cx + 820, top + 150, z);
        this.group.add(cam);
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(95, 95, 60, 24), P.basic({ color: P.shade(0x2a2840, 1) }));
        lens.rotation.x = Math.PI / 2;
        lens.position.set(cam.position.x, cam.position.y - 20, z + 150);
        this.group.add(lens);
        const glass = new THREE.Mesh(new THREE.CylinderGeometry(60, 60, 64, 24), P.basic({ color: P.shade(0x6f7fbf, 1) }));
        glass.rotation.x = Math.PI / 2;
        glass.position.set(cam.position.x, cam.position.y - 20, z + 154);
        this.group.add(glass);
        const flash = this.box(110, 60, 20, 0xffffff);
        flash.position.set(cam.position.x + 120, cam.position.y + 100, z + 132);
        this.group.add(flash);
    }

    // ---------- fairy lights with polaroids, above the monitor
    addFairyLights() {
        const P = this.personal;
        const z = BACK_Z + 30;
        const xA = -1750;
        const xB = 1750;
        const yTop = 2420;
        const sag = 300;
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 40; i++) {
            const t = i / 40;
            pts.push(new THREE.Vector3(xA + (xB - xA) * t, yTop - sag * 4 * t * (1 - t), z));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const wire = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 7, 6, false), P.basic({ color: P.shade(0x3b3550, 1) }));
        this.group.add(wire);
        const glowMap = P.glowTexture();
        const warm = ['#ffd27a', '#ffb3d9', '#fff0b8', '#c7b8ff'];
        for (let i = 1; i < 14; i++) {
            const p = curve.getPoint(i / 14);
            const bulb = new THREE.Mesh(new THREE.SphereGeometry(18, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(warm[i % warm.length]) }));
            bulb.position.copy(p).add(new THREE.Vector3(0, -22, 8));
            this.group.add(bulb);
            const m = new THREE.MeshBasicMaterial({
                map: glowMap,
                color: new THREE.Color(warm[i % warm.length]),
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            const g = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), m);
            g.position.copy(bulb.position).add(new THREE.Vector3(0, 0, 4));
            this.group.add(g);
            this.bulbs.push(m);
        }
        // four polaroids clipped on, slightly tilted
        const spots = [0.2, 0.4, 0.6, 0.8];
        spots.forEach((t, i) => {
            const p = curve.getPoint(t);
            const pw = 330;
            const ph = 396;
            const pol = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), P.basic({ map: this.tex(`polaroid-${i + 1}.webp`) }));
            pol.position.set(p.x, p.y - ph / 2 - 30, z + 12 + i);
            pol.rotation.z = [0.08, -0.05, 0.06, -0.09][i];
            this.group.add(pol);
            const peg = this.box(26, 70, 20, 0xe9c79a);
            peg.position.set(p.x, p.y - 20, z + 30 + i);
            this.group.add(peg);
        });
    }

    // ---------- posters on the side walls
    addPosters() {
        const P = this.personal;
        const city = new THREE.Mesh(new THREE.PlaneGeometry(1500, 2100), P.basic({ map: this.tex('poster-city.webp') }));
        city.rotation.y = Math.PI / 2;
        city.position.set(X0 + 8, 1500, 900);
        this.group.add(city);
        const sleep = new THREE.Mesh(new THREE.PlaneGeometry(1300, 1820), P.basic({ map: this.tex('poster-sleep.webp') }));
        sleep.rotation.y = -Math.PI / 2;
        sleep.position.set(X1 - 8, 1600, 400);
        this.group.add(sleep);
    }

    // ---------- time of day and moods
    /** k: 0 in the day, ~0.55 at sunset, 1 at night (the lamp's level). */
    paint(k: number) {
        this.level = k;
        const on = this.mood !== 'off';
        const L = this.led;
        if (L) {
            L.glow.opacity = on ? 0.25 + 0.5 * k : 0;
            L.floor.opacity = on ? 0.1 + 0.3 * k : 0;
        }
        this.bulbs.forEach((b) => (b.opacity = 0.25 + 0.75 * k));
        if (this.moonGlow) this.moonGlow.opacity = 0.22 * k;
    }

    setTime(time: 'day' | 'sunset' | 'night') {
        if (this.windowMat) {
            this.windowMat.map = this.windowTex[time];
            this.windowMat.needsUpdate = true;
        }
    }
}
