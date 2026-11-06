import React, { useEffect, useState } from 'react';

/**
 * Shown when /os/ is opened directly (inside the 3D monitor the scene has its own
 * BIOS screen). Browsers only allow sound after a click, so it waits for one,
 * plays the startup chime and runs a Win98-style progress bar.
 */
export interface BootScreenProps {
    onDone: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onDone }) => {
    const [phase, setPhase] = useState<'wait' | 'boot' | 'fade'>('wait');

    const start = () => {
        if (phase !== 'wait') return;
        setPhase('boot');
        try {
            const a = new Audio(`${process.env.PUBLIC_URL}/sounds/startup.mp3`);
            a.volume = 0.6;
            a.play().catch(() => {});
        } catch (e) {}
    };

    useEffect(() => {
        if (phase === 'wait') {
            const onKey = () => start();
            window.addEventListener('keydown', onKey);
            return () => window.removeEventListener('keydown', onKey);
        }
        if (phase === 'boot') {
            const t = setTimeout(() => setPhase('fade'), 1800);
            return () => clearTimeout(t);
        }
        const t = setTimeout(onDone, 350);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    return (
        <div style={{ ...styles.screen, ...(phase === 'fade' ? { opacity: 0 } : {}) }} onMouseDown={start}>
            <div style={styles.logo}>
                <span style={styles.mark}>A</span>
                <div style={{ flexDirection: 'column' }}>
                    <p style={styles.title}>
                        AayushOS <span style={styles.ver}>98</span>
                    </p>
                    <p style={styles.sub}>Bangalore Edition</p>
                </div>
            </div>
            {phase === 'wait' ? (
                <p className="boot-blink" style={styles.prompt}>
                    Click anywhere or press any key to start
                </p>
            ) : (
                <>
                    <div style={styles.bar}>
                        <div className="boot-fill" style={styles.fill} />
                    </div>
                    <p style={styles.prompt}>Starting AayushOS...</p>
                </>
            )}
        </div>
    );
};

const styles: StyleSheetCSS = {
    screen: {
        position: 'fixed',
        inset: 0,
        zIndex: 300000,
        background: '#000',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'opacity 0.35s steps(4)',
    },
    logo: { alignItems: 'center', gap: 18, marginBottom: 46 },
    mark: {
        width: 84,
        height: 84,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ff6a1a',
        color: '#fff',
        fontFamily: 'gastromond, serif',
        fontSize: 60,
    },
    title: { margin: 0, color: '#fff', fontFamily: 'gastromond, serif', fontSize: 56, lineHeight: 1 },
    ver: { color: '#ff6a1a', fontFamily: 'gastromond, serif' },
    sub: { margin: '6px 0 0', color: '#bbb', fontFamily: 'MSSerif', fontSize: 16, letterSpacing: 2 },
    bar: { width: 300, height: 18, border: '2px solid #888', padding: 2, marginBottom: 14 },
    fill: { height: '100%' },
    prompt: { margin: 0, color: '#ccc', fontFamily: 'MSSerif', fontSize: 16 },
};

export default BootScreen;
