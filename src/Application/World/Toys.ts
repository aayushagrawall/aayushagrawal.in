import * as THREE from 'three';
import Application from '../Application';
import BakedRoom from './BakedRoom';
import { ROOM2 } from './roomData';

/**
 * Things to play with in the room (ROOM_TOYS in config.ts):
 *  - the football: click it to kick it. It rolls, bounces off the walls and the furniture,
 *    and five kicks unlock "Footballer"
 *  - the bed: click it to go to sleep. Lights out, the CRT's screensaver comes on and a few
 *    Zzz float up ("Lights Out"). Any click wakes you up
 *  - the STAY UP neon: click it and it flickers off and on, with a buzz
 *  - the cat on the bed: point at it and it wakes up and watches the cursor; click to pet it
 *    (it purrs: "Cat Person")
 *  - the phone on the desk: lights up now and then with a notification; click it to open
 *    the link (GitHub, LinkedIn, Instagram)
 *  - the earbuds case: click it to flip the lid open
 * Sounds are synthesised with Web Audio (no extra files) and go through the scene's audio
 * listener, so the mute switch covers them.
 */

const FLOOR = -2985;
const X0 = -6000;
const X1 = 6200;
const BACK = -2600;
const FRONT = 7600;
const R = ROOM2.ball.r;
const GRAVITY = 30000; // scene units are about 3 per mm
const UP = new THREE.Vector3(0, 1, 0);

// what the ball bounces off: boxes [x0, x1, z0, z1] and circles [x, z, r] on the floor plan
const BOXES: number[][] = [
    [X0, -3250, 2200, 7500], // bed
    [-3645, -3555, -1265, 1665], // desk legs and side bars
    [2555, 2645, -1265, 1665],
    [3880, 5800, BACK, -1780], // shoe boxes
];
const CIRCLES: number[][] = [
    [-2700, -1900, 380], // plant
    [2700, 5600, 1000], // bean bag
    [820, 2550, 720], // chair
    [5680, 3200, 60], // clothes rack
    [5680, 5900, 60],
];

type Notif = { app: string; text: string; color: string; url?: string };
const NOTIFS: Notif[] = [
    { app: 'GitHub', text: 'New commits on aayushagrawal.in. Take a look', color: '#24292f', url: 'https://github.com/aayushagrawall' },
    { app: 'Mom', text: 'Did you eat?', color: '#3cbf4a' },
    { app: 'LinkedIn', text: "Aayush Agrawal: let's connect", color: '#0a66c2', url: 'https://www.linkedin.com/in/aayush-agrawall/' },
    { app: 'Calendar', text: '8:00 AM · Lab at BMSCE. Set an alarm', color: '#e5393b' },
    { app: 'Instagram', text: 'Follow @_aayush.agrawal', color: '#c13584', url: 'https://instagram.com/_aayush.agrawal' },
    { app: 'White', text: 'Energy low. Time to refuel ⚡', color: '#8a8a8a' },
];
const SOCIALS = NOTIFS.filter((n) => n.url);

const v3 = (a: readonly number[]) => new THREE.Vector3(a[0], a[1], a[2]);

class Sfx {
    ctx?: AudioContext;
    out?: AudioNode;
    noise?: AudioBuffer;

    constructor(app: Application) {
        const world = (app as any).world;
        const listener: THREE.AudioListener | undefined = world && world.audioManager && world.audioManager.listener;
        if (!listener) return;
        this.ctx = listener.context as AudioContext;
        this.out = listener.getInput();
    }

    ready() {
        if (!this.ctx || !this.out) return false;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        if (!this.noise) {
            const b = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
            const d = b.getChannelData(0);
            for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
            this.noise = b;
        }
        return true;
    }

