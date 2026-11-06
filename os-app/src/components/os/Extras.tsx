import React, { useEffect, useRef, useState } from 'react';

/**
 * Desktop extras carried over from AayushOS Lite:
 *  - a starfield screensaver with a bouncing logo after a minute of no input
 *  - the Konami code (↑ ↑ ↓ ↓ ← → ← → B A): confetti, then a message box
 * Apps running in iframes report input with { type: 'aos-activity' } messages.
 */
const IDLE_MS = 60000;
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const CONFETTI = ['#ff6a1a', '#f6c94d', '#00c8e6', '#a347d6', '#3cbf4a', '#e5393b', '#2f5fe0', '#ffffff'];

export interface ExtrasProps {
    onKonami: () => void;
}

const Extras: React.FC<ExtrasProps> = ({ onKonami }) => {
    const [saver, setSaver] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const confettiRef = useRef<HTMLCanvasElement>(null);
    const [confetti, setConfetti] = useState(0);
    const konamiCb = useRef(onKonami);
    konamiCb.current = onKonami;

    // idle detection
    useEffect(() => {
        let t: ReturnType<typeof setTimeout>;
        const poke = () => {
            setSaver(false);
            clearTimeout(t);
            t = setTimeout(() => setSaver(true), IDLE_MS);
        };
        const onMsg = (e: MessageEvent) => {
            if (e.data && (e.data.type === 'aos-activity' || e.data.type === 'aos-focus')) poke();
        };
        const evs = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'];
        evs.forEach((ev) => window.addEventListener(ev, poke, { passive: true }));
        window.addEventListener('message', onMsg);
        poke();
        return () => {
            clearTimeout(t);
            evs.forEach((ev) => window.removeEventListener(ev, poke));
            window.removeEventListener('message', onMsg);
        };
    }, []);

    // starfield + bouncing logo
    useEffect(() => {
        if (!saver) return;
        const cv = canvasRef.current!;
        const logo = logoRef.current!;
        const cx = cv.getContext('2d')!;
        cv.width = window.innerWidth;
        cv.height = window.innerHeight;
        const w = cv.width;
        const h = cv.height;
        const stars = Array.from({ length: 260 }, () => ({
            x: (Math.random() - 0.5) * w,
            y: (Math.random() - 0.5) * h,
            z: Math.random() * w,
        }));
        let lx = 80, ly = 80, vx = 1.6, vy = 1.2, raf = 0;
        const frame = () => {
            cx.fillStyle = '#000';
            cx.fillRect(0, 0, w, h);
            cx.fillStyle = '#fff';
            for (const s of stars) {
                s.z -= 6;
                if (s.z <= 1) {
                    s.x = (Math.random() - 0.5) * w;
                    s.y = (Math.random() - 0.5) * h;
                    s.z = w;
                }
                const k = 160 / s.z;
                const px = s.x * k + w / 2;
                const py = s.y * k + h / 2;
                if (px < 0 || px > w || py < 0 || py > h) {
                    s.z = w;
                    continue;
                }
                const r = Math.max(0.6, 2.6 * (1 - s.z / w));
                cx.fillRect(px, py, r, r);
            }
            const lw = logo.offsetWidth;
            const lh = logo.offsetHeight;
            lx += vx;
            ly += vy;
            if (lx <= 0 || lx + lw >= w) vx = -vx;
            if (ly <= 0 || ly + lh >= h) vy = -vy;
            logo.style.transform = `translate(${lx}px, ${ly}px)`;
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [saver]);

    // Konami code
    useEffect(() => {
        let i = 0;
        const onKey = (e: KeyboardEvent) => {
            const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            i = k === KONAMI[i] ? i + 1 : k === KONAMI[0] ? 1 : 0;
            if (i === KONAMI.length) {
                i = 0;
                setConfetti((n) => n + 1);
                setTimeout(() => konamiCb.current(), 400);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // confetti burst
    useEffect(() => {
        if (!confetti) return;
        const c = confettiRef.current!;
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        const g = c.getContext('2d')!;
        const bits = Array.from({ length: 220 }, (_, n) => ({
            x: c.width / 2,
            y: c.height / 2,
            vx: (Math.random() - 0.5) * 22,
            vy: -Math.random() * 20 - 4,
            s: 4 + Math.random() * 6,
            c: CONFETTI[n % CONFETTI.length],
            r: Math.random() * 6,
        }));
        const t0 = performance.now();
        let raf = 0;
        const tick = (t: number) => {
            g.clearRect(0, 0, c.width, c.height);
            for (const b of bits) {
                b.vy += 0.55;
                b.vx *= 0.99;
                b.x += b.vx;
                b.y += b.vy;
                b.r += 0.2;
                g.fillStyle = b.c;
                g.save();
                g.translate(b.x, b.y);
                g.rotate(b.r);
                g.fillRect(-b.s / 2, -b.s / 2, b.s, b.s);
                g.restore();
            }
            if (t - t0 < 4200) raf = requestAnimationFrame(tick);
            else g.clearRect(0, 0, c.width, c.height);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [confetti]);

    return (
        <>
            <canvas ref={confettiRef} style={styles.confetti} />
            {saver && (
                <div style={styles.saver} onMouseDown={() => setSaver(false)}>
                    <canvas ref={canvasRef} style={styles.canvas} />
                    <div ref={logoRef} style={styles.logo}>
                        <span style={styles.mark}>A</span>
                        <span style={styles.logoText}>
                            AayushOS <span style={styles.ver}>98</span>
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

const styles: StyleSheetCSS = {
    confetti: { position: 'fixed', inset: 0, zIndex: 200001, pointerEvents: 'none' },
    saver: { position: 'fixed', inset: 0, zIndex: 200000, background: '#000', cursor: 'none' },
    canvas: { position: 'absolute', inset: 0 },
    logo: { position: 'absolute', left: 0, top: 0, alignItems: 'center', gap: 14, willChange: 'transform' },
    mark: {
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ff6a1a',
        color: '#fff',
        fontFamily: 'gastromond, serif',
        fontSize: 42,
    },
    logoText: { color: '#fff', fontFamily: 'gastromond, serif', fontSize: 40 },
    ver: { color: '#ff6a1a', fontFamily: 'gastromond, serif' },
};

export default Extras;
