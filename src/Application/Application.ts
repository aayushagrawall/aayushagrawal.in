import * as THREE from 'three';

import Debug from './Utils/Debug';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Camera from './Camera/Camera';
import Renderer from './Renderer';
import Mouse from './Utils/Mouse';

//@ts-ignore
import World from './World/World';
import Resources from './Utils/Resources';

import sources from './sources';
import UIEventBus from './UI/EventBus';

import Stats from 'stats.js';
import Loading from './Utils/Loading';

import UI from './UI';
import { createUI } from './UI/App';

const hasWebGL = () => {
    try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
        return false;
    }
};

let instance: Application | null = null;

export default class Application {
    debug: Debug;
    sizes: Sizes;
    time: Time;
    scene: THREE.Scene;
    cssScene: THREE.Scene;
    overlayScene: THREE.Scene;
    resources: Resources;
    camera: Camera;
    renderer: Renderer;
    world: World;
    mouse: Mouse;
    loading: Loading;
    ui: UI;
    stats: Stats | undefined;

    constructor() {
        // Singleton
        if (instance) {
            return instance;
        }

        instance = this;

        // Global access
        //@ts-ignore
        // window.Application = this;

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.mouse = new Mouse();
        this.loading = new Loading();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.cssScene = new THREE.Scene();
        this.overlayScene = new THREE.Scene();
        // No WebGL (switched off, blocked on an office machine, a very old browser): the renderer
        // would throw before anything is on the page. Put up the loading screen alone; it shows
        // the "No WebGL" message with the ways to the same content without 3D.
        if (!hasWebGL()) {
            createUI();
            return;
        }
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.camera.createControls();
        this.world = new World();

        this.ui = new UI();

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug')) {
            this.stats = new Stats();
            this.stats.showPanel(0);

            document.body.appendChild(this.stats.dom);
        }

        // Resize event
        this.sizes.on('resize', () => {
            this.resize();
        });

        UIEventBus.on('loadingScreenDone', () => {
            this.started = true;
        });

        // Time tick event
        this.time.on('tick', () => {
            this.update();
        });
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    // Behind the loading screen nothing needs drawing: draw one frame once everything has
    // loaded (to compile the shaders and upload the textures while the BIOS text runs), then
    // wait for START.
    started = false;
    warmedUp = false;

    update() {
        if (!this.started) {
            if (this.warmedUp || !this.world || !this.world.room) return;
            this.warmedUp = true;
        }
        if (this.stats) this.stats.begin();
        this.camera.update();
        this.world.update();
        this.renderer.update();
        if (this.stats) this.stats.end();
    }

    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key];

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose();
                    }
                }
            }
        });

        this.renderer.instance.dispose();

        if (this.debug.active) this.debug.ui.destroy();
    }
}
