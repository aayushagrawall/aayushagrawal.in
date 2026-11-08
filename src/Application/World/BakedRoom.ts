import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';

/**
 * The streetwear bedroom around the CRT, modelled and light-baked in Blender
 * (scripts/room-blender/build_room.py). One mesh with one UV atlas:
 *   colour   = albedo.webp
 *   light    = light-night.webp / light-day.webp (baked lighting, stored scaled down; the
 *              scale comes back as the light map intensity)
 * Drawn unlit like the rest of the scene: colour x light. Day and night cross-fade by mixing
 * the two light maps in the shader. Glowing parts (LED strips, the neon sign, the window)
 * come from glow.glb and are drawn unlit on top.
 */

// light map intensities written by the bake (room.json)
const LIGHT_SCALE = { night: 8.0, day: 14.0 };

type Time = 'day' | 'sunset' | 'night';

const BACKGROUND: { [k in Time]: THREE.Color } = {
    day: new THREE.Color('#aeb6c2'),
    sunset: new THREE.Color('#3b2c33'),
    night: new THREE.Color('#0b0c10'),
};

export default class BakedRoom {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    model: THREE.Group;
    material: THREE.MeshBasicMaterial;
    uniforms = {
        lightMapB: { value: null as THREE.Texture | null },
        lightMapBIntensity: { value: LIGHT_SCALE.day },
        lightMix: { value: 0 },
        lightTint: { value: new THREE.Color(1, 1, 1) },
    };
    mixTarget = 0;
    tintTarget = new THREE.Color(1, 1, 1);
    bgTarget = new THREE.Color();
    glow: { [name: string]: THREE.MeshBasicMaterial } = {};
    windowTex: { [k in Time]?: THREE.Texture } = {};
    glowLevel = 1;
    glowTarget = 1;
    lastTick = 0;

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
        this.uniforms.lightMapB.value = day;
        this.material = new THREE.MeshBasicMaterial({ map: albedo, lightMap: night, lightMapIntensity: LIGHT_SCALE.night });
        this.material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, this.uniforms);
            shader.fragmentShader = ('uniform sampler2D lightMapB;\nuniform float lightMapBIntensity;\nuniform float lightMix;\nuniform vec3 lightTint;\n' + shader.fragmentShader)
                .replace(
                    'reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity;',
                    [
                        'vec3 lightA = lightMapTexel.rgb * lightMapIntensity;',
                        'vec3 lightB = texture2D( lightMapB, vUv2 ).rgb * lightMapBIntensity;',
                        'reflectedLight.indirectDiffuse += mix( lightA, lightB, lightMix ) * lightTint;',
                    ].join('\n')
                );
        };

        this.model = items.gltfModel.roomModel.scene as THREE.Group;
        this.model.name = 'bakedRoom';
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                BakedModel.dequantize(child.geometry);
                child.scale.multiplyScalar(1000);
                child.position.multiplyScalar(1000);
                const g = child.geometry as THREE.BufferGeometry;
                g.setAttribute('uv2', g.attributes.uv);
                child.material = this.material;
            }
        });
        this.scene.add(this.model);
        this.model.updateMatrixWorld(true);

        this.addGlow(items.gltfModel.roomGlowModel.scene as THREE.Group);
    }

    addGlow(group: THREE.Group) {
        const loader = new THREE.TextureLoader();
        for (const t of ['day', 'sunset', 'night'] as Time[]) {
            const tex = loader.load(`textures/room/window-${t}.webp`);
            tex.encoding = THREE.sRGBEncoding;
            this.windowTex[t] = tex;
        }
        group.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            BakedModel.dequantize(child.geometry);
            child.scale.multiplyScalar(1000);
            child.position.multiplyScalar(1000);
            const name = child.name.replace(/[._]\d+$/, '');
            let m: THREE.MeshBasicMaterial;
            if (name.startsWith('window_glass')) {
                m = new THREE.MeshBasicMaterial({ map: this.windowTex.night! });
            } else {
                // LED strips and the neon sign: red light
                m = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff3030') });
            }
            this.glow[child.uuid] = m;
            child.material = m;
            (child.userData as any).glow = name;
        });
        this.scene.add(group);
    }

    get raycastTarget() {
        return this.model;
    }

    setTime(time: Time, instant = false) {
        this.mixTarget = time === 'night' ? 0 : time === 'sunset' ? 0.55 : 1;
        this.tintTarget.set(time === 'sunset' ? '#ffd2b0' : '#ffffff');
        this.bgTarget.copy(BACKGROUND[time]);
        this.glowTarget = time === 'night' ? 1 : time === 'sunset' ? 0.75 : 0.35;
        Object.values(this.glow).forEach((m) => {
            if (m.map) {
                m.map = this.windowTex[time]!;
                m.needsUpdate = true;
            }
        });
        if (instant) {
            this.uniforms.lightMix.value = this.mixTarget;
            this.uniforms.lightTint.value.copy(this.tintTarget);
            this.scene.background = this.bgTarget.clone();
            this.glowLevel = this.glowTarget;
            this.paintGlow();
        }
    }

    paintGlow() {
        const k = this.glowLevel;
        Object.values(this.glow).forEach((m) => {
            if (!m.map) m.color.setRGB(0.25 + 0.75 * k, 0.04 + 0.15 * k, 0.04 + 0.15 * k);
        });
    }

    update() {
        const now = performance.now();
        const dt = this.lastTick ? Math.min(0.1, (now - this.lastTick) / 1000) : 0;
        this.lastTick = now;
        const a = Math.min(1, dt * 3);
        const u = this.uniforms;
        u.lightMix.value += (this.mixTarget - u.lightMix.value) * a;
        u.lightTint.value.lerp(this.tintTarget, a);
        if (!(this.scene.background instanceof THREE.Color)) this.scene.background = this.bgTarget.clone();
        (this.scene.background as THREE.Color).lerp(this.bgTarget, a);
        if (Math.abs(this.glowLevel - this.glowTarget) > 0.001) {
            this.glowLevel += (this.glowTarget - this.glowLevel) * a;
            this.paintGlow();
        }
    }
}
