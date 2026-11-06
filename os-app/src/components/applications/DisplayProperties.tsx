import React, { useState } from 'react';
import Window from '../os/Window';
import { WALLPAPERS, defaultWallpaper, saveWallpaper, savedWallpaperId } from '../../utils/wallpaper';
import { crtOn, setCrt } from '../../utils/crt';
import { IN_MONITOR } from '../../utils/night';

export interface DisplayPropertiesProps extends WindowAppProps {}

// Win98 "Display Properties" with a wallpaper picker and a little monitor preview
const DisplayProperties: React.FC<DisplayPropertiesProps> = (props) => {
    const [sel, setSel] = useState(savedWallpaperId());
    const [crt, setCrtState] = useState(crtOn());
    const apply = () => {
        saveWallpaper(sel);
        if (crt !== crtOn()) setCrt(crt);
    };
    const shownId = sel === 'auto' ? defaultWallpaper() : sel;
    const current = WALLPAPERS.find((w) => w.id === shownId) || WALLPAPERS[0];
    const options = [{ id: 'auto', name: 'Automatic (night after 7 pm IST)' }, ...WALLPAPERS];
    const left = Math.max(10, Math.round((window.innerWidth - 440) / 2));

    return (
        <Window
            top={80}
            left={left}
            width={440}
            height={560}
            windowBarIcon="computerSmall"
            windowTitle="Display Properties"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText="Background"
        >
            <div style={styles.page}>
                <div style={styles.monitor}>
                    <div style={styles.screen}>
                        <div style={{ ...styles.preview, ...current.css }} />
                    </div>
                    <div style={styles.stand} />
                </div>
                <p style={styles.label}>Wallpaper</p>
                <div style={styles.list}>
                    {options.map((w) => (
                        <p
                            key={w.id}
                            style={{ ...styles.item, ...(w.id === sel ? styles.itemSel : {}) }}
                            onMouseDown={() => setSel(w.id)}
                            onDoubleClick={() => {
                                saveWallpaper(w.id);
                                props.onClose();
                            }}
                        >
                            {w.name}
                        </p>
                    ))}
                </div>
                {!IN_MONITOR && (
                    // inside the 3D monitor the room draws the CRT look itself
                    <label style={styles.check} onMouseDown={() => setCrtState(!crt)}>
                        <span style={styles.box}>{crt ? '✓' : ''}</span>
                        Vintage CRT effect (static, scanlines and glass)
                    </label>
                )}
                <div style={styles.btns}>
                    <button
                        className="site-button"
                        style={styles.btn}
                        onMouseDown={() => {
                            apply();
                            props.onClose();
                        }}
                    >
                        OK
                    </button>
                    <button className="site-button" style={styles.btn} onMouseDown={props.onClose}>
                        Cancel
                    </button>
                    <button className="site-button" style={styles.btn} onMouseDown={apply}>
                        Apply
                    </button>
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    page: { position: 'absolute', inset: 0, flexDirection: 'column', alignItems: 'center', background: '#c0c0c0', padding: 16, boxSizing: 'border-box' },
    monitor: { flexDirection: 'column', alignItems: 'center', marginBottom: 14 },
    screen: { width: 200, height: 150, background: '#c0c0c0', boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)', padding: 12 },
    preview: { flex: 1, boxShadow: 'var(--border-field)' },
    stand: { width: 80, height: 14, background: '#a0a0a0', boxShadow: 'var(--border-raised-outer)' },
    label: { alignSelf: 'flex-start', margin: '0 0 4px', fontFamily: 'MSSerif', fontSize: 14 },
    list: { flexDirection: 'column', alignSelf: 'stretch', background: '#fff', boxShadow: 'var(--border-field)', padding: 3, flex: 1, overflowY: 'auto' },
    item: { margin: 0, padding: '3px 6px', fontFamily: 'MSSerif', fontSize: 14, cursor: 'pointer' },
    itemSel: { background: '#0000a3', color: '#fff' },
    check: { display: 'flex', alignSelf: 'flex-start', alignItems: 'center', gap: 8, marginTop: 12, fontFamily: 'MSSerif', fontSize: 14, cursor: 'pointer', userSelect: 'none' },
    box: { display: 'inline-flex', flexShrink: 0, width: 13, height: 13, background: '#fff', boxShadow: 'var(--border-field)', fontSize: 12, lineHeight: '13px', justifyContent: 'center', fontFamily: 'sans-serif' },
    btns: { gap: 8, alignSelf: 'flex-end', marginTop: 12 },
    btn: { minWidth: 76, padding: '5px 10px', fontFamily: 'MSSerif', fontSize: 14 },
};

export default DisplayProperties;
