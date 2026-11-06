import React, { useEffect, useState } from 'react';
import Window from '../os/Window';
import { Icon } from '../general';

export interface ThisComputerProps extends WindowAppProps {}

const BOOTED_AT = Date.now();

const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return (h ? h + 'h ' : '') + (h || m ? m + 'm ' : '') + (s % 60) + 's';
};

const FACTS: [string, string][] = [
    ['Processor', 'Curiosity @ 3.0 GHz'],
    ['Memory', 'Too many open tabs'],
    ['Storage', 'GitHub, mostly'],
    ['Fuel', 'Chai, 240 ml'],
    ['Location', 'Bangalore, India'],
];

// System Properties-style window with a live uptime counter
const ThisComputer: React.FC<ThisComputerProps> = (props) => {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <Window
            top={90}
            left={380}
            width={520}
            height={540}
            windowBarIcon="computerSmall"
            windowTitle="This Computer"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText="System Properties"
        >
            <div style={styles.page}>
                <Icon icon="computerBig" size={96} style={styles.icon} />
                <h2 style={styles.title}>AayushOS 98</h2>
                <p style={styles.line}>Bangalore Edition · Build 2026.11</p>
                <p style={styles.muted}>Registered to: Aayush Agrawal</p>
                <div style={styles.facts}>
                    {[...FACTS, ['Uptime', fmt(now - BOOTED_AT)] as [string, string]].map(([k, v]) => (
                        <div key={k} style={styles.row}>
                            <p style={styles.key}>{k}</p>
                            <p style={styles.val}>{v}</p>
                        </div>
                    ))}
                </div>
                <div style={styles.buttons}>
                    <button className="site-button" style={styles.button} onMouseDown={() => window.postMessage({ type: 'aos-open', app: 'credits' }, '*')}>
                        Credits
                    </button>
                    <button className="site-button" style={styles.button} onMouseDown={props.onClose}>
                        OK
                    </button>
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    page: {
        position: 'absolute',
        inset: 0,
        flexDirection: 'column',
        alignItems: 'center',
        background: '#c0c0c0',
        padding: '20px 24px',
        boxSizing: 'border-box',
    },
    icon: { width: 96, height: 96, marginBottom: 8 },
    title: { fontSize: 30, marginTop: 4 },
    line: { margin: '6px 0 0' },
    muted: { margin: '4px 0 12px', color: '#444', fontSize: 16 },
    facts: {
        flexDirection: 'column',
        width: '100%',
        maxWidth: 380,
        padding: '10px 14px',
        background: '#fff',
        boxShadow: 'var(--border-field)',
        boxSizing: 'border-box',
    },
    row: { justifyContent: 'space-between', padding: '3px 0' },
    key: { margin: 0, fontFamily: 'MillenniumBold, serif', fontSize: 16 },
    val: { margin: 0, fontSize: 16 },
    buttons: { gap: 10, marginTop: 'auto', alignSelf: 'flex-end' },
    button: { minWidth: 90, padding: '6px 12px', fontFamily: 'MSSerif', fontSize: 14 },
};

export default ThisComputer;
