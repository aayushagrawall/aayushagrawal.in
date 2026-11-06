import * as THREE from 'three';

export default class BakedModel {
    model: LoadedModel;
    texture: LoadedTexture;
    material: THREE.MeshBasicMaterial;

    constructor(model: LoadedModel, texture: LoadedTexture, scale?: number) {
        this.model = model;
        this.texture = texture;

        this.texture.flipY = false;
        this.texture.encoding = THREE.sRGBEncoding;

        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
        });

        this.model.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                BakedModel.dequantize(child.geometry);
                // multiply rather than set: compressed (quantized) models carry their own
                // node scale and offset, which must be kept and scaled up with the mesh
                if (scale) {
                    child.scale.multiplyScalar(scale);
                    child.position.multiplyScalar(scale);
                }
                child.material.map = this.texture;
                child.material = this.material;
            }
        });

        return this;
    }

    /**
     * The models are stored quantized (16-bit integers) to download faster. This three.js
     * version draws those fine but its ray-casting reads the raw integers, and the desk
     * objects are placed by ray-casting, so turn the attributes back into floats once.
     */
    static dequantize(geometry: THREE.BufferGeometry) {
        for (const name of Object.keys(geometry.attributes)) {
            const attr = geometry.attributes[name] as THREE.BufferAttribute;
            const arr = attr.array as any;
            if (arr instanceof Float32Array) continue;
            const max =
                arr instanceof Int8Array ? 127 : arr instanceof Uint8Array ? 255 : arr instanceof Int16Array ? 32767 : arr instanceof Uint16Array ? 65535 : 1;
            const out = new Float32Array(attr.count * attr.itemSize);
            const isInterleaved = (attr as any).isInterleavedBufferAttribute;
            for (let i = 0; i < attr.count; i++) {
                for (let c = 0; c < attr.itemSize; c++) {
                    const raw = isInterleaved
                        ? (attr as any).data.array[i * (attr as any).data.stride + (attr as any).offset + c]
                        : arr[i * attr.itemSize + c];
                    out[i * attr.itemSize + c] = attr.normalized ? Math.max(raw / max, -1) : raw;
                }
            }
            geometry.setAttribute(name, new THREE.BufferAttribute(out, attr.itemSize));
        }
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
    }

    getModel(): THREE.Group {
        return this.model.scene;
    }
}
