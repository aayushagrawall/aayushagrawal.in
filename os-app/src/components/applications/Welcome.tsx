import React, { useState } from 'react';
import Window from '../os/Window';

export interface WelcomeProps extends WindowAppProps {}

const TIPS = [
    <>Double-click <b>My Showcase</b> to read about me, my experience and my projects.</>,
    <>Open the <b>Terminal</b> and type <b>help</b>. Recruiters: try <b>sudo hire aayush</b>.</>,
    <>Bored? <b>Tetris</b> is on the desktop, and your best score is saved.</>,
    <>Want the one-page version? Double-click <b>Resume.pdf</b> to view or download it.</>,
    <>Leave the computer alone for a minute and the screensaver kicks in.</>,
    <>Something you shouldn't open is sitting in the <b>Recycle Bin</b>.</>,
    <>Windows move like the real thing: drag a title bar and an outline follows your mouse.</>,
    <>Keyboard fans: <b>Alt+W</b> switches windows, <b>Alt+M</b> minimises, <b>Alt+Q</b> closes, and arrow keys pick desktop icons.</>,
    <>Right-click the desktop and choose <b>Properties</b> to change the wallpaper.</>,
    <>Prefer a modern site? <b>My Website</b> opens aayushagrawal.codes.</>,
];

export const WELCOME_OFF_KEY = 'aayushos-welcome-off';

const Bulb = () => (
    <svg width="34" height="34" viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden>
        <path d="M16 3c-5.5 0-9 3.8-9 8.6 0 3.2 1.7 5.2 3.2 6.9 1 1.1 1.8 2.1 1.8 3.5h8c0-1.4.8-2.4 1.8-3.5 1.5-1.7 3.2-3.7 3.2-6.9C25 6.8 21.5 3 16 3z" fill="#ffef6e" stroke="#000" />
        <rect x="12" y="23" width="8" height="2" fill="#a0a0a0" stroke="#000" />
        <rect x="12" y="26" width="8" height="2" fill="#a0a0a0" stroke="#000" />
        <rect x="14" y="29" width="4" height="1" fill="#000" />
        <rect x="11" y="8" width="2" height="4" fill="#fff" />
    </svg>
);

// Windows 98-style "Welcome" tips dialog
const Welcome: React.FC<WelcomeProps> = (props) => {
    // lets Chai know to wait until the tips are closed
    React.useEffect(() => {
        (window as any).__aosWelcomeOpen = true;
        window.dispatchEvent(new Event('aos-welcome-change'));
        return () => {
            (window as any).__aosWelcomeOpen = false;
            window.dispatchEvent(new Event('aos-welcome-change'));
        };
    }, []);
    const [i, setI] = useState(0);
    const [show, setShow] = useState(() => {
        try {
            return localStorage.getItem(WELCOME_OFF_KEY) !== '1';
        } catch (e) {
            return true;
        }
    });

    const toggle = () => {
        const next = !show;
        setShow(next);
        try {
            localStorage.setItem(WELCOME_OFF_KEY, next ? '' : '1');
        } catch (e) {}
    };

    const left = Math.max(10, Math.round((window.innerWidth - 640) / 2));
    // in the 3D monitor, sit low so the name on the Showcase stays visible
    const top =
        window.parent !== window
            ? Math.max(10, window.innerHeight - 32 - 380 - 24)
            : Math.max(10, Math.round((window.innerHeight - 32 - 380) / 2));

    return (
        <Window
            top={top}
            left={left}
            width={640}
            height={380}
            windowBarIcon="computerSmall"
            windowTitle="Welcome"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText="Tip of the day"
        >
            <div style={styles.page}>
                <p style={styles.head}>
                    Welcome to <span style={styles.brand}>AayushOS</span>
                    <span style={styles.ver}>98</span>
                </p>
                <div style={styles.main}>
                    <div style={styles.tipbox}>
                        <div style={styles.did}>
                            <Bulb />
                            <p style={styles.didText}>Did you know...</p>
                        </div>
                        <p style={styles.tip}>{TIPS[i]}</p>
                    </div>
                    <div style={styles.btns}>
                        <button
                            className="site-button"
                            style={styles.button}
                            onMouseDown={() => window.postMessage({ type: 'aos-open', app: 'whatsnew' }, '*')}
                        >
                            What's New
                        </button>
                        <button className="site-button" style={styles.button} onMouseDown={() => setI((i + 1) % TIPS.length)}>
                            Next Tip
                        </button>
                        <button className="site-button" style={styles.button} onMouseDown={props.onClose}>
                            Close
                        </button>
                    </div>
                </div>
                <label style={styles.foot} onMouseDown={toggle}>
                    <span style={styles.check}>{show ? '✓' : ''}</span>
                    <span>Show this Welcome Screen next time you start AayushOS</span>
                </label>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    page: {
        position: 'absolute',
        inset: 0,
        flexDirection: 'column',
        background: '#c0c0c0',
        padding: '14px 18px 12px',
        boxSizing: 'border-box',
    },
    head: { margin: '0 0 14px', fontFamily: 'gastromond, serif', fontSize: 38, lineHeight: 1 },
    brand: { fontFamily: 'gastromond, serif' },
    ver: { color: '#ff6a1a', marginLeft: 8, fontFamily: 'gastromond, serif' },
    main: { gap: 14, flex: 1, minHeight: 0 },
    tipbox: {
        flex: 1,
        flexDirection: 'column',
        background: '#ffffe1',
        boxShadow: 'var(--border-field)',
        padding: '14px 16px',
    },
    did: { alignItems: 'center', gap: 10, marginBottom: 10 },
    didText: { margin: 0, fontFamily: 'MillenniumBold, serif', fontSize: 20 },
    tip: { margin: 0, fontSize: 18, lineHeight: 1.5 },
    btns: { flexDirection: 'column', gap: 8, width: 140 },
    button: { width: '100%', padding: '6px 10px', fontFamily: 'MSSerif', fontSize: 14 },
    foot: { alignItems: 'center', gap: 8, marginTop: 12, fontFamily: 'MSSerif', fontSize: 14, cursor: 'pointer', display: 'flex' },
    check: {
        width: 13,
        height: 13,
        background: '#fff',
        boxShadow: 'var(--border-field)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        lineHeight: 1,
        padding: 1,
    },
};

export default Welcome;
