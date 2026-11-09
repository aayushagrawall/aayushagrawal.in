import * as THREE from 'three';
import { CameraKey } from './Camera';
import Time from '../Utils/Time';
import Application from '../Application';
import Mouse from '../Utils/Mouse';
import Sizes from '../Utils/Sizes';

export class CameraKeyframeInstance {
    position: THREE.Vector3;
    focalPoint: THREE.Vector3;

    constructor(keyframe: CameraKeyframe) {
        this.position = keyframe.position;
        this.focalPoint = keyframe.focalPoint;
    }

    update() {}
}

const keys: { [key in CameraKey]: CameraKeyframe } = {
    idle: {
        position: new THREE.Vector3(-20000, 12000, 20000),
        focalPoint: new THREE.Vector3(0, -1000, 0),
    },
    monitor: {
        position: new THREE.Vector3(0, 950, 2000),
        focalPoint: new THREE.Vector3(0, 950, 0),
    },
    desk: {
        position: new THREE.Vector3(0, 1800, 5500),
        focalPoint: new THREE.Vector3(0, 500, 0),
    },
    loading: {
        position: new THREE.Vector3(-35000, 35000, 35000),
        focalPoint: new THREE.Vector3(0, -5000, 0),
    },
    orbitControlsStart: {
        position: new THREE.Vector3(-15000, 10000, 15000),
        focalPoint: new THREE.Vector3(-100, 350, 0),
    },
};

export class MonitorKeyframe extends CameraKeyframeInstance {
    application: Application;
    sizes: Sizes;
    targetPos: THREE.Vector3;
    origin: THREE.Vector3;

    constructor() {
        const keyframe = keys.monitor;
        super(keyframe);
        this.application = new Application();
        this.sizes = this.application.sizes;
        this.origin = new THREE.Vector3().copy(keyframe.position);
        this.targetPos = new THREE.Vector3().copy(keyframe.position);
    }

    update() {
        const aspect = this.sizes.height / this.sizes.width;
        const additionalZoom = this.sizes.width < 768 ? 0 : 600;
        this.targetPos.z = this.origin.z + aspect * 1200 - additionalZoom;
        this.position.copy(this.targetPos);
    }
}

export class LoadingKeyframe extends CameraKeyframeInstance {
    constructor() {
        const keyframe = keys.loading;
        super(keyframe);
    }

    update() {}
}

export class DeskKeyframe extends CameraKeyframeInstance {
    origin: THREE.Vector3;
    application: Application;
    mouse: Mouse;
    sizes: Sizes;
    targetFoc: THREE.Vector3;
    targetPos: THREE.Vector3;

    constructor() {
        const keyframe = keys.desk;
        super(keyframe);
        this.application = new Application();
        this.mouse = this.application.mouse;
        this.sizes = this.application.sizes;
        this.origin = new THREE.Vector3().copy(keyframe.position);
        this.targetFoc = new THREE.Vector3().copy(keyframe.focalPoint);
        this.targetPos = new THREE.Vector3().copy(keyframe.position);
    }

    update() {
        this.targetFoc.x +=
            (this.mouse.x - this.sizes.width / 2 - this.targetFoc.x) * 0.05;
        this.targetFoc.y +=
            (-(this.mouse.y - this.sizes.height) - this.targetFoc.y) * 0.05;

        this.targetPos.x +=
            (this.mouse.x - this.sizes.width / 2 - this.targetPos.x) * 0.025;
        this.targetPos.y +=
            (-(this.mouse.y - this.sizes.height * 2) - this.targetPos.y) *
            0.025;

        const aspect = this.sizes.height / this.sizes.width;
        // far enough back that the desk (about 4,600 wide around the CRT) fits across the screen:
        // this only changes anything on tall screens like phones
        const fit = 2300 / (Math.tan((35 / 2) * (Math.PI / 180)) / aspect);
        this.targetPos.z = Math.max(this.origin.z + aspect * 3000 - 1800, fit);

        this.focalPoint.copy(this.targetFoc);
        this.position.copy(this.targetPos);
        // that far back the chair is in the way: on tall screens look over it from higher up
        // and from a little to the left, which slides the chair (nearer the camera) out of the way
        if (aspect > 1.2) {
            const k = Math.min(1, aspect - 1.2);
            this.position.y += 2600 * k;
            this.position.x -= 1600 * k;
        }
    }
}

export class IdleKeyframe extends CameraKeyframeInstance {
    time: Time;
    origin: THREE.Vector3;
    sizes: Sizes;
    // looking around by dragging (Camera.ts): an extra turn about the room, eased, that drifts
    // back to the slow automatic sway a few seconds after the last drag
    yaw = 0;
    yawTarget = 0;
    lastDrag = 0;
    lastTick = 0;

    constructor() {
        const keyframe = keys.idle;
        super(keyframe);
        this.origin = new THREE.Vector3().copy(keyframe.position);
        this.time = new Time();
        this.sizes = new Application().sizes;
    }

    /** Turn by `radians` (from a drag). */
    turn(radians: number) {
        this.yawTarget += radians;
        this.lastDrag = performance.now();
    }

    update() {
        const now = performance.now();
        const dt = this.lastTick ? Math.min(0.1, (now - this.lastTick) / 1000) : 0;
        this.lastTick = now;
        // the slow sway from side to side
        const x = Math.sin((this.time.elapsed + 19000) * 0.00008) * this.origin.x;
        const y = Math.sin((this.time.elapsed + 1000) * 0.000004) * 4000 + this.origin.y - 3000;
        const z = this.origin.z;
        const f = this.focalPoint;
        const v = new THREE.Vector3(x - f.x, y - f.y, z - f.z);
        // the drag turn: keep the camera in front of the room (it's open on the front two sides)
        const sway = Math.atan2(v.x, v.z);
        const limit = (80 * Math.PI) / 180;
        this.yawTarget = Math.max(-limit - sway, Math.min(limit - sway, this.yawTarget));
        if (now - this.lastDrag > 6000) this.yawTarget *= Math.pow(0.5, dt / 1.5); // drift back
        this.yaw += (this.yawTarget - this.yaw) * Math.min(1, dt * 8);
        v.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
        // tall screens (phones, tablets held upright): step back so the whole room fits across
        const aspect = this.sizes ? this.sizes.width / this.sizes.height : 1.6;
        v.multiplyScalar(Math.max(1, 1.1 / aspect));
        this.position.copy(f).add(v);
    }
}

export class OrbitControlsStart extends CameraKeyframeInstance {
    constructor() {
        const keyframe = keys.orbitControlsStart;
        super(keyframe);
    }

    update() {}
}
