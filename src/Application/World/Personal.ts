import * as THREE from 'three';
import Application from '../Application';
import { OPEN_TO_INTERNSHIPS, SHOW_NAMEPLATE, SHOW_RESUME_FRAME, LOFI_ROOM, NEW_ROOM } from '../config';
import Room from './Room';

/**
 * Aayush's personal touches on the desk:
 *  - a walnut nameplate with his name (off: SHOW_NAMEPLATE in config.ts)
 *  - a sticky note on the monitor bezel
 *  - a framed poster on the desk with a QR code to the web resume, click it too
 *    (off: SHOW_RESUME_FRAME in config.ts)
 *  - a cold can of White, his energy drink, in place of the coffee mug (click it: pssht)
 *  - an "Open to internships" neon sign that flickers on when you first come up to the desk
 *    (switch it off in src/Application/config.ts)
 *  - a warm sunset tint from 5 to 7 pm IST and a "Bangalore night" tint from 7 pm to 6 am
 *    (override with ?time=day / sunset / night, or the older ?night=1 / ?night=0)
 *
 * Objects are placed by ray-casting against the baked models so they sit exactly on
 * the desk and the bezel. Materials are unlit (like the baked scene) with lighting
 * painted into their textures, plus simple per-face shading so they blend in.
 */
export default class Personal {
    application: Application;
    scene: THREE.Scene;
    group: THREE.Group;
    loader: THREE.TextureLoader;
    tintables: THREE.MeshBasicMaterial[] = [];

    constructor(
        computer: THREE.Object3D,
        environment: THREE.Object3D,
        bakedMaterials: THREE.MeshBasicMaterial[],
        decor?: THREE.Object3D
    ) {
        this.application = new Application();
        this.scene = this.application.scene;
        this.loader = new THREE.TextureLoader();
        this.group = new THREE.Group();
        this.group.name = 'personal';
        this.scene.add(this.group);
        this.tintables.push(...bakedMaterials);

        // world matrices must be current before ray-casting
        computer.updateMatrixWorld(true);
        environment.updateMatrixWorld(true);

        if (SHOW_NAMEPLATE) this.addNameplate(environment);
        this.addStickyNote(computer);
        if (SHOW_RESUME_FRAME) this.addPoster(environment);
        this.addCan(environment, decor);
        if (OPEN_TO_INTERNSHIPS) this.addNeonSign(environment);
        this.addLamp(environment);
        if (LOFI_ROOM) {
            this.room = new Room(this);
            this.tintBackdrop(environment);
        }
        this.initTimeOfDay();
    }

    room?: Room;

    /** The studio backdrop outside the room goes dark grey (its own copy of the baked material). */
    tintBackdrop(environment: THREE.Object3D) {
        environment.traverse((o) => {
            const m = o as THREE.Mesh;
            if (m.isMesh && o.name === 'Background' && m.material instanceof THREE.MeshBasicMaterial) {
                const mat = (m.material as THREE.MeshBasicMaterial).clone();
                mat.color.setRGB(0.36, 0.36, 0.4);
                m.material = mat;
                this.tintables.push(mat);
            }
        });
    }

    texture(path: string) {
        const t = this.loader.load(path);
        t.encoding = THREE.sRGBEncoding;
        t.anisotropy = 8;
        return t;
    }

    shade(color: number, k: number) {
        const c = new THREE.Color(color);
        c.multiplyScalar(k);
        return c;
    }

    basic(opts: THREE.MeshBasicMaterialParameters) {
        const m = new THREE.MeshBasicMaterial(opts);
        this.tintables.push(m);
        return m;
    }

    /** Cast a ray and return the first hit on `target`, or null. */
    hit(target: THREE.Object3D, from: THREE.Vector3, dir: THREE.Vector3) {
        const rc = new THREE.Raycaster(from, dir.clone().normalize());
        const hits = rc.intersectObject(target, true);
        return hits.length ? hits[0] : null;
    }

