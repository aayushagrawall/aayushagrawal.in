import AudioManager from './AudioManager';
import * as THREE from 'three';
import UIEventBus from '../UI/EventBus';
import { Vector3 } from 'three';
import { getWeather } from '../Utils/weather';

export class AudioSource {
    manager: AudioManager;

    constructor(manager: AudioManager) {
        this.manager = manager;
    }

    update() {}
}
export class ComputerAudio extends AudioSource {
    lastKey: string;

    constructor(manager: AudioManager) {
        super(manager);

        document.addEventListener('mousedown', (event) => {
            // @ts-ignore
            if (event.inComputer) {
                this.manager.playAudio('mouseDown', {
                    volume: 0.8,
                    position: new THREE.Vector3(800, -300, 1200),
                });
            }
        });

        document.addEventListener('mouseup', (event) => {
            // @ts-ignore
            if (event.inComputer) {
                this.manager.playAudio('mouseUp', {
                    volume: 0.8,
                    position: new THREE.Vector3(800, -300, 1200),
                });
            }
        });

        document.addEventListener('keyup', (event) => {
            // @ts-ignore
            if (event.inComputer) {
                this.lastKey = '';
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key.includes('_AUTO_')) {
                this.manager.playAudio('ccType', {
                    volume: 0.1,
                    randDetuneScale: 0,
                    pitch: 20,
                });
                return;
            }
            if (this.lastKey === event.key) return;
            this.lastKey = event.key;

            // @ts-ignore
            if (event.inComputer) {
                this.manager.playAudio('keyboardKeydown', {
                    volume: 0.8,
                    position: new THREE.Vector3(-300, -400, 1200),
                });
            }
        });
    }
}

export class AmbienceAudio extends AudioSource {
    poolKey: string;

    constructor(manager: AudioManager) {
        super(manager);
        UIEventBus.on('loadingScreenDone', () => {
            this.poolKey = this.manager.playAudio('office', {
                volume: 1,
                loop: true,
                randDetuneScale: 0,
                filter: {
                    type: 'lowpass',
                    frequency: 1000,
                },
            });
            this.manager.playAudio('startup', {
                volume: 0.4,
                randDetuneScale: 0,
            });
        });
    }

    mapValues(
        input: number,
        input_start: number,
        input_end: number,
        output_start: number,
        output_end: number
    ) {
        return (
            output_start +
            ((output_end - output_start) / (input_end - input_start)) *
                (input - input_start)
        );
    }

    update() {
        const cameraPosition =
            this.manager.application.camera.instance.position;
        const y = cameraPosition.y;
        const x = cameraPosition.x;
        const z = cameraPosition.z;

        // calculate distance to origin
        const distance = Math.sqrt(x * x + y * y + z * z);

        const freq = this.mapValues(distance, 0, 10000, 100, 22000);

        const volume = this.mapValues(distance, 1200, 10000, 0, 0.2);
        const volumeClamped = Math.min(Math.max(volume, 0.05), 0.1);

        this.manager.setAudioFilterFrequency(this.poolKey, freq - 3000);
        this.manager.setAudioVolume(this.poolKey, volumeClamped);
    }
}

/**
 * Rain on the window when it's raining in Bangalore right now (live weather from
 * Open-Meteo). Force it with ?rain=1 or turn it off with ?rain=0. The loop is only
 * downloaded when it's needed. set() turns it on and off (clicking the window, see
 * World/Toys.ts), fading in and out; every change is announced as a 'rain' event so the
 * window can show it.
 */
export class RainAudio extends AudioSource {
    poolKey: string;
    on = false;
    loading = false;
    static VOLUME = 0.35;

    constructor(manager: AudioManager) {
        super(manager);
        UIEventBus.on('loadingScreenDone', () => {
            const q = new URLSearchParams(window.location.search).get('rain');
            if (q === '0') return;
            if (q === '1') return this.set(true);
            getWeather().then((w) => w && w.rain && this.set(true));
        });
    }

    set(on: boolean) {
        if (on === this.on) return;
        this.on = on;
        UIEventBus.dispatch('rain', on);
        const playing = this.poolKey && this.manager.audioPool[this.poolKey];
        if (on) {
            if (playing) return this.fade(RainAudio.VOLUME);
            const play = () => {
                if (!this.on) return;
                this.poolKey = this.manager.playAudio('rain', {
                    volume: 0.001,
                    loop: true,
                    randDetuneScale: 0,
                    filter: { type: 'lowpass', frequency: 2400 },
                });
                this.fade(RainAudio.VOLUME);
            };
            if (this.manager.loadedAudio['rain']) return play();
            if (this.loading) return;
            this.loading = true;
            new THREE.AudioLoader().load('audio/atmosphere/rain.mp3', (buffer) => {
                this.loading = false;
                this.manager.loadedAudio['rain'] = buffer as any;
                play();
            });
        } else if (playing) {
            this.fade(0.0001);
            const key = this.poolKey;
            setTimeout(() => {
                const a = this.manager.audioPool[key];
                if (!this.on && a) {
                    a.stop();
                    delete this.manager.audioPool[key];
                    if (this.poolKey === key) this.poolKey = '';
                }
            }, 2500);
        }
    }

    fade(volume: number) {
        const a = this.manager.audioPool[this.poolKey];
        if (!a) return;
        a.gain.gain.setTargetAtTime(volume, a.context.currentTime, 0.5);
    }
}
