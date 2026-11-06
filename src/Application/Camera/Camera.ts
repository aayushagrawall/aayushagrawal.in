import * as THREE from 'three';
import Application from '../Application';
import Sizes from '../Utils/Sizes';
import EventEmitter from '../Utils/EventEmitter';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';
import Renderer from '../Renderer';
import Resources from '../Utils/Resources';
import UIEventBus from '../UI/EventBus';
import Time from '../Utils/Time';
import BezierEasing from 'bezier-easing';
import {
    CameraKeyframeInstance,
    MonitorKeyframe,
    IdleKeyframe,
    LoadingKeyframe,
    DeskKeyframe,
    OrbitControlsStart,
} from './CameraKeyframes';

export enum CameraKey {
    IDLE = 'idle',
    MONITOR = 'monitor',
    LOADING = 'loading',
    DESK = 'desk',
    ORBIT_CONTROLS_START = 'orbitControlsStart',
}
export default class Camera extends EventEmitter {
    application: Application;
    sizes: Sizes;
    scene: THREE.Scene;
    instance: THREE.PerspectiveCamera;
    renderer: Renderer;
    resources: Resources;
    time: Time;

    position: THREE.Vector3;
    focalPoint: THREE.Vector3;

    freeCam: boolean;
    orbitControls: OrbitControls;

    currentKeyframe: CameraKey | undefined;
    targetKeyframe: CameraKey | undefined;
    keyframes: { [key in CameraKey]: CameraKeyframeInstance };

    constructor() {
        super();
        this.application = new Application();
        this.sizes = this.application.sizes;
        this.scene = this.application.scene;
        this.renderer = this.application.renderer;
        this.resources = this.application.resources;
        this.time = this.application.time;

        this.position = new THREE.Vector3(0, 0, 0);
        this.focalPoint = new THREE.Vector3(0, 0, 0);

        this.freeCam = false;

        this.keyframes = {
            idle: new IdleKeyframe(),
            monitor: new MonitorKeyframe(),
            loading: new LoadingKeyframe(),
            desk: new DeskKeyframe(),
            orbitControlsStart: new OrbitControlsStart(),
        };

        document.addEventListener('mousedown', (event) => {
            event.preventDefault();
            // @ts-ignore
            if (event.target.id === 'prevent-click') return;
            // a click on something clickable on the desk (poster, can) keeps the camera put
            // @ts-ignore
            if (event.aosClickable) return;
            // print target and current keyframe
            if (
                this.currentKeyframe === CameraKey.IDLE ||
                this.targetKeyframe === CameraKey.IDLE
            ) {
                this.transition(CameraKey.DESK);
            } else if (
                this.currentKeyframe === CameraKey.DESK ||
                this.targetKeyframe === CameraKey.DESK
            ) {
                this.transition(CameraKey.IDLE);
            }
        });

        this.setPostLoadTransition();
        this.setInstance();
        this.setMonitorListeners();
        this.setFreeCamListeners();
    }

    // Camera moves are springs, not fixed-length tweens: each frame the camera accelerates
    // toward the target keyframe's live position, so a click mid-flight just changes the
    // target and the camera turns around smoothly, keeping its speed (no restart, no jump).
    velPos = new THREE.Vector3();
    velFoc = new THREE.Vector3();
    omega = 2 * Math.PI; // spring stiffness, from the "response" time
    lastTick = 0;
    onArrive?: () => void;
    settling = false; // logically arrived (currentKeyframe set) but still easing in
    startDist = 1;

    transition(
        key: CameraKey,
        duration: number = 1000,
        _easing?: any,
        callback?: () => void
    ) {
        if (this.currentKeyframe === key) return;
        if (this.currentKeyframe && !this.settling) {
            // leaving a resting keyframe: start from where the camera is, at rest
            this.velPos.set(0, 0, 0);
            this.velFoc.set(0, 0, 0);
        }
        this.currentKeyframe = undefined;
        this.targetKeyframe = key;
        this.onArrive = callback;
        this.settling = false;
        this.startDist = Math.max(1, this.position.distanceTo(this.keyframes[key].position));

        // "response" (seconds): how quickly the camera gets there. The old tween lengths
        // map onto it so the room keeps its pacing. Reduced motion: shorter flights.
        let response = Math.min(1.6, Math.max(0.55, (duration / 1000) * 0.9));
        if (typeof window.matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) response *= 0.5;
        this.omega = (2 * Math.PI) / response;
    }

