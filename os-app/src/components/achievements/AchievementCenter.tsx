import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../general';
import { ACHIEVEMENTS, Achievement, achieve, getUnlocked, record, seenApp, seenPage } from './list';

/**
 * Listens for achievement messages, saves them and shows a toast for new ones.
 *  { type: 'aos-achieve', id }   unlock an achievement
 *  { type: 'aos-opened', app }   an app window was opened ("Explorer")
 *  { type: 'aos-page', path }    a Showcase page was shown ("Background Check")
 */
const AchievementCenter: React.FC = () => {
    const [queue, setQueue] = useState<Achievement[]>([]);
    const [shown, setShown] = useState<Achievement | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        const unlock = (id: string) => {
            if (!record(id)) return;
            const a = ACHIEVEMENTS.find((x) => x.id === id)!;
            setQueue((q) => [...q, a]);
            window.dispatchEvent(new Event('aos-achievements-changed'));
            const others = ACHIEVEMENTS.filter((x) => x.id !== 'all').map((x) => x.id);
            const got = getUnlocked();
            if (others.every((x) => got.includes(x))) setTimeout(() => achieve('all'), 600);
        };
        const onMsg = (e: MessageEvent) => {
            const d = e.data;
            if (!d || typeof d !== 'object') return;
            if (d.type === 'aos-achieve') unlock(String(d.id));
            if (d.type === 'aos-opened' && seenApp(String(d.app))) unlock('explorer');
            if (d.type === 'aos-page' && seenPage(String(d.path))) unlock('reader');
        };
        window.addEventListener('message', onMsg);

        // Night Owl: midnight to 5 am in Bangalore
        const now = new Date();
        const ist = (now.getUTCHours() + now.getUTCMinutes() / 60 + 5.5) % 24;
        const night = ist < 5 ? setTimeout(() => unlock('night'), 6000) : undefined;
        return () => {
            window.removeEventListener('message', onMsg);
            if (night) clearTimeout(night);
        };
    }, []);

    // show queued toasts one at a time
    useEffect(() => {
        if (shown || !queue.length) return;
        setShown(queue[0]);
        setQueue((q) => q.slice(1));
        timer.current = setTimeout(() => setShown(null), 4200);
    }, [queue, shown]);

    useEffect(() => () => timer.current && clearTimeout(timer.current), []);

    if (!shown) return null;
    return (
        <div
            style={styles.toast}
            onMouseDown={() => {
                setShown(null);
                window.postMessage({ type: 'aos-open', app: 'achievements' }, '*');
            }}
        >
            <div style={styles.bar}>
                <Icon icon="trophySmall" size={16} style={{ width: 16, height: 16 }} />
                <p style={styles.barText}>Achievement unlocked!</p>
            </div>
            <div style={styles.body}>
                <Icon icon="trophyIcon" size={32} style={{ width: 32, height: 32, flexShrink: 0 }} />
                <div style={styles.text}>
                    <p style={styles.title}>{shown.title}</p>
                    <p style={styles.desc}>{shown.done}</p>
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    toast: {
        position: 'fixed',
        top: 14,
        right: 14,
        zIndex: 150000,
        width: 300,
        flexDirection: 'column',
        background: '#c0c0c0',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        padding: 3,
        cursor: 'pointer',
        animation: 'aos-toast-in 0.25s steps(5)',
    },
    bar: { background: '#0000a3', alignItems: 'center', gap: 6, padding: '3px 4px' },
    barText: { margin: 0, color: '#fff', fontFamily: 'lores-15-bold-alt-oakland, MSSerif', fontSize: 13 },
    body: { gap: 10, padding: '10px 8px 8px', alignItems: 'center' },
    text: { flexDirection: 'column' },
    title: { margin: 0, fontFamily: 'MillenniumBold, serif', fontSize: 18 },
    desc: { margin: '2px 0 0', fontSize: 15 },
};

export default AchievementCenter;
