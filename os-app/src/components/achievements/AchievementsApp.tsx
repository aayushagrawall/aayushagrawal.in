import React, { useEffect, useState } from 'react';
import Window from '../os/Window';
import { Icon } from '../general';
import { ACHIEVEMENTS, EXPLORER_APPS, READER_PAGES, counts, getUnlocked } from './list';

export interface AchievementsAppProps extends WindowAppProps {}

const AchievementsApp: React.FC<AchievementsAppProps> = (props) => {
    const [got, setGot] = useState<string[]>(getUnlocked());
    const [c, setC] = useState(counts());
    useEffect(() => {
        const refresh = () => {
            setGot(getUnlocked());
            setC(counts());
        };
        window.addEventListener('aos-achievements-changed', refresh);
        const t = setInterval(refresh, 1500); // explorer / reader progress
        return () => {
            window.removeEventListener('aos-achievements-changed', refresh);
            clearInterval(t);
        };
    }, []);

    const extra = (id: string) =>
        id === 'explorer' ? ` (${Math.min(c.apps, EXPLORER_APPS.length)}/${EXPLORER_APPS.length})` : id === 'reader' ? ` (${Math.min(c.pages, READER_PAGES.length)}/${READER_PAGES.length})` : '';

    return (
        <Window
            top={40}
            left={330}
            width={560}
            height={720}
            windowBarIcon="trophySmall"
            windowTitle="Achievements"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={`${got.length} of ${ACHIEVEMENTS.length} unlocked`}
        >
            <div style={styles.page}>
                <div style={styles.head}>
                    <Icon icon="trophyIcon" size={48} style={{ width: 48, height: 48 }} />
                    <div style={{ flexDirection: 'column' }}>
                        <h2 style={styles.h2}>Achievements</h2>
                        <p style={styles.sub}>Saved in this browser. How many can you find?</p>
                    </div>
                </div>
                <div style={styles.meter}>
                    <div style={{ ...styles.fill, width: `${(got.length / ACHIEVEMENTS.length) * 100}%` }} />
                </div>
                <div style={styles.list}>
                    {ACHIEVEMENTS.map((a) => {
                        const on = got.includes(a.id);
                        return (
                            <div key={a.id} style={{ ...styles.row, ...(on ? {} : styles.locked) }}>
                                <Icon icon={on ? 'trophyIcon' : 'trophySmall'} size={on ? 32 : 16} style={on ? styles.icon : styles.iconLocked} />
                                <div style={{ flexDirection: 'column' }}>
                                    <p style={styles.title}>{on ? a.title : a.title + extra(a.id)}</p>
                                    <p style={styles.desc}>{on ? a.done : a.hint}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    page: { position: 'absolute', inset: 0, flexDirection: 'column', background: '#c0c0c0', padding: 14, boxSizing: 'border-box' },
    head: { gap: 12, alignItems: 'center', marginBottom: 10 },
    h2: { fontSize: 26 },
    sub: { margin: '2px 0 0', fontSize: 15 },
    meter: { height: 18, background: '#fff', boxShadow: 'var(--border-field)', padding: 3, marginBottom: 10 },
    fill: { background: 'repeating-linear-gradient(90deg, #0000a3 0 12px, transparent 12px 14px)' },
    list: { flexDirection: 'column', overflowY: 'auto', flex: 1, background: '#fff', boxShadow: 'var(--border-field)', padding: 6 },
    row: { gap: 12, alignItems: 'center', padding: '6px 8px', borderBottom: '1px dotted #c0c0c0' },
    locked: { opacity: 0.55 },
    icon: { width: 32, height: 32, flexShrink: 0 },
    iconLocked: { width: 16, height: 16, margin: '0 8px', flexShrink: 0, filter: 'grayscale(1)' },
    title: { margin: 0, fontFamily: 'MillenniumBold, serif', fontSize: 17 },
    desc: { margin: '1px 0 0', fontSize: 15 },
};

export default AchievementsApp;