    env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    }

    noiseSrc(t: number, dur: number) {
        const s = this.ctx!.createBufferSource();
        s.buffer = this.noise!;
        s.loop = true;
        s.start(t, Math.random() * 0.5);
        s.stop(t + dur);
        return s;
    }

    /** A football thud, louder for harder hits. */
    thud(vol: number) {
        if (!this.ready() || vol < 0.03) return;
        const c = this.ctx!, t = c.currentTime;
        const o = c.createOscillator();
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(55, t + 0.12);
        const g = c.createGain();
        this.env(g, t, 0.9 * vol, 0.004, 0.2);
        o.connect(g).connect(this.out!);
        o.start(t);
        o.stop(t + 0.25);
        const n = this.noiseSrc(t, 0.08);
        const f = c.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.value = 500;
        const gn = c.createGain();
        this.env(gn, t, 0.35 * vol, 0.002, 0.05);
        n.connect(f).connect(gn).connect(this.out!);
    }

    /** A small plastic click (the earbuds case, the bed lamp). */
    click(vol = 0.5, freq = 3000) {
        if (!this.ready()) return;
        const c = this.ctx!, t = c.currentTime;
        const n = this.noiseSrc(t, 0.04);
        const f = c.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.value = freq;
        f.Q.value = 3;
        const g = c.createGain();
        this.env(g, t, vol, 0.001, 0.025);
        n.connect(f).connect(g).connect(this.out!);
    }

    /** The phone buzzing on the desk: two pulses. */
    vibrate() {
        if (!this.ready()) return;
        const c = this.ctx!, t = c.currentTime;
        for (const at of [0, 0.42]) {
            const o = c.createOscillator();
            o.type = 'square';
            o.frequency.value = 160;
            const f = c.createBiquadFilter();
            f.type = 'lowpass';
            f.frequency.value = 380;
            const g = c.createGain();
            g.gain.setValueAtTime(0.0001, t + at);
            g.gain.exponentialRampToValueAtTime(0.16, t + at + 0.02);
            g.gain.setValueAtTime(0.16, t + at + 0.24);
            g.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.28);
            o.connect(f).connect(g).connect(this.out!);
            o.start(t + at);
            o.stop(t + at + 0.3);
        }
    }

    /** A neon tube's hum, following a flicker pattern ([ms, level] steps). */
    buzz(steps: number[][]) {
        if (!this.ready()) return;
        const c = this.ctx!, t = c.currentTime;
        const f = c.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.value = 900;
        f.Q.value = 1.2;
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);
        for (const [ms, v] of steps) g.gain.setTargetAtTime(v > 0 ? 0.05 + 0.03 * v : 0.0001, t + ms / 1000, 0.006);
        const end = steps[steps.length - 1][0] / 1000 + 0.5;
        g.gain.setTargetAtTime(0.0001, t + end - 0.3, 0.08);
        for (const hz of [100, 200]) {
            const o = c.createOscillator();
            o.type = 'sawtooth';
            o.frequency.value = hz;
            o.connect(f);
            o.start(t);
            o.stop(t + end);
        }
        f.connect(g).connect(this.out!);
        // crackles when it switches on
        for (const [ms, v] of steps) {
            if (v <= 0) continue;
            const n = this.noiseSrc(t + ms / 1000, 0.03);
            const hp = c.createBiquadFilter();
            hp.type = 'highpass';
            hp.frequency.value = 2500;
            const gn = c.createGain();
            this.env(gn, t + ms / 1000, 0.12, 0.001, 0.02);
            n.connect(hp).connect(gn).connect(this.out!);
        }
    }

    /** A cat's purr: low noise, pulsing about 25 times a second. */
    purr() {
        if (!this.ready()) return;
        const c = this.ctx!, t = c.currentTime, dur = 2.2;
        const n = this.noiseSrc(t, dur);
        const lp = c.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 260;
        const am = c.createGain();
        am.gain.value = 0.5;
        const lfo = c.createOscillator();
        lfo.frequency.value = 24;
        const depth = c.createGain();
        depth.gain.value = 0.5;
        lfo.connect(depth).connect(am.gain);
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.9, t + 0.25);
        g.gain.setValueAtTime(0.9, t + dur - 0.5);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        n.connect(lp).connect(am).connect(g).connect(this.out!);
        lfo.start(t);
        lfo.stop(t + dur);
    }
}

type Target = { meshes: THREE.Object3D[]; click: (hit: THREE.Intersection, ray: THREE.Ray) => void; hover?: () => void };

export default class Toys {
    application: Application;
    scene: THREE.Scene;
    room: BakedRoom;
    sfx: Sfx;
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2(-9, -9);
    targets: Target[] = [];
    lastTick = 0;

    constructor(room: BakedRoom) {
        this.application = new Application();
        this.scene = this.application.scene;
        this.room = room;
        this.sfx = new Sfx(this.application);
        this.addBall();
        this.addCat();
        this.addPhone();
        this.addCase();
        this.addNeon();
        this.addBed();
        this.wirePointer();
    }

    // ------------------------------------------------------------ helpers
    get camera(): THREE.PerspectiveCamera | undefined {
        const c = (this.application as any).camera;
        return c && c.instance;
    }

    achieve(id: string) {
        this.toScreen({ type: 'aos-achieve', id });
    }

    toScreen(msg: any) {
        const screen = document.querySelector('iframe[src="os/"]') as HTMLIFrameElement | null;
        if (screen && screen.contentWindow) screen.contentWindow.postMessage(msg, '*');
    }

    count(path: string, title: string) {
        try {
            const gc = (window as any).goatcounter;
            if (gc && gc.count) gc.count({ path, title, event: true });
        } catch (e) {}
    }

    softTexture(inner: string, outer: string) {
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const g = c.getContext('2d')!;
        const grd = g.createRadialGradient(64, 64, 2, 64, 64, 62);
        grd.addColorStop(0, inner);
        grd.addColorStop(1, outer);
        g.fillStyle = grd;
        g.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
    }