    stepSpring() {
        const now = performance.now();
        let dt = this.lastTick ? (now - this.lastTick) / 1000 : 1 / 60;
        this.lastTick = now;
        dt = Math.min(dt, 0.05);
        const key = this.targetKeyframe || (this.settling ? this.currentKeyframe : undefined);
        if (!key) return;
        const kf = this.keyframes[key];
        const w = this.omega;
        // critically damped (damping ratio 1): no overshoot, smooth settle
        const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
        const h = dt / steps;
        const acc = new THREE.Vector3();
        for (let i = 0; i < steps; i++) {
            acc.copy(kf.position).sub(this.position).multiplyScalar(w * w).addScaledVector(this.velPos, -2 * w);
            this.velPos.addScaledVector(acc, h);
            this.position.addScaledVector(this.velPos, h);
            acc.copy(kf.focalPoint).sub(this.focalPoint).multiplyScalar(w * w).addScaledVector(this.velFoc, -2 * w);
            this.velFoc.addScaledVector(acc, h);
            this.focalPoint.addScaledVector(this.velFoc, h);
        }
        const left = this.position.distanceTo(kf.position);
        // close enough to count as "there" for the rest of the site (clicks, the neon sign)...
        if (this.targetKeyframe && left < Math.max(30, this.startDist * 0.03)) {
            this.currentKeyframe = this.targetKeyframe;
            this.targetKeyframe = undefined;
            this.settling = true;
        }
        // ...and fully settled: from here the keyframe drives the camera directly
        if (this.settling && left < 2 && this.focalPoint.distanceTo(kf.focalPoint) < 2 && this.velPos.length() < 20 && this.velFoc.length() < 20) {
            this.settling = false;
            this.velPos.set(0, 0, 0);
            this.velFoc.set(0, 0, 0);
            const cb = this.onArrive;
            this.onArrive = undefined;
            if (cb) cb();
        }
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            10,
            900000
        );
        this.currentKeyframe = CameraKey.LOADING;

        this.scene.add(this.instance);
    }

    setMonitorListeners() {
        this.on('enterMonitor', () => {
            this.transition(CameraKey.MONITOR, 1000);
            UIEventBus.dispatch('enterMonitor', {});
        });
        this.on('leftMonitor', () => {
            this.transition(CameraKey.DESK);
            UIEventBus.dispatch('leftMonitor', {});
        });
    }

    setFreeCamListeners() {
        UIEventBus.on('freeCamToggle', (toggle: boolean) => {
            // if (toggle === this.freeCam) return;
            if (toggle) {
                this.transition(
                    CameraKey.ORBIT_CONTROLS_START,
                    750,
                    BezierEasing(0.13, 0.99, 0, 1),
                    () => {
                        this.instance.position.copy(
                            this.keyframes.orbitControlsStart.position
                        );

                        this.orbitControls.update();
                        this.freeCam = true;
                    }
                );
                // @ts-ignore
                document.getElementById('webgl').style.pointerEvents = 'auto';
            } else {
                this.freeCam = false;
                this.transition(
                    CameraKey.IDLE,
                    4000,
                    TWEEN.Easing.Exponential.Out
                );
                // @ts-ignore
                document.getElementById('webgl').style.pointerEvents = 'none';
            }
        });
    }

    setPostLoadTransition() {
        UIEventBus.on('loadingScreenDone', () => {
            this.transition(CameraKey.IDLE, 2500, TWEEN.Easing.Exponential.Out);
        });
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    createControls() {
        this.renderer = this.application.renderer;
        this.orbitControls = new OrbitControls(
            this.instance,
            this.renderer.instance.domElement
        );

        const { x, y, z } = this.keyframes.orbitControlsStart.focalPoint;
        this.orbitControls.target.set(x, y, z);

        this.orbitControls.enablePan = false;
        this.orbitControls.enableDamping = true;
        this.orbitControls.object.position.copy(
            this.keyframes.orbitControlsStart.position
        );
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.maxPolarAngle = Math.PI / 2;
        this.orbitControls.minDistance = 4000;
        this.orbitControls.maxDistance = 29000;

        this.orbitControls.update();
    }

    update() {
        TWEEN.update();

        if (this.freeCam && this.orbitControls) {
            this.position.copy(this.orbitControls.object.position);
            this.focalPoint.copy(this.orbitControls.target);
            this.orbitControls.update();
            return;
        }

        for (const key in this.keyframes) {
            const _key = key as CameraKey;
            this.keyframes[_key].update();
        }
        this.stepSpring();

        if (this.currentKeyframe && !this.settling) {
            const keyframe = this.keyframes[this.currentKeyframe];
            this.position.copy(keyframe.position);
            this.focalPoint.copy(keyframe.focalPoint);
        }

        this.instance.position.copy(this.position);
        this.instance.lookAt(this.focalPoint);
    }
}