    addNameplate(environment: THREE.Object3D) {
        const L = 760; // length (x)
        const D = 210; // depth of the base
        const BH = 36; // base height
        const PH = 210; // plate height (slanted)
        const lean = THREE.MathUtils.degToRad(28);

        // find the desk surface under the nameplate spot
        const spot = new THREE.Vector3(1580, 2000, 1310);
        const h = this.hit(environment, spot, new THREE.Vector3(0, -1, 0));
        const deskY = h ? h.point.y : -450;

        const plate = new THREE.Group();

        // walnut base: lit from the top-left like the baked scene
        const wood = this.texture('textures/personal/walnut.webp');
        wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
        const woodTop = this.basic({ map: wood, color: this.shade(0xffffff, 1.0) });
        const woodFront = this.basic({ map: wood, color: this.shade(0xffffff, 0.82) });
        const woodSide = this.basic({ map: wood, color: this.shade(0xffffff, 0.62) });
        const woodDark = this.basic({ map: wood, color: this.shade(0xffffff, 0.45) });
        const base = new THREE.Mesh(new THREE.BoxGeometry(L, BH, D), [
            woodSide, woodDark, woodTop, woodDark, woodFront, woodDark,
        ]);
        base.position.y = BH / 2;
        plate.add(base);

        // slanted acrylic plate with the name, resting on the base and leaning back
        const front = this.texture('textures/personal/nameplate.webp');
        const edge = this.basic({ color: 0x1a1a20 });
        const edgeLight = this.basic({ color: 0x2c2c34 });
        const face = this.basic({ map: front });
        const slab = new THREE.Mesh(new THREE.BoxGeometry(L - 40, PH, 14), [
            edge, edge, edgeLight, edge, face, edge,
        ]);
        slab.rotation.x = -lean;
        slab.position.set(0, BH + (PH / 2) * Math.cos(lean), -(PH / 2) * Math.sin(lean) + 30);
        plate.add(slab);

        // soft contact shadow on the desk
        const shadowTex = this.shadowTexture();
        const shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(L * 1.18, D * 1.9),
            new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(-30, 1.5, -40);
        plate.add(shadow);

        plate.position.set(spot.x, deskY, spot.z);
        plate.rotation.y = -0.38; // turn toward the default camera
        this.group.add(plate);
    }

    addStickyNote(computer: THREE.Object3D) {
        // aim at the top-right corner of the bezel, just outside the screen area
        const target = new THREE.Vector3(712, 1395, 0);
        const from = target.clone().setZ(4000);
        const h = this.hit(computer, from, new THREE.Vector3(0, 0, -1));
        const size = 175;
        const note = new THREE.Mesh(
            new THREE.PlaneGeometry(size, size),
            this.basic({ map: this.texture('textures/personal/sticky.webp'), transparent: true, alphaTest: 0.02 })
        );
        if (h && h.face) {
            const n = h.face.normal.clone().transformDirection(h.object.matrixWorld);
            note.position.copy(h.point).add(n.clone().multiplyScalar(2.5));
            note.lookAt(note.position.clone().add(n));
        } else {
            note.position.set(target.x, target.y, 545);
        }
        note.rotateZ(THREE.MathUtils.degToRad(-7));
        this.group.add(note);
    }

    poster?: THREE.Mesh;

