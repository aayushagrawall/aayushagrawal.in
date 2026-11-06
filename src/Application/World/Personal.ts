import * as THREE from 'three';
import Application from '../Application';

/**
 * Aayush's personal touches on the desk:
 *  - a walnut nameplate with his name
 *  - a sticky note on the monitor bezel
 *  - a framed poster on the desk with a QR code to the web resume (click it too)
 *  - a "Bangalore night" tint between 7 pm and 6 am IST (override with ?night=1 / ?night=0)
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
        bakedMaterials: THREE.MeshBasicMaterial[]
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

        this.addNameplate(environment);
        this.addStickyNote(computer);
        this.addPoster(environment);
        this.applyNightMode();
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
        const ray = new THREE.Raycaster();
        let down = { x: 0, y: 0 };
        window.addEventListener('mousedown', (e) => (down = { x: e.clientX, y: e.clientY }));
        window.addEventListener('mouseup', (e) => {
            if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return; // a drag, not a click
            const cam = (this.application as any).camera && (this.application as any).camera.instance;
            if (!cam) return;
            ray.setFromCamera(new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1), cam);
            const hits = ray.intersectObjects([print, ...frame.children], false);
            if (hits.length && hits[0].object === print) {
                try {
                    const gc = (window as any).goatcounter;
                    if (gc && gc.count) gc.count({ path: '3d/poster', title: 'Poster click (3D)', event: true });
                } catch (err) {}
                window.open('/cv/', '_blank', 'noopener');
            }
        });
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

    isNight() {
        const q = new URLSearchParams(window.location.search).get('night');
        if (q === '1') return true;
        if (q === '0') return false;
        // Bangalore time (UTC+5:30)
        const now = new Date();
        const ist = (now.getUTCHours() + now.getUTCMinutes() / 60 + 5.5) % 24;
        return ist >= 19 || ist < 6;
    }

    applyNightMode() {
        if (!this.isNight()) return;
        const tint = new THREE.Color(0.13, 0.15, 0.3);
        this.tintables.forEach((m) => m.color.multiply(tint));
        document.documentElement.classList.add('night');
    }
}