    // ------------------------------------------------------------ pointer
    wirePointer() {
        const pick = (): { t: Target; hit: THREE.Intersection } | null => {
            const cam = this.camera;
            if (!cam || this.pointer.x < -2) return null;
            this.raycaster.setFromCamera(this.pointer, cam);
            // the first target (in order of priority) under the pointer: small things before the bed
            for (const t of this.targets) {
                const hits = this.raycaster.intersectObjects(t.meshes, false);
                if (hits.length) return { t, hit: hits[0] };
            }
            return null;
        };
        const setPointer = (e: MouseEvent) => this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        let down = { x: 0, y: 0 };
        let armed: { t: Target; hit: THREE.Intersection } | null = null;
        window.addEventListener(
            'mousedown',
            (e) => {
                // @ts-ignore events relayed from inside the monitor
                if (e.inComputer) return;
                down = { x: e.clientX, y: e.clientY };
                setPointer(e);
                if (this.sleeping) {
                    // any click wakes you up (and doesn't move the camera)
                    if (performance.now() - this.sleptAt > 500) this.wake();
                    // @ts-ignore read by Camera
                    e.aosClickable = true;
                    armed = null;
                    return;
                }
                armed = pick();
                // @ts-ignore read by Camera: keep the camera put
                if (armed) e.aosClickable = true;
            },
            true
        );
        window.addEventListener('mouseup', (e) => {
            // @ts-ignore
            if (e.inComputer || !armed) return;
            const a = armed;
            armed = null;
            if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
            a.t.click(a.hit, this.raycaster.ray.clone());
        });
        let over = false;
        let lastMove = 0;
        window.addEventListener('mousemove', (e) => {
            // @ts-ignore
            if (e.inComputer) return;
            setPointer(e);
            const now = performance.now();
            if (now - lastMove < 40) return;
            lastMove = now;
            const p = pick();
            if (p && p.t.hover) p.t.hover();
            if (!!p !== over) {
                over = !!p;
                document.body.style.cursor = over ? 'pointer' : '';
            }
        });
        document.addEventListener('mouseleave', () => this.pointer.set(-9, -9));
    }

    // ------------------------------------------------------------ football
    ball?: { mesh: THREE.Mesh; pos: THREE.Vector3; vel: THREE.Vector3; q: THREE.Quaternion; shadow: THREE.Mesh; moving: boolean };

