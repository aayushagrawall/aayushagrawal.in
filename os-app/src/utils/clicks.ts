import { isMuted } from './sound';
import { IN_MONITOR } from './night';

/**
 * Mouse and keyboard clicks, the same recordings the 3D room plays.
 *
 * Opened on its own (aayushagrawal.in/os/), AayushOS plays them itself. Inside the 3D
 * monitor the room plays them in 3D space, so here we only pass along input from apps
 * in iframes (Terminal, Tetris, Paint), which the room can't hear directly.
 * Those apps report input with { type: 'aos-input', kind: 'down' | 'up' | 'key', key }.
 */
const FILES: { [k: string]: string } = {
    down: '/audio/mouse/mouse_down.mp3',
    up: '/audio/mouse/mouse_up.mp3',
    key1: '/audio/keyboard/key_1.mp3',
    key2: '/audio/keyboard/key_2.mp3',
    key3: '/audio/keyboard/key_3.mp3',
    key4: '/audio/keyboard/key_4.mp3',
    key5: '/audio/keyboard/key_5.mp3',
    key6: '/audio/keyboard/key_6.mp3',
};

let ctx: AudioContext | null = null;
const buffers: { [k: string]: AudioBuffer | null } = {};
let lastKey = '';

// Decode up front with an offline context (no autoplay warnings); the buffers work in
// the real AudioContext, which is only created on the first click or key press.
const prefetch = () => {
    const OAC = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    if (!OAC) return;
    const decoder = new OAC(1, 1, 44100) as OfflineAudioContext;
    Object.keys(FILES).forEach((k) => {
        fetch(FILES[k])
            .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
            .then((ab) => decoder.decodeAudioData(ab))
            .then((b) => (buffers[k] = b))
            .catch(() => (buffers[k] = null));
    });
};

const ensureContext = () => {
    if (ctx) return ctx;
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC() as AudioContext;
    return ctx;
};

const play = (name: string, volume: number) => {
    if (isMuted()) return;
    const c = ensureContext();
    const b = buffers[name];
    if (!c || !b) return;
    if (c.state === 'suspended') c.resume();
    const src = c.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = 0.96 + Math.random() * 0.08;
    const g = c.createGain();
    g.gain.value = volume;
    src.connect(g).connect(c.destination);
    src.start();
};

const sound = (kind: string, key?: string) => {
    if (kind === 'down') play('down', 0.5);
    else if (kind === 'up') play('up', 0.5);
    else if (kind === 'key') {
        if (key && key === lastKey) return; // held keys repeat; real keyboards don't
        lastKey = key || '';
        play('key' + (1 + Math.floor(Math.random() * 6)), 0.45);
    } else if (kind === 'keyup') lastKey = '';
};

export const initClicks = () => {
    if (IN_MONITOR) {
        // relay input from iframe apps to the 3D room, in the format it already understands
        window.addEventListener('message', (e) => {
            const d = e.data;
            if (!d || d.type !== 'aos-input') return;
            const type = d.kind === 'down' ? 'mousedown' : d.kind === 'up' ? 'mouseup' : d.kind === 'key' ? 'keydown' : d.kind === 'keyup' ? 'keyup' : '';
            if (type) window.parent.postMessage({ type, key: d.key }, '*');
        });
        return;
    }
    prefetch();
    window.addEventListener('mousedown', () => sound('down'), true);
    window.addEventListener('mouseup', () => sound('up'), true);
    window.addEventListener('keydown', (e) => !e.repeat && sound('key', e.key), true);
    window.addEventListener('keyup', () => sound('keyup'), true);
    window.addEventListener('message', (e) => {
        const d = e.data;
        if (d && d.type === 'aos-input') sound(d.kind, d.key);
    });
};
