import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';
import { ROOM_TOYS } from '../config';
import { ROOM2 } from './roomData';

/**
 * The streetwear bedroom around the CRT, modelled and light-baked in Blender
 * (scripts/room-blender/build_room.py). One mesh with one UV atlas:
 *   colour   = albedo.webp
 *   light    = light-night.webp / light-day.webp (baked lighting, stored scaled down; the
 *              scale comes back as the light map intensity)
 * Drawn unlit like the rest of the scene: colour x light. Day and night cross-fade by mixing
 * the two light maps in the shader. Glowing parts (LED strips, the neon sign, the window)
 * come from glow.glb and are drawn unlit on top.
 *
 * With ROOM_TOYS the room comes from static/models/Room2/, and the things that move (the
 * football, the cat, the phone, the earbuds case, the curtains) are separate meshes in
 * props.glb, baked into the same atlas. World/Toys.ts makes them interactive; this class
 * also runs the small idle animations (LED strips breathing, curtains swaying, a faint
 * flicker of the CRT's light at night) and the "lights out" of sleep mode.
 */

// light map intensities written by the bake (room.json)
const LIGHT_SCALE = ROOM_TOYS ? ROOM2.lightMapIntensity : { night: 10.7121, day: 19.1283 };

type Time = 'day' | 'sunset' | 'night';

const BACKGROUND: { [k in Time]: THREE.Color } = {
    day: new THREE.Color('#aeb6c2'),
    sunset: new THREE.Color('#3b2c33'),
    night: new THREE.Color('#0b0c10'),
};
const SLEEP_TINT = new THREE.Color(0.13, 0.14, 0.22); // lights out: only a little moonlight
const SLEEP_BG = new THREE.Color('#050509');

const LIGHT_HEADER = 'uniform sampler2D lightMapB;\nuniform float lightMapBIntensity;\nuniform float lightMix;\nuniform vec3 lightTint;\nuniform float uTime;\nuniform float lightCrush;\n';

export default class BakedRoom {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    model: THREE.Group;
    material: THREE.MeshBasicMaterial;
    albedo: THREE.Texture;
    nightMap: THREE.Texture;
    uniforms = {
        lightMapB: { value: null as THREE.Texture | null },
        lightMapBIntensity: { value: LIGHT_SCALE.day },
        lightMix: { value: 0 },
        lightTint: { value: new THREE.Color(1, 1, 1) },
        uTime: { value: 0 },
        lightCrush: { value: 0 },
    };
    // the time of day, eased (composed with sleep and the neon into the uniforms each frame)
    mix = 0;
    mixTarget = 0;
    tint = new THREE.Color(1, 1, 1);
    tintTarget = new THREE.Color(1, 1, 1);
    bg = new THREE.Color();
    bgTarget = new THREE.Color();
    time: Time = 'night';
    glow: { [uuid: string]: { m: THREE.MeshBasicMaterial; name: string; phase: number } } = {};
    glowMeshes: { [name: string]: THREE.Mesh } = {};
    windowTex: { [k in Time]?: THREE.Texture } = {};
    windowShown?: THREE.Texture;
    glowLevel = 1;
    glowTarget = 1;
    lastTick = 0;
    // toys
    props: { [name: string]: THREE.Mesh } = {};
    ballRot = { value: new THREE.Matrix3() };
    sleep = 0;
    sleepTarget = 0;
    neonMul = 1; // the neon sign's brightness (Toys flickers it)

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        const items = this.resources.items as any;

        const albedo: THREE.Texture = items.texture.roomAlbedo;
        const night: THREE.Texture = items.texture.roomLightNight;
        const day: THREE.Texture = items.texture.roomLightDay;
        for (const t of [albedo, night, day]) {
            t.flipY = false;
            t.encoding = THREE.sRGBEncoding;
            t.anisotropy = 8;
        }
        this.albedo = albedo;
        this.nightMap = night;
        this.uniforms.lightMapB.value = day;
        this.material = this.makeMaterial('room');

