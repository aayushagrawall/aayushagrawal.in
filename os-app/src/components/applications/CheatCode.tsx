import React from 'react';
import Window from '../os/Window';

export interface CheatCodeProps extends WindowAppProps {}

// The message box shown after the Konami code
const CheatCode: React.FC<CheatCodeProps> = (props) => {
    const left = Math.max(10, Math.round((window.innerWidth - 480) / 2));
    const top = Math.max(10, Math.round((window.innerHeight - 32 - 280) / 2));
    return (
        <Window
            top={top}
            left={left}
            width={480}
            height={280}
            windowBarIcon="windowGameIcon"
            windowTitle="Cheat Code Accepted"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText="Konami code"
        >
            <div style={styles.page}>
                <div style={styles.row}>
                    <svg width="40" height="40" viewBox="0 0 32 32" shapeRendering="crispEdges" style={{ flexShrink: 0 }} aria-hidden>
                        <circle cx="16" cy="16" r="13" fill="#fff" stroke="#000" />
                        <rect x="15" y="13" width="3" height="11" fill="#000080" />
                        <rect x="15" y="8" width="3" height="3" fill="#000080" />
                    </svg>
                    <p style={styles.text}>
                        +30 lives. Unlimited White. You clearly know your classics, so you'd probably get along with me.
                        Say hi from the Contact page!
                    </p>
                </div>
                <div style={styles.btns}>
                    <button
                        className="site-button"
                        style={styles.button}
                        onMouseDown={() => {
                            window.postMessage({ type: 'aos-open', app: 'showcase', route: '/contact' }, '*');
                            props.onClose();
                        }}
                    >
                        Say hi
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
        background: '#c0c0c0',
        padding: '18px 20px 14px',
        boxSizing: 'border-box',
    },
    row: { gap: 16, alignItems: 'flex-start', flex: 1 },
    text: { margin: 0, fontSize: 18, lineHeight: 1.45 },
    btns: { gap: 10, justifyContent: 'center' },
    button: { minWidth: 90, padding: '6px 12px', fontFamily: 'MSSerif', fontSize: 14 },
};

export default CheatCode;