    addPoster(environment: THREE.Object3D) {
        const PW = 900; // poster size (the texture is 640x880)
        const PH = 1238;
        const B = 60; // frame border
        const T = 34; // frame depth
        const lean = THREE.MathUtils.degToRad(11);

        const spot = new THREE.Vector3(-1880, 2000, -1000);
        const h = this.hit(environment, spot, new THREE.Vector3(0, -1, 0));
        const deskY = h ? h.point.y : -452;

        const frame = new THREE.Group();
        const wood = this.texture('textures/personal/walnut.webp');
        wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
        const woodFront = this.basic({ map: wood, color: this.shade(0xffffff, 0.75) });
        const woodTop = this.basic({ map: wood, color: this.shade(0xffffff, 0.95) });
        const woodSide = this.basic({ map: wood, color: this.shade(0xffffff, 0.55) });
        const woodDark = this.basic({ map: wood, color: this.shade(0xffffff, 0.4) });
        const bar = (w: number, hh: number, x: number, y: number) => {
            const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, T), [woodSide, woodDark, woodTop, woodDark, woodFront, woodDark]);
            m.position.set(x, y, 0);
            frame.add(m);
        };
        const FW = PW + B * 2;
        const FH = PH + B * 2;
        bar(FW, B, 0, FH / 2 - B / 2); // top
        bar(FW, B, 0, -FH / 2 + B / 2); // bottom
        bar(B, PH, -FW / 2 + B / 2, 0); // left
        bar(B, PH, FW / 2 - B / 2, 0); // right

        // the print itself, set a little behind the frame's front face
        const print = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), this.basic({ map: this.texture('textures/personal/poster.webp') }));
        print.position.z = T / 2 - 10;
        frame.add(print);
        // a backing board so the frame isn't see-through from the side
        const back = new THREE.Mesh(new THREE.BoxGeometry(FW, FH, 6), this.basic({ color: 0x2a1c12 }));
        back.position.z = -T / 2 + 3;
        frame.add(back);

        // lean it back on the desk, bottom edge resting on the surface
        frame.rotation.x = -lean;
        frame.position.set(
            spot.x,
            deskY + (FH / 2) * Math.cos(lean) + (T / 2) * Math.sin(lean),
            spot.z - (FH / 2) * Math.sin(lean)
        );
        frame.rotation.y = 0.26; // turned slightly toward the camera

        const shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(FW * 1.25, 360),
            new THREE.MeshBasicMaterial({ map: this.shadowTexture(), transparent: true, depthWrite: false })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(spot.x + 20, deskY + 1.5, spot.z - 120);
        this.group.add(shadow);
        this.group.add(frame);
        this.poster = print;

        // clicking the poster opens the web resume
        this.clickable([print], () => {
            this.count('3d/poster', 'Poster click (3D)');
            window.open('/cv/', '_blank', 'noopener');
        });
    }

    addCan(environment: THREE.Object3D, decor?: THREE.Object3D) {
        // the baked mug goes; the can stands where it was
        const mug = decor && decor.getObjectByName('coffee');
        if (mug) mug.visible = false;

        const spot = new THREE.Vector3(1700, 2000, 905);
        const h = this.hit(environment, spot, new THREE.Vector3(0, -1, 0));
        const deskY = h ? h.point.y : -449;

        const R = 168; // a tall 500 ml can, to the scene's scale
        const BASE = 40; // tapered foot
        const BODY = 730; // painted body
        const seg = 64;
        const can = new THREE.Group();

        const metalTex = this.texture('textures/personal/can-metal.webp');
        const metal = this.basic({ map: metalTex, side: THREE.DoubleSide });
        const label = this.basic({ map: this.texture('textures/personal/can-label.webp') });

        // foot: from the base ring out to the full radius
        const foot = new THREE.LatheGeometry(
            [new THREE.Vector2(R * 0.8, 0), new THREE.Vector2(R * 0.9, 6), new THREE.Vector2(R * 0.98, 22), new THREE.Vector2(R, BASE)],
            seg
        );
        can.add(new THREE.Mesh(foot, metal));

        const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, BODY, seg, 1, true), label);
        body.position.y = BASE + BODY / 2;
        can.add(body);

        // shoulder, neck and the rolled rim, then down inside to the lid
        const top = BASE + BODY;
        const shoulder = new THREE.LatheGeometry(
            [
                new THREE.Vector2(R, top),
                new THREE.Vector2(R * 0.985, top + 14),
                new THREE.Vector2(R * 0.93, top + 38),
                new THREE.Vector2(R * 0.87, top + 58),
                new THREE.Vector2(R * 0.86, top + 70),
                new THREE.Vector2(R * 0.875, top + 77),
                new THREE.Vector2(R * 0.87, top + 83),
                new THREE.Vector2(R * 0.845, top + 84),
                new THREE.Vector2(R * 0.83, top + 78),
                new THREE.Vector2(R * 0.83, top + 70),
            ],
            seg
        );
        can.add(new THREE.Mesh(shoulder, metal));

        const lid = new THREE.Mesh(
            new THREE.CircleGeometry(R * 0.83, seg),
            this.basic({ map: this.texture('textures/personal/can-lid.webp'), transparent: true })
        );
        lid.rotation.x = -Math.PI / 2;
        lid.rotation.z = THREE.MathUtils.degToRad(-25); // tab faces the same way as the label
        lid.position.y = top + 70;
        can.add(lid);

        const shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(R * 3.4, R * 2.6),
            new THREE.MeshBasicMaterial({ map: this.shadowTexture(), transparent: true, depthWrite: false })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(R * 0.35, 1.5, -R * 0.15); // light comes from the front-left
        can.add(shadow);

        can.position.set(spot.x, deskY, spot.z);
        this.group.add(can);

        // click the can: pssht, and White pops up on the monitor
        this.clickable([body, lid], () => {
            const world = (this.application as any).world;
            if (world && world.audioManager) {
                world.audioManager.playAudio('canOpen', {
                    volume: 0.9,
                    position: new THREE.Vector3(spot.x, deskY + 600, spot.z),
                });
            }
            const screen = document.querySelector('iframe[src="os/"]') as HTMLIFrameElement | null;
            if (screen && screen.contentWindow) {
                screen.contentWindow.postMessage({ type: 'aos-activity' }, '*'); // wakes the screensaver
                screen.contentWindow.postMessage({ type: 'aos-assistant' }, '*');
                screen.contentWindow.postMessage({ type: 'aos-achieve', id: 'refuel' }, '*');
            }
            this.count('3d/can', 'Can click (3D)');
        });
    }

    neon?: { lit: THREE.MeshBasicMaterial; glow: THREE.MeshBasicMaterial; state: 'off' | 'flicker' | 'on'; t0: number };

    addNeonSign(environment: THREE.Object3D) {
        // between the computer and the binders, in front of the binders
        const spot = new THREE.Vector3(1215, 2000, 120);
        const h = this.hit(environment, spot, new THREE.Vector3(0, -1, 0));
        const deskY = h ? h.point.y : -449;
        const W = 660;
        const H = (W * 600) / 1024;
        const lean = THREE.MathUtils.degToRad(8);

        const sign = new THREE.Group();
        // a slim dark base the acrylic panel slots into
        const base = new THREE.Mesh(new THREE.BoxGeometry(W * 0.86, 26, 70), [
            this.basic({ color: 0x1d1d22 }),
            this.basic({ color: 0x1d1d22 }),
            this.basic({ color: 0x3a3a42 }),
            this.basic({ color: 0x111114 }),
            this.basic({ color: 0x2a2a30 }),
            this.basic({ color: 0x111114 }),
        ]);
        base.position.y = 13;
        sign.add(base);

        const panel = new THREE.Group();
        panel.rotation.x = -lean;
        panel.position.set(0, 20, 0);
        sign.add(panel);
        const plane = new THREE.PlaneGeometry(W, H);
        plane.translate(0, H / 2, 0);
        // the unlit tubes take the room's lighting; the lit layer is light itself, so it is
        // never darkened by the night tint and fades in on top
        const off = new THREE.Mesh(plane, this.basic({ map: this.texture('textures/personal/neon-off.webp'), transparent: true, depthWrite: false }));
        panel.add(off);
        const lit = new THREE.MeshBasicMaterial({ map: this.texture('textures/personal/neon-on.webp'), transparent: true, depthWrite: false, opacity: 0 });
        const on = new THREE.Mesh(plane, lit);
        on.position.z = 0.5;
        panel.add(on);
        // a soft orange spill on the desk in front of the sign
        const glow = new THREE.MeshBasicMaterial({
            map: this.glowTexture(),
            color: 0xff6a1a,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const spill = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.3, 380), glow);
        spill.rotation.x = -Math.PI / 2;
        spill.position.set(0, 1.5, 150);
        sign.add(spill);

        sign.position.set(spot.x, deskY, spot.z);
        sign.rotation.y = -0.26; // turned toward the camera
        this.group.add(sign);
        this.neon = { lit, glow, state: 'off', t0: 0 };
    }

    lastFrame = performance.now();

    /** Called every frame by World. */
    update() {
        const now0 = performance.now();
        this.stepTime(now0 - this.lastFrame);
        this.lastFrame = now0;
        const n = this.neon;
        if (!n || n.state === 'on') return;
        const cam = (this.application as any).camera;
        const now = performance.now();
        if (n.state === 'off') {
            // light up the first time the visitor comes up to the desk
            if (cam && (cam.currentKeyframe === 'desk' || cam.currentKeyframe === 'monitor')) {
                n.state = 'flicker';
                n.t0 = now + 300;
            }
            return;
        }
        // flicker: a few stutters, then steady
        const t = now - n.t0;
        const steps: [number, number][] = [[0, 0], [80, 0.9], [140, 0.1], [260, 0.7], [320, 0], [520, 1], [600, 0.35], [680, 1]];
        let v = 0;
        for (const [at, val] of steps) if (t >= at) v = val;
        n.lit.opacity = v;
        n.glow.opacity = v * 0.35;
        if (t > 700) n.state = 'on';
    }

    clickables: { meshes: THREE.Object3D[]; onClick: () => void }[] = [];
    clickWired = false;

    /** Makes meshes clickable (a click, not a drag) and shows a pointer over them. */
    clickable(meshes: THREE.Object3D[], onClick: () => void) {
        this.clickables.push({ meshes, onClick });
        if (this.clickWired) return;
        this.clickWired = true;
        const ray = new THREE.Raycaster();
        const pick = (e: MouseEvent) => {
            const cam = (this.application as any).camera && (this.application as any).camera.instance;
            if (!cam) return null;
            ray.setFromCamera(new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1), cam);
            // the nearest hit among everything clickable, and anything in the way (the monitor glass is a CSS layer, not hit here)
            const all = this.clickables.flatMap((c) => c.meshes);
            const hits = ray.intersectObjects(all, false);
            if (!hits.length) return null;
            return this.clickables.find((c) => c.meshes.includes(hits[0].object)) || null;
        };
        let down = { x: 0, y: 0 };
        let armed = false;
        // capture phase, so it runs before the camera's click-to-zoom handler
        window.addEventListener(
            'mousedown',
            (e) => {
                down = { x: e.clientX, y: e.clientY };
                // @ts-ignore events relayed from inside the monitor
                if (e.inComputer) return;
                const cam = (this.application as any).camera;
                // from far away a click still zooms in to the desk; up close it uses the object
                armed = !!pick(e) && cam && cam.currentKeyframe !== 'idle';
                // @ts-ignore read by Camera
                if (armed) e.aosClickable = true;
            },
            true
        );
        window.addEventListener('mouseup', (e) => {
            // @ts-ignore events relayed from inside the monitor
            if (e.inComputer) return;
            if (!armed || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return; // a drag, not a click
            armed = false;
            const c = pick(e);
            if (c) c.onClick();
        });
        let hovering = false;
        window.addEventListener('mousemove', (e) => {
            // @ts-ignore events relayed from inside the monitor
            if (e.inComputer) return;
            const over = !!pick(e);
            if (over !== hovering) {
                hovering = over;
                document.body.style.cursor = over ? 'pointer' : '';
            }
        });
    }

    count(path: string, title: string) {
        try {
            const gc = (window as any).goatcounter;
            if (gc && gc.count) gc.count({ path, title, event: true });
        } catch (err) {}
    }

    /** A soft white spot (for light: tinted by the material colour, added on top). */
    glowTexture() {
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const g = c.getContext('2d')!;
        const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
        grd.addColorStop(0, 'rgba(255,255,255,1)');
        grd.addColorStop(0.45, 'rgba(255,255,255,0.45)');
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
    }

    shadowTexture() {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 128;
        const g = c.getContext('2d')!;
        const grd = g.createRadialGradient(128, 64, 8, 128, 64, 120);
        grd.addColorStop(0, 'rgba(0,0,0,0.42)');
        grd.addColorStop(0.55, 'rgba(0,0,0,0.18)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grd;
        g.save();
        g.scale(1, 0.5);
        g.fillRect(0, 0, 256, 256);
        g.restore();
        const t = new THREE.CanvasTexture(c);
        return t;
    }

    lamp?: { bulb: THREE.MeshBasicMaterial; inner: THREE.MeshBasicMaterial; pool: THREE.MeshBasicMaterial; halo: THREE.MeshBasicMaterial };

    addLamp(environment: THREE.Object3D) {
        // a classic two-arm desk lamp in front of the paper stack, leaning over the loose sheet of paper
        const spot = new THREE.Vector3(-1330, 2000, 660);
        const h = this.hit(environment, spot, new THREE.Vector3(0, -1, 0));
        const deskY = h ? h.point.y : -449;
        const lamp = new THREE.Group();
        const metalTex = this.texture('textures/personal/can-metal.webp');
        const body = this.basic({ map: metalTex, color: new THREE.Color(0.3, 0.3, 0.33) });
        const bodyDark = this.basic({ map: metalTex, color: new THREE.Color(0.18, 0.18, 0.2) });
        const joint = this.basic({ color: 0x55555c });

        const base = new THREE.Mesh(new THREE.CylinderGeometry(170, 190, 40, 40), body);
        base.position.y = 20;
        lamp.add(base);
        const rod = (a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) => {
            const len = a.distanceTo(b);
            const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
            m.position.copy(a).add(b).multiplyScalar(0.5);
            m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
            lamp.add(m);
            const ball = new THREE.Mesh(new THREE.SphereGeometry(r * 1.7, 12, 10), joint);
            ball.position.copy(b);
            lamp.add(ball);
        };
        const foot = new THREE.Vector3(0, 46, -30);
        const elbow = new THREE.Vector3(0, 640, -170);
        const wrist = new THREE.Vector3(0, 740, 420);
        rod(foot, elbow, 19, bodyDark);
        rod(elbow, wrist, 17, bodyDark);

        // the shade: a cone hanging from the wrist, tipped forward and down
        const head = new THREE.Group();
        head.position.copy(wrist);
        head.rotation.x = THREE.MathUtils.degToRad(-38); // cone axis points down and a bit forward
        lamp.add(head);
        const shadeGeo = new THREE.CylinderGeometry(70, 210, 320, 36, 1, true);
        shadeGeo.translate(0, -160 - 26, 0);
        head.add(new THREE.Mesh(shadeGeo, this.basic({ map: metalTex, color: new THREE.Color(0.85, 0.36, 0.12), side: THREE.FrontSide })));
        // inside of the shade and the bulb are light sources when the lamp is on: not tinted
        const inner = new THREE.MeshBasicMaterial({ color: 0x2a2a2a, side: THREE.BackSide });
        head.add(new THREE.Mesh(shadeGeo, inner));
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(74, 74, 52, 24), body);
        cap.position.y = -26;
        head.add(cap);
        const bulb = new THREE.MeshBasicMaterial({ color: 0x9a9a9a });
        const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(78, 20, 16), bulb);
        bulbMesh.position.y = -300;
        head.add(bulbMesh);
        // a soft halo around the opening and a warm pool of light on the desk
        const halo = new THREE.MeshBasicMaterial({ map: this.glowTexture(), color: 0xffc27a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
        const haloMesh = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), halo);
        haloMesh.position.y = -340;
        haloMesh.rotation.x = Math.PI / 2;
        head.add(haloMesh);
        const pool = new THREE.MeshBasicMaterial({ map: this.glowTexture(), color: 0xffb766, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
        const poolMesh = new THREE.Mesh(new THREE.PlaneGeometry(1300, 1100), pool);
        poolMesh.rotation.x = -Math.PI / 2;
        poolMesh.position.set(0, 9, 920); // just above the loose sheet of paper
        lamp.add(poolMesh);
        const shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 360),
            new THREE.MeshBasicMaterial({ map: this.shadowTexture(), transparent: true, depthWrite: false })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(30, 1.5, 0);
        lamp.add(shadow);

        lamp.position.set(spot.x, deskY, spot.z);
        lamp.rotation.y = THREE.MathUtils.degToRad(-65); // the head points left, over the paper
        this.group.add(lamp);
        this.lamp = { bulb, inner, pool, halo };

        // click the lamp: switch between day and night for this visit
        this.clickable([base, bulbMesh, ...head.children.filter((c) => c !== haloMesh)], () => {
            const next = this.time === 'day' ? 'night' : 'day';
            try {
                sessionStorage.setItem('aayushos-time', next);
            } catch (e) {}
            this.setTime(next);
            const world = (this.application as any).world;
            if (world && world.audioManager) world.audioManager.playAudio('mouseUp', { volume: 0.9, position: new THREE.Vector3(spot.x, deskY + 100, spot.z) });
            this.count('3d/lamp-' + next, 'Lamp: ' + next);
        });
    }

    // ---------- Time of day ----------
    time: 'day' | 'sunset' | 'night' = 'day';
    baseColors = new Map<THREE.MeshBasicMaterial, THREE.Color>();
    tint = new THREE.Color(1, 1, 1);
    tintTarget = new THREE.Color(1, 1, 1);
    lampLevel = 0;
    lampTarget = 0;

    static TINTS = NEW_ROOM
        ? {
              // the CRT and the desk items, matched to the baked room's light
              day: new THREE.Color(0.9, 0.9, 0.92),
              sunset: new THREE.Color(0.8, 0.66, 0.6),
              night: new THREE.Color(0.36, 0.32, 0.42),
          }
        : LOFI_ROOM
        ? {
              // the bedroom: warm sunset, a dark blue-grey night lit by the LEDs and the screen
              day: new THREE.Color(1, 1, 1),
              sunset: new THREE.Color(1.0, 0.8, 0.66),
              night: new THREE.Color(0.17, 0.17, 0.24),
          }
        : {
              day: new THREE.Color(1, 1, 1),
              sunset: new THREE.Color(1.0, 0.8, 0.62),
              night: new THREE.Color(0.13, 0.15, 0.3),
          };

    /** 'day', 'sunset' (5 to 7 pm IST) or 'night' (7 pm to 6 am IST): URL, then the lamp, then the clock. */
    timeOfDay(): 'day' | 'sunset' | 'night' {
        const q = new URLSearchParams(window.location.search);
        const t = q.get('time');
        if (t === 'day' || t === 'sunset' || t === 'night') return t;
        if (q.get('night') === '1') return 'night';
        if (q.get('night') === '0') return 'day';
        try {
            const s = sessionStorage.getItem('aayushos-time');
            if (s === 'day' || s === 'sunset' || s === 'night') return s;
        } catch (e) {}
        return this.clockTime();
    }

    clockTime(): 'day' | 'sunset' | 'night' {
        // Bangalore time (UTC+5:30)
        const now = new Date();
        const ist = (now.getUTCHours() + now.getUTCMinutes() / 60 + 5.5) % 24;
        if (ist >= 19 || ist < 6) return 'night';
        if (ist >= 17) return 'sunset';
        return 'day';
    }

    initTimeOfDay() {
        this.tintables.forEach((m) => this.baseColors.set(m, m.color.clone()));
        this.setTime(this.timeOfDay(), true);
        // automatic: follow the clock (past 5 pm, 7 pm, 6 am) unless the lamp or the URL decided
        setInterval(() => {
            const t = this.timeOfDay();
            if (t !== this.time) this.setTime(t);
        }, 60000);
    }

    sleeping = false;

    /** Sleep mode (Toys: click the bed): the CRT and the desk items go dark, the lamp goes off. */
    setSleep(on: boolean) {
        this.sleeping = on;
        this.setTime(this.time);
    }

    setTime(time: 'day' | 'sunset' | 'night', instant = false) {
        this.time = time;
        this.tintTarget.copy(Personal.TINTS[time]);
        this.lampTarget = time === 'night' ? 1 : time === 'sunset' ? 0.55 : 0;
        if (this.sleeping) {
            this.tintTarget.copy(Personal.TINTS.night).multiplyScalar(0.45);
            this.lampTarget = 0;
        }
        if (instant) {
            this.tint.copy(this.tintTarget);
            this.lampLevel = this.lampTarget;
            this.paintTime();
        }
        if (this.room) this.room.setTime(time);
        const world = (this.application as any).world;
        if (world && world.room) {
            world.room.setTime(time, instant);
            world.room.setSleep(this.sleeping);
        }
        if (world && world.monitorScreen && world.monitorScreen.setNight) world.monitorScreen.setNight(time === 'night');
        const html = document.documentElement.classList;
        html.remove('day', 'sunset', 'night');
        if (time !== 'day') html.add(time);
        // tell AayushOS on the monitor (night wallpaper and screen dimming)
        const screen = document.querySelector('iframe[src="os/"]') as HTMLIFrameElement | null;
        if (screen && screen.contentWindow) screen.contentWindow.postMessage({ type: 'aos-time', time }, '*');
    }

    paintTime() {
        this.baseColors.forEach((base, m) => m.color.copy(base).multiply(this.tint));
        if (this.room) this.room.paint(this.lampLevel);
        const l = this.lamp;
        if (!l) return;
        const k = this.lampLevel;
        l.bulb.color.setRGB(0.6 + 0.4 * k, 0.6 + 0.37 * k, 0.6 + 0.26 * k);
        l.inner.color.setRGB(0.16 + 0.84 * k, 0.16 + 0.66 * k, 0.16 + 0.38 * k);
        // the new room has the lamp's light baked in
        l.pool.opacity = NEW_ROOM ? 0 : 0.6 * k;
        l.halo.opacity = 0.3 * k;
    }

    stepTime(dt: number) {
        const a = Math.min(1, dt / 350);
        const before = this.tint.clone();
        this.tint.lerp(this.tintTarget, a);
        const lampBefore = this.lampLevel;
        this.lampLevel += (this.lampTarget - this.lampLevel) * a;
        if (Math.abs(this.lampLevel - this.lampTarget) < 0.002) this.lampLevel = this.lampTarget;
        const d = Math.abs(before.r - this.tint.r) + Math.abs(before.g - this.tint.g) + Math.abs(before.b - this.tint.b);
        if (d > 1e-4 || lampBefore !== this.lampLevel) this.paintTime();
    }
}