        this.model = items.gltfModel.roomModel.scene as THREE.Group;
        this.model.name = 'bakedRoom';
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                this.prepare(child);
                child.material = this.material;
            }
        });
        this.scene.add(this.model);
        this.model.updateMatrixWorld(true);

        this.addGlow(items.gltfModel.roomGlowModel.scene as THREE.Group);
        if (ROOM_TOYS && items.gltfModel.roomPropsModel) this.addProps(items.gltfModel.roomPropsModel.scene as THREE.Group);
    }

    prepare(child: THREE.Mesh) {
        BakedModel.dequantize(child.geometry);
        child.scale.multiplyScalar(1000);
        child.position.multiplyScalar(1000);
        const g = child.geometry as THREE.BufferGeometry;
        if (g.attributes.uv) g.setAttribute('uv2', g.attributes.uv);
    }

    /**
     * The room's material: albedo x (night and day light maps, mixed). `vertex` and `fragment`
     * patch the shader for the props that need it (the rolling football, the swaying curtains).
     */
    makeMaterial(key: string, vertex?: (s: string) => string, fragment?: (s: string) => string, extra: { [k: string]: { value: any } } = {}) {
        const m = new THREE.MeshBasicMaterial({ map: this.albedo, lightMap: this.nightMap, lightMapIntensity: LIGHT_SCALE.night });
        m.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, this.uniforms, extra);
            let fs = (LIGHT_HEADER + shader.fragmentShader).replace(
                'reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity;',
                [
                    'vec3 lightA = lightMapTexel.rgb * lightMapIntensity;',
                    'vec3 lightB = texture2D( lightMapB, vUv2 ).rgb * lightMapBIntensity;',
                    'vec3 roomLight = mix( lightA, lightB, lightMix ) * lightTint;',
                    // lights out: squash the bright baked spots (the desk lamp, the LEDs) too
                    'roomLight /= 1.0 + lightCrush * max( max( roomLight.r, roomLight.g ), roomLight.b );',
                    'reflectedLight.indirectDiffuse += roomLight;',
                ].join('\n')
            );
            if (fragment) fs = fragment(fs);
            shader.fragmentShader = fs;
            if (vertex) shader.vertexShader = vertex('uniform float uTime;\n' + shader.vertexShader);
        };
        m.customProgramCacheKey = () => 'baked-room-' + key;
        return m;
    }

    addProps(group: THREE.Group) {
        // the football: drawn with its panels in the shader, so it can roll while its baked
        // light (from above) stays put
        const ball = this.makeMaterial(
            'ball',
            (vs) =>
                'varying vec3 vBallDir;\n' +
                vs.replace('#include <begin_vertex>', '#include <begin_vertex>\nvBallDir = mat3( modelMatrix ) * position;'),
            (fs) =>
                'varying vec3 vBallDir;\nuniform mat3 ballRot;\n' +
                fs.replace(
                    '#include <map_fragment>',
                    [
                        '#include <map_fragment>',
                        'vec3 bd = normalize( ballRot * vBallDir );',
                        'vec3 ico[6];',
                        'ico[0] = vec3( 0.0, 0.5257311, 0.8506508 ); ico[1] = vec3( 0.0, 0.5257311, -0.8506508 );',
                        'ico[2] = vec3( 0.5257311, 0.8506508, 0.0 ); ico[3] = vec3( 0.5257311, -0.8506508, 0.0 );',
                        'ico[4] = vec3( 0.8506508, 0.0, 0.5257311 ); ico[5] = vec3( 0.8506508, 0.0, -0.5257311 );',
                        'float near = 0.0;',
                        'for ( int i = 0; i < 6; i ++ ) near = max( near, abs( dot( bd, ico[ i ] ) ) );',
                        'float panel = smoothstep( 0.925, 0.932, near );',
                        'diffuseColor.rgb *= mix( vec3( 1.0 ), vec3( 0.07 ), panel );',
                    ].join('\n')
                ),
            { ballRot: this.ballRot }
        );
        // the curtains sway a little from the bottom (the rod is at y = 3600)
        const curtain = this.makeMaterial('curtain', (vs) =>
            vs.replace(
                '#include <begin_vertex>',
                [
                    '#include <begin_vertex>',
                    // in scene units (the mesh is stored compressed, with its own offset and scale)
                    'vec3 wp = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;',
                    'float cw = clamp( ( 3600.0 - wp.y ) / 3500.0, 0.0, 1.0 );',
                    'cw *= cw;',
                    'vec3 sway = vec3( cw * 12.0 * sin( uTime * 0.7 + wp.x * 0.0013 + 1.0 ), 0.0, cw * 35.0 * sin( uTime * 0.9 + wp.x * 0.0022 ) );',
                    'vec3 msc = vec3( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ), length( modelMatrix[ 2 ].xyz ) );',
                    'transformed += sway / msc;',
                ].join('\n')
            )
        );
        group.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            this.prepare(child);
            const name = child.name.replace(/([._]\d+|\d{3})$/, '');
            child.material = name === 'football' ? ball : name.startsWith('curtain') ? curtain : this.material;
            this.props[name] = child;
        });
        this.scene.add(group);
        group.updateMatrixWorld(true);
    }

    addGlow(group: THREE.Group) {
        const loader = new THREE.TextureLoader();
        for (const t of ['day', 'sunset', 'night'] as Time[]) {
            const tex = loader.load(`textures/room/window-${t}.webp`);
            tex.encoding = THREE.sRGBEncoding;
            this.windowTex[t] = tex;
        }
        let i = 0;
        group.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            BakedModel.dequantize(child.geometry);
            child.scale.multiplyScalar(1000);
            child.position.multiplyScalar(1000);
            const name = child.name.replace(/([._]\d+|\d{3})$/, '');
            this.glowMeshes[name] = child;
            (child.userData as any).glow = name;
            if (name.startsWith('phone_screen')) {
                // Toys draws the notifications on it
                child.material = new THREE.MeshBasicMaterial({ color: 0x050507 });
                return;
            }
            let m: THREE.MeshBasicMaterial;
            if (name.startsWith('window_glass')) {
                m = new THREE.MeshBasicMaterial({ map: this.windowTex.night! });
            } else {
                // LED strips and the neon sign: red light
                m = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff3030') });
            }
            this.glow[child.uuid] = { m, name, phase: i++ * 1.7 };
            child.material = m;
        });
        this.scene.add(group);
    }

    get raycastTarget() {
        return this.model;
    }

    setTime(time: Time, instant = false) {
        this.time = time;
        this.mixTarget = time === 'night' ? 0 : time === 'sunset' ? 0.55 : 1;
        this.tintTarget.set(time === 'sunset' ? '#ffd2b0' : '#ffffff');
        this.bgTarget.copy(BACKGROUND[time]);
        this.glowTarget = time === 'night' ? 1 : time === 'sunset' ? 0.75 : 0.35;
        if (instant) {
            this.mix = this.mixTarget;
            this.tint.copy(this.tintTarget);
            this.bg.copy(this.bgTarget);
            this.glowLevel = this.glowTarget;
        }
        this.compose(performance.now() / 1000);
    }

    /** Sleep mode (click the bed): lights out, LEDs and neon off, night outside. */
    setSleep(on: boolean) {
        this.sleepTarget = on ? 1 : 0;
    }

    paintGlow(t: number) {
        const s = this.sleep;
        Object.values(this.glow).forEach(({ m, name, phase }) => {
            if (name.startsWith('window_glass')) return;
            let k = this.glowLevel;
            if (name.startsWith('neon')) {
                k *= this.neonMul * (1 - s);
            } else {
                // LED strips: off when asleep; with the toys they breathe slowly
                k *= 1 - 0.92 * s;
                if (ROOM_TOYS) k *= 0.86 + 0.14 * Math.sin(t * 0.9 + phase);
            }
            m.color.setRGB(0.25 + 0.75 * k, 0.04 + 0.15 * k, 0.04 + 0.15 * k);
        });
    }

    /** The eased state, plus sleep, the neon and the CRT flicker, into the shader. */
    compose(t: number) {
        const u = this.uniforms;
        const s = this.sleep;
        u.lightMix.value = this.mix * (1 - s);
        u.lightCrush.value = 5 * s;
        const tint = u.lightTint.value;
        tint.copy(this.tint).lerp(SLEEP_TINT, s);
        if (ROOM_TOYS) {
            const night = 1 - this.mix;
            // the neon off: a little less red light in the room at night
            const n = (1 - this.neonMul) * night * (1 - s);
            if (n > 0) tint.multiply(new THREE.Color(1 - 0.12 * n, 1 - 0.05 * n, 1 - 0.05 * n));
            // the CRT's light, flickering very slightly at night
            const f = 1 + 0.012 * night * (1 - s) * (Math.sin(t * 13.1) * 0.6 + Math.sin(t * 29.7) * 0.4);
            tint.multiplyScalar(f);
        }
        if (!(this.scene.background instanceof THREE.Color)) this.scene.background = new THREE.Color();
        (this.scene.background as THREE.Color).copy(this.bg).lerp(SLEEP_BG, s);
        // the window shows night while asleep
        const win = this.windowTex[s > 0.5 ? 'night' : this.time]!;
        if (win !== this.windowShown) {
            this.windowShown = win;
            Object.values(this.glow).forEach(({ m }) => {
                if (m.map) {
                    m.map = win;
                    m.needsUpdate = true;
                }
            });
        }
        this.paintGlow(t);
    }

    update() {
        const now = performance.now();
        const dt = this.lastTick ? Math.min(0.1, (now - this.lastTick) / 1000) : 0;
        this.lastTick = now;
        const t = now / 1000;
        this.uniforms.uTime.value = t;
        const a = Math.min(1, dt * 3);
        this.mix += (this.mixTarget - this.mix) * a;
        this.tint.lerp(this.tintTarget, a);
        this.bg.lerp(this.bgTarget, a);
        this.glowLevel += (this.glowTarget - this.glowLevel) * a;
        this.sleep += (this.sleepTarget - this.sleep) * Math.min(1, dt * 2.2);
        if (Math.abs(this.sleep - this.sleepTarget) < 0.001) this.sleep = this.sleepTarget;
        this.compose(t);
    }
}