    addBall() {
        const mesh = this.room.props['football'];
        if (!mesh) return;
        const shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(R * 2.6, R * 2.6),
            new THREE.MeshBasicMaterial({ map: this.softTexture('rgba(0,0,0,0.55)', 'rgba(0,0,0,0)'), transparent: true, depthWrite: false })
        );
        shadow.rotation.x = -Math.PI / 2;
        this.scene.add(shadow);
        this.ball = { mesh, pos: mesh.position.clone(), vel: new THREE.Vector3(), q: new THREE.Quaternion(), shadow, moving: false };
        this.placeBall();
        this.targets.push({
            meshes: [mesh],
            click: (hit, ray) => this.kick(hit, ray),
        });
    }

    kick(hit: THREE.Intersection, ray: THREE.Ray) {
        const b = this.ball!;
        // away from the camera, and away from where the ball was hit
        const dir = new THREE.Vector3(ray.direction.x, 0, ray.direction.z).normalize();
        const off = b.pos.clone().sub(hit.point).setY(0);
        if (off.lengthSq() > 1) dir.addScaledVector(off.normalize(), 0.6).normalize();
        const speed = 5200 + Math.random() * 2200;
        b.vel.set(dir.x * speed, 3200 + Math.random() * 1800, dir.z * speed);
        b.moving = true;
        this.sfx.thud(0.85);
        let kicks = 0;
        try {
            kicks = parseInt(localStorage.getItem('aayushos-kicks') || '0', 10) + 1;
            localStorage.setItem('aayushos-kicks', String(kicks));
        } catch (e) {
            kicks = 5;
        }
        if (kicks >= 5) this.achieve('footballer');
        this.count('3d/football', 'Football kick (3D)');
    }

    placeBall() {
        const b = this.ball!;
        b.mesh.position.copy(b.pos);
        const lift = b.pos.y - (FLOOR + R);
        b.shadow.position.set(b.pos.x, FLOOR + 3, b.pos.z);
        const k = Math.max(0.25, 1 - lift / 2500);
        b.shadow.scale.setScalar(1 + (1 - k) * 0.6);
        (b.shadow.material as THREE.MeshBasicMaterial).opacity = k;
        this.room.ballRot.value.setFromMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(b.q.clone().invert()));
    }

    stepBall(dt: number) {
        const b = this.ball;
        if (!b || !b.moving) return;
        const steps = Math.ceil(dt / (1 / 240));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
            b.vel.y -= GRAVITY * h;
            b.pos.addScaledVector(b.vel, h);
            const ground = FLOOR + R;
            if (b.pos.y <= ground) {
                b.pos.y = ground;
                if (b.vel.y < -900) {
                    this.sfx.thud(Math.min(0.8, -b.vel.y / 9000));
                    b.vel.y = -b.vel.y * 0.45;
                } else b.vel.y = 0;
            }
            const onGround = b.pos.y <= ground + 1;
            // rolling resistance
            const hs = Math.hypot(b.vel.x, b.vel.z);
            if (onGround && hs > 0) {
                const ns = Math.max(0, hs - 1300 * h - hs * 0.35 * h);
                b.vel.x *= ns / hs;
                b.vel.z *= ns / hs;
            }
            this.collide(b.pos, b.vel);
            // roll: turn about the horizontal axis at right angles to the motion
            const d = Math.hypot(b.vel.x, b.vel.z) * h;
            if (d > 0) {
                const axis = new THREE.Vector3(b.vel.z, 0, -b.vel.x).normalize();
                b.q.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, d / R));
            }
            if (onGround && Math.hypot(b.vel.x, b.vel.z) < 25 && Math.abs(b.vel.y) < 1) {
                b.vel.set(0, 0, 0);
                b.moving = false;
                break;
            }
        }
        this.placeBall();
    }

    bounce(vel: THREE.Vector3, nx: number, nz: number) {
        const vn = vel.x * nx + vel.z * nz;
        if (vn >= 0) return; // already moving away
        vel.x -= 1.6 * vn * nx;
        vel.z -= 1.6 * vn * nz;
        this.sfx.thud(Math.min(0.7, -vn / 9000));
    }

    collide(p: THREE.Vector3, v: THREE.Vector3) {
        if (p.x < X0 + R) { p.x = X0 + R; this.bounce(v, 1, 0); }
        if (p.x > X1 - R) { p.x = X1 - R; this.bounce(v, -1, 0); }
        if (p.z < BACK + R) { p.z = BACK + R; this.bounce(v, 0, 1); }
        if (p.z > FRONT - R) { p.z = FRONT - R; this.bounce(v, 0, -1); }
        for (const [x0, x1, z0, z1] of BOXES) {
            const cx = Math.min(Math.max(p.x, x0), x1);
            const cz = Math.min(Math.max(p.z, z0), z1);
            let dx = p.x - cx, dz = p.z - cz;
            const d = Math.hypot(dx, dz);
            if (d >= R) continue;
            if (d < 1e-3) {
                // centre inside the box: push out the nearest side
                const opts = [[p.x - x0, -1, 0], [x1 - p.x, 1, 0], [p.z - z0, 0, -1], [z1 - p.z, 0, 1]].sort((a, b) => a[0] - b[0]);
                dx = opts[0][1];
                dz = opts[0][2];
                p.x = dx ? (dx < 0 ? x0 - R : x1 + R) : p.x;
                p.z = dz ? (dz < 0 ? z0 - R : z1 + R) : p.z;
                this.bounce(v, dx, dz);
                continue;
            }
            p.x = cx + (dx / d) * R;
            p.z = cz + (dz / d) * R;
            this.bounce(v, dx / d, dz / d);
        }
        for (const [x, z, r] of CIRCLES) {
            const dx = p.x - x, dz = p.z - z;
            const d = Math.hypot(dx, dz);
            if (d >= r + R || d < 1e-3) continue;
            p.x = x + (dx / d) * (r + R);
            p.z = z + (dz / d) * (r + R);
            this.bounce(v, dx / d, dz / d);
        }
    }

    // ------------------------------------------------------------ the cat
    cat?: {
        head: THREE.Mesh;
        body: THREE.Mesh;
        pivot: THREE.Vector3;
        forward: THREE.Vector3;
        side: THREE.Vector3;
        eyes: THREE.Group;
        eyeMeshes: THREE.Mesh[];
        awake: boolean;
        seen: number;
        yaw: number;
        pitch: number;
        open: number;
        zzzAt: number;
        headPos: THREE.Vector3;
        bodyScale: THREE.Vector3;
        bodyBottom: number;
        bodyMinY: number;
    };

    addCat() {
        const head = this.room.props['cat_head'];
        const body = this.room.props['cat_body'];
        if (!head || !body) return;
        const m = ROOM2.props.cat;
        const pivot = v3(m.pivot);
        const forward = v3(m.forward).setY(0).normalize();
        const side = new THREE.Vector3().crossVectors(forward, UP).normalize();
        // open eyes: discs on the face, hidden (squashed) while it sleeps
        const eyes = new THREE.Group();
        eyes.position.copy(pivot);
        this.scene.add(eyes);
        const tex = this.eyeTexture();
        const center = pivot.clone().addScaledVector(forward, 170).addScaledVector(UP, 40);
        const eyeMeshes = m.eyes.map((e: readonly number[]) => {
            const at = v3(e);
            const n = at.clone().sub(center).normalize();
            const mesh = new THREE.Mesh(new THREE.CircleGeometry(40, 24), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
            mesh.position.copy(at).addScaledVector(n, 26).sub(pivot);
            mesh.lookAt(at.clone().addScaledVector(n, 1000));
            mesh.scale.set(1, 0.001, 1);
            eyes.add(mesh);
            return mesh;
        });
        // the meshes are stored compressed: each node has its own offset and scale, so keep them
        body.geometry.computeBoundingBox();
        this.cat = {
            head, body, pivot, forward, side, eyes, eyeMeshes, awake: false, seen: 0, yaw: 0, pitch: 0, open: 0, zzzAt: 0,
            headPos: head.position.clone(),
            bodyScale: body.scale.clone(),
            bodyBottom: body.position.y + body.geometry.boundingBox!.min.y * body.scale.y,
            bodyMinY: body.geometry.boundingBox!.min.y,
        };
        const wake = () => {
            const c = this.cat!;
            if (!c.awake) this.count('3d/cat', 'Cat woke up (3D)');
            c.awake = true;
            c.seen = performance.now();
        };
        this.targets.push({
            meshes: [head, body],
            hover: wake,
            click: () => {
                wake();
                this.sfx.purr();
                this.achieve('catperson');
                this.count('3d/cat-pet', 'Pet the cat (3D)');
            },
        });
    }

    eyeTexture() {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d')!;
        const grd = g.createRadialGradient(32, 32, 4, 32, 32, 31);
        grd.addColorStop(0, '#e9ef6a');
        grd.addColorStop(0.75, '#a9c02e');
        grd.addColorStop(1, '#55601a');
        g.fillStyle = grd;
        g.beginPath();
        g.arc(32, 32, 31, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = '#0b0b0b';
        g.beginPath();
        g.ellipse(32, 32, 7, 25, 0, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = 'rgba(255,255,255,0.85)';
        g.beginPath();
        g.arc(40, 22, 5, 0, Math.PI * 2);
        g.fill();
        const t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
    }

    stepCat(dt: number, now: number) {
        const c = this.cat;
        const cam = this.camera;
        if (!c || !cam) return;
        if (c.awake && now - c.seen > 8000) c.awake = false;
        let ty = 0, tp = 0;
        if (c.awake && this.pointer.x > -2) {
            // look at the point under the cursor, as far away as the camera is
            this.raycaster.setFromCamera(this.pointer, cam);
            const d = cam.position.distanceTo(c.pivot);
            const v = this.raycaster.ray.at(d, new THREE.Vector3()).sub(c.pivot);
            const h = Math.hypot(v.x, v.z);
            const left = new THREE.Vector3().crossVectors(UP, c.forward);
            ty = Math.atan2(v.x * left.x + v.z * left.z, v.x * c.forward.x + v.z * c.forward.z);
            tp = Math.atan2(v.y, h);
            ty = Math.max(-0.85, Math.min(0.85, ty));
            tp = Math.max(-0.25, Math.min(0.45, tp));
        } else if (c.awake) {
            ty = 0.3;
            tp = 0.15;
        }
        const k = Math.min(1, dt * (c.awake ? 7 : 2));
        c.yaw += (ty - c.yaw) * k;
        c.pitch += (tp - c.pitch) * k;
        const q = new THREE.Quaternion().setFromAxisAngle(UP, c.yaw).multiply(new THREE.Quaternion().setFromAxisAngle(c.side, c.pitch));
        // turn about the neck
        c.head.quaternion.copy(q);
        c.head.position.copy(c.headPos).sub(c.pivot).applyQuaternion(q).add(c.pivot);
        c.eyes.quaternion.copy(q);
        // eyes open fast, close slowly; a blink now and then
        const blink = c.awake && now % 4300 < 140 ? 0 : 1;
        c.open += ((c.awake ? 1 : 0) * blink - c.open) * Math.min(1, dt * (c.awake ? 12 : 3));
        c.eyeMeshes.forEach((m) => m.scale.set(1, Math.max(0.001, c.open * 0.8), 1));
        // breathing
        const t = now / 1000;
        const sy = c.bodyScale.y * (1 + (c.awake ? 0.008 : 0.018) * Math.sin(t * (c.awake ? 3 : 2)));
        c.body.scale.y = sy;
        c.body.position.y = c.bodyBottom - c.bodyMinY * sy; // keep it lying on the bed
        // a small z now and then while it sleeps
        if (!c.awake && now > c.zzzAt) {
            c.zzzAt = now + 3800 + Math.random() * 1500;
            this.spawnZ(v3(ROOM2.props.cat.zzz), 110, 2600);
        }
    }

    // ------------------------------------------------------------ Zzz
    zs: { s: THREE.Sprite; t0: number; life: number; from: THREE.Vector3; drift: number }[] = [];
    zTex?: THREE.Texture;

    spawnZ(at: THREE.Vector3, size: number, life: number) {
        if (!this.zTex) {
            const c = document.createElement('canvas');
            c.width = c.height = 64;
            const g = c.getContext('2d')!;
            g.font = 'bold 54px Georgia, serif';
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.lineWidth = 6;
            g.strokeStyle = 'rgba(10,10,20,0.6)';
            g.strokeText('z', 32, 30);
            g.fillStyle = '#f2f2ff';
            g.fillText('z', 32, 30);
            this.zTex = new THREE.CanvasTexture(c);
        }
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.zTex, transparent: true, depthWrite: false, opacity: 0 }));
        s.scale.setScalar(size);
        s.position.copy(at);
        this.scene.add(s);
        this.zs.push({ s, t0: performance.now(), life, from: at.clone(), drift: (Math.random() - 0.5) * 2 });
    }

    stepZ(now: number) {
        this.zs = this.zs.filter((z) => {
            const k = (now - z.t0) / z.life;
            if (k >= 1) {
                this.scene.remove(z.s);
                z.s.material.dispose();
                return false;
            }
            const size = z.s.scale.x;
            z.s.position.set(z.from.x + Math.sin(k * 5 + z.drift) * size * 0.6, z.from.y + k * size * 5, z.from.z + z.drift * size * k);
            z.s.material.opacity = Math.min(1, k * 5) * (1 - k);
            return true;
        });
    }

    // ------------------------------------------------------------ the phone
    phone?: {
        mesh: THREE.Mesh;
        screen: THREE.Mesh;
        canvas: HTMLCanvasElement;
        tex: THREE.CanvasTexture;
        base: THREE.Vector3;
        screenBase: THREE.Vector3;
        spill: THREE.MeshBasicMaterial;
        lit: number;
        litUntil: number;
        nextAt: number;
        buzzUntil: number;
        current?: Notif;
        i: number;
        social: number;
        drawn: string;
    };

    addPhone() {
        const mesh = this.room.props['phone'];
        const screen = this.room.glowMeshes['phone_screen'];
        if (!mesh || !screen) return;
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 560;
        const tex = new THREE.CanvasTexture(canvas);
        tex.encoding = THREE.sRGBEncoding;
        tex.anisotropy = 8;
        tex.flipY = false; // the screen's UVs are glTF's (top-left origin)
        screen.material = new THREE.MeshBasicMaterial({ map: tex });
        const spill = new THREE.MeshBasicMaterial({ map: this.softTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), color: 0xbfd2ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
        const glow = new THREE.Mesh(new THREE.PlaneGeometry(1100, 1300), spill);
        glow.rotation.x = -Math.PI / 2;
        const at = v3(ROOM2.props.phone.center);
        glow.position.set(at.x, at.y - 28, at.z);
        this.scene.add(glow);
        this.phone = { mesh, screen, canvas, tex, base: mesh.position.clone(), screenBase: screen.position.clone(), spill, lit: 0, litUntil: 0, nextAt: performance.now() + 9000, buzzUntil: 0, i: 0, social: 0, drawn: '' };
        this.drawPhone();
        this.targets.push({
            meshes: [mesh, screen],
            click: () => {
                const p = this.phone!;
                // open what's on the screen, or the next social link (and show it)
                let n = p.current && p.lit > 0.2 ? p.current : undefined;
                if (!n || !n.url) {
                    n = SOCIALS[p.social++ % SOCIALS.length];
                    this.notify(n, false);
                }
                if (n.url) window.open(n.url, '_blank', 'noopener');
                this.count('3d/phone', 'Phone: ' + n.app);
            },
        });
    }

    notify(n: Notif, buzz = true) {
        const p = this.phone!;
        p.current = n;
        p.litUntil = performance.now() + 7000;
        if (buzz) {
            p.buzzUntil = performance.now() + 700;
            this.sfx.vibrate();
        }
        p.drawn = '';
    }

    drawPhone() {
        const p = this.phone!;
        const on = p.lit > 0.01;
        const key = on ? (p.current ? p.current.app : '') + Math.round(p.lit * 20) + this.clock() : 'off';
        if (key === p.drawn) return;
        p.drawn = key;
        const g = p.canvas.getContext('2d')!;
        const W = p.canvas.width, H = p.canvas.height;
        g.globalAlpha = 1;
        g.fillStyle = '#050507';
        g.fillRect(0, 0, W, H);
        if (!on) {
            // a faint reflection on the dark glass
            const r = g.createLinearGradient(0, 0, W, H);
            r.addColorStop(0, 'rgba(255,255,255,0.06)');
            r.addColorStop(0.5, 'rgba(255,255,255,0)');
            g.fillStyle = r;
            g.fillRect(0, 0, W, H);
        } else {
            g.globalAlpha = p.lit;
            const bg = g.createLinearGradient(0, 0, 0, H);
            bg.addColorStop(0, '#1d2340');
            bg.addColorStop(1, '#3a1d2c');
            g.fillStyle = bg;
            g.fillRect(0, 0, W, H);
            g.fillStyle = '#ffffff';
            g.textAlign = 'center';
            g.font = '600 64px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
            g.fillText(this.clock(), W / 2, 130);
            g.font = '20px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
            g.fillStyle = 'rgba(255,255,255,0.8)';
            g.fillText(new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long' }), W / 2, 164);
            const n = p.current;
            if (n) {
                const x = 14, y = 210, w = W - 28, h = 112;
                g.fillStyle = 'rgba(255,255,255,0.9)';
                this.round(g, x, y, w, h, 18);
                g.fill();
                g.fillStyle = n.color;
                this.round(g, x + 12, y + 14, 26, 26, 7);
                g.fill();
                g.textAlign = 'left';
                g.fillStyle = '#555';
                g.font = '600 17px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
                g.fillText(n.app.toUpperCase(), x + 48, y + 33);
                g.fillText('now', x + w - 50, y + 33);
                g.fillStyle = '#111';
                g.font = '20px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
                this.wrap(g, n.text, x + 14, y + 66, w - 28, 24);
            }
            g.textAlign = 'center';
            g.fillStyle = 'rgba(255,255,255,0.7)';
            g.font = '16px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
            g.fillText(n && n.url ? 'tap to open' : '', W / 2, H - 40);
        }
        p.tex.needsUpdate = true;
    }

    clock() {
        return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    }

    round(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
        g.beginPath();
        g.moveTo(x + r, y);
        g.arcTo(x + w, y, x + w, y + h, r);
        g.arcTo(x + w, y + h, x, y + h, r);
        g.arcTo(x, y + h, x, y, r);
        g.arcTo(x, y, x + w, y, r);
        g.closePath();
    }

    wrap(g: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, lh: number) {
        let line = '';
        for (const word of text.split(' ')) {
            const test = line ? line + ' ' + word : word;
            if (g.measureText(test).width > w && line) {
                g.fillText(line, x, y);
                line = word;
                y += lh;
            } else line = test;
        }
        g.fillText(line, x, y);
    }

    stepPhone(dt: number, now: number) {
        const p = this.phone;
        if (!p) return;
        if (now > p.nextAt && !document.hidden && !this.sleeping) {
            p.nextAt = now + 28000 + Math.random() * 22000;
            this.notify(NOTIFS[p.i++ % NOTIFS.length]);
        }
        const target = now < p.litUntil && !this.sleeping ? 1 : 0;
        p.lit += (target - p.lit) * Math.min(1, dt * (target ? 10 : 3));
        if (p.lit < 0.005) p.lit = 0;
        // buzzing: the phone shivers on the desk
        const jx = now < p.buzzUntil ? (Math.random() - 0.5) * 5 : 0;
        const jz = now < p.buzzUntil ? (Math.random() - 0.5) * 5 : 0;
        p.mesh.position.set(p.base.x + jx, p.base.y, p.base.z + jz);
        p.screen.position.set(p.screenBase.x + jx, p.screenBase.y, p.screenBase.z + jz);
        const night = 1 - this.room.mix;
        p.spill.opacity = p.lit * (0.12 + 0.3 * night);
        this.drawPhone();
    }

    // ------------------------------------------------------------ earbuds case
    lid?: { mesh: THREE.Mesh; axis: THREE.Vector3; hinge: THREE.Vector3; base: THREE.Vector3; angle: number; vel: number; target: number; closeAt: number };

    addCase() {
        const lid = this.room.props['case_lid'];
        const base = this.room.props['case_base'];
        if (!lid || !base) return;
        this.lid = { mesh: lid, axis: v3(ROOM2.props.case.axis).normalize(), hinge: v3(ROOM2.props.case.hinge), base: lid.position.clone(), angle: 0, vel: 0, target: 0, closeAt: 0 };
        this.targets.push({
            meshes: [lid, base, ...(this.room.props['case_buds'] ? [this.room.props['case_buds']] : [])],
            click: () => {
                const l = this.lid!;
                if (l.target === 0) {
                    l.target = -1.85;
                    l.closeAt = performance.now() + 4500;
                    this.sfx.click(0.5, 2200);
                } else {
                    l.target = 0;
                }
                this.count('3d/case', 'Earbuds case (3D)');
            },
        });
    }

    stepCase(dt: number, now: number) {
        const l = this.lid;
        if (!l) return;
        if (l.target !== 0 && now > l.closeAt) l.target = 0;
        const before = l.angle;
        // a stiff spring: snappy, a tiny bounce
        const w = 22;
        // small fixed steps, so a slow frame can't make it blow up
        const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
            l.vel += ((l.target - l.angle) * w * w - 2 * 0.75 * w * l.vel) * h;
            l.angle += l.vel * h;
            if (l.target === 0 && l.angle > 0) {
                l.angle = 0;
                l.vel = 0;
            }
        }
        if (l.target === 0 && l.angle === 0 && before < -0.05) this.sfx.click(0.6, 1600); // snap shut
        l.mesh.quaternion.setFromAxisAngle(l.axis, l.angle);
        l.mesh.position.copy(l.base).sub(l.hinge).applyQuaternion(l.mesh.quaternion).add(l.hinge);
    }

    // ------------------------------------------------------------ the neon sign
    neon?: { mesh: THREE.Mesh; t0: number; steps: number[][] };

    addNeon() {
        const mesh = this.room.glowMeshes['neon_sign'];
        if (!mesh) return;
        this.neon = { mesh, t0: -1, steps: [] };
        // the letters are thin tubes: click anywhere on the sign
        mesh.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(mesh);
        const size = bb.getSize(new THREE.Vector3());
        const hit = new THREE.Mesh(new THREE.BoxGeometry(size.x + 120, size.y + 120, Math.max(size.z, 10) + 120), new THREE.MeshBasicMaterial());
        bb.getCenter(hit.position);
        hit.visible = false;
        this.scene.add(hit);
        hit.updateMatrixWorld(true);
        this.targets.push({
            meshes: [hit],
            click: () => {
                const n = this.neon!;
                if (n.t0 > 0) return;
                n.steps = [[0, 0], [90, 1], [150, 0], [230, 0.7], [270, 0], [700, 0], [760, 1], [820, 0.3], [880, 0], [1150, 1]];
                n.t0 = performance.now();
                this.sfx.buzz(n.steps);
                this.count('3d/neon', 'Neon flicker (3D)');
            },
        });
    }

    stepNeon(now: number) {
        const n = this.neon;
        if (!n || n.t0 < 0) return;
        const t = now - n.t0;
        let v = 1;
        for (const [at, val] of n.steps) if (t >= at) v = val;
        this.room.neonMul = v;
        if (t > n.steps[n.steps.length - 1][0] + 50) {
            n.t0 = -1;
            this.room.neonMul = 1;
        }
    }

    // ------------------------------------------------------------ the bed: sleep mode
    sleeping = false;
    sleptAt = 0;
    zzzAt = 0;
    wakeAt = 0;

    addBed() {
        const box = new THREE.Mesh(new THREE.BoxGeometry(-3250 - X0 - 40, 1150, 7500 - 2200), new THREE.MeshBasicMaterial());
        box.position.set((X0 + 40 - 3250) / 2, FLOOR + 575, (2200 + 7500) / 2);
        box.visible = false;
        this.scene.add(box);
        box.updateMatrixWorld(true);
        this.targets.push({ meshes: [box], click: () => this.goToSleep() });
    }

    goToSleep() {
        this.sleeping = true;
        this.sleptAt = performance.now();
        this.wakeAt = this.sleptAt + 45000;
        this.zzzAt = this.sleptAt + 900;
        this.sfx.click(0.45, 1800);
        const personal = (this.application as any).world && (this.application as any).world.personal;
        if (personal && personal.setSleep) personal.setSleep(true);
        else this.room.setSleep(true);
        this.toScreen({ type: 'aos-saver', on: true });
        setTimeout(() => this.sleeping && this.achieve('goodnight'), 2500);
        this.count('3d/sleep', 'Sleep mode (3D)');
    }

    wake() {
        this.sleeping = false;
        this.sfx.click(0.45, 1800);
        const personal = (this.application as any).world && (this.application as any).world.personal;
        if (personal && personal.setSleep) personal.setSleep(false);
        else this.room.setSleep(false);
        this.toScreen({ type: 'aos-saver', on: false });
    }

    stepSleep(now: number) {
        if (!this.sleeping) return;
        const cam = (this.application as any).camera;
        // wake up by itself after a while, or when the camera goes to the desk
        if (now > this.wakeAt || (cam && cam.targetKeyframe && cam.targetKeyframe !== 'idle')) {
            this.wake();
            return;
        }
        if (now > this.zzzAt) {
            this.zzzAt = now + 1300;
            this.spawnZ(new THREE.Vector3(-4605 + (Math.random() - 0.5) * 300, FLOOR + 1350, 2750), 230, 3600);
        }
    }

    // ------------------------------------------------------------
    update() {
        const now = performance.now();
        const dt = this.lastTick ? Math.min(0.1, (now - this.lastTick) / 1000) : 0;
        this.lastTick = now;
        this.stepBall(dt);
        this.stepCat(dt, now);
        this.stepPhone(dt, now);
        this.stepCase(dt, now);
        this.stepNeon(now);
        this.stepSleep(now);
        this.stepZ(now);
    }
}
