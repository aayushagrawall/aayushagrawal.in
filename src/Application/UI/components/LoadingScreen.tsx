import React, { useCallback, useEffect, useRef, useState } from 'react';
import eventBus from '../EventBus';
import { TOUCH } from '../../config';

type LoadingProps = {};

/**
 * Why this device might be better off skipping the 3D room, or '' if it looks fine:
 * the visitor asked for reduced motion, or the browser is drawing WebGL in software,
 * or the device reports very little memory / very few CPU cores.
 */
/** The visitor's own hardware, for the BIOS screen. Shown only on their screen, never sent anywhere. */
const deviceInfo = () => {
    const nav = navigator as any;
    let gpu = '';
    try {
        const gl = document.createElement('canvas').getContext('webgl') as WebGLRenderingContext | null;
        const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
        gpu = ext && gl ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
        // "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)" -> "NVIDIA GeForce RTX 3060"
        const angle = gpu.match(/^ANGLE \((?:[^,]*), ([^,]*)/);
        if (angle) gpu = angle[1];
        gpu = gpu.replace(/\s*(Direct3D|OpenGL|Vulkan|Metal).*$/i, '').replace(/\s*\(0x[0-9a-f]+\)/i, '').trim();
        if (gpu.length > 40) gpu = gpu.slice(0, 39) + '…';
    } catch (e) {}
    return {
        cores: nav.hardwareConcurrency || 0,
        memMB: nav.deviceMemory ? Math.round(nav.deviceMemory * 1024) : 0,
        gpu,
        screen: `${window.screen.width}x${window.screen.height}`,
        dpr: Math.round((window.devicePixelRatio || 1) * 100) / 100,
    };
};

const slowReason = (): string => {
    try {
        if (typeof window.matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
            return 'Your device is set to reduce motion, and this site flies a camera around a 3D room.';
        const nav = navigator as any;
        if ((nav.deviceMemory && nav.deviceMemory <= 2) || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2))
            return 'This device may struggle with the 3D room.';
        const gl = document.createElement('canvas').getContext('webgl') as WebGLRenderingContext | null;
        const info = gl && gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = info && gl ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
        if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer))
            return 'Your browser is drawing 3D without a graphics card, so the room may be slow.';
    } catch (e) {}
    return '';
};

/**
 * Someone who has been in the room before (on this browser) skips the BIOS screen: they get
 * the blurred room and a small progress line, then the room itself.
 */
const SEEN_KEY = 'aayushos-seen-room';
const seenBefore = () => {
    try {
        return localStorage.getItem(SEEN_KEY) === '1';
    } catch (e) {
        return false;
    }
};

/** How long "All Content Loaded, launching ..." stays up before the room fades in. */
const LAUNCH_DELAY = 900;

const LoadingScreen: React.FC<LoadingProps> = () => {
    const [progress, setProgress] = useState(0);
    const [toLoad, setToLoad] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [overlayOpacity, setLoadingOverlayOpacity] = useState(1);
    const [loadingTextOpacity, setLoadingTextOpacity] = useState(1);
    const [startPopupOpacity, setStartPopupOpacity] = useState(0);
    const [firefoxPopupOpacity, setFirefoxPopupOpacity] = useState(0);
    const [webGLErrorOpacity, setWebGLErrorOpacity] = useState(0);

    const [showBiosInfo, setShowBiosInfo] = useState(false);
    const [showLoadingResources, setShowLoadingResources] = useState(false);
    const [doneLoading, setDoneLoading] = useState(false);
    const [webGLError, setWebGLError] = useState(false);
    const [counter, setCounter] = useState(0);
    const [resources] = useState<string[]>([]);
    const [mobileWarning, setMobileWarning] = useState(window.innerWidth < 768);
    const [slow] = useState(slowReason);
    const [device] = useState(deviceInfo);
    // a returning visitor gets the short screen; a device that may struggle always gets the
    // START / SKIP choice (it's the only case that still has a button)
    const [quick] = useState(() => seenBefore() && !slow);
    // the RAM check counts up like an old BIOS memory test
    const [ramShown, setRamShown] = useState(0);
    useEffect(() => {
        if (!showBiosInfo) return;
        const target = device.memMB || 640;
        const step = Math.max(64, Math.round(target / 24));
        const t = setInterval(() => {
            setRamShown((r) => {
                const n = Math.min(target, r + step);
                if (n >= target) clearInterval(t);
                return n;
            });
        }, 40);
        return () => clearInterval(t);
    }, [showBiosInfo]);
    const skip = () => {
        try {
            const gc = (window as any).goatcounter;
            if (gc && gc.count) gc.count({ path: '3d/skip', title: 'Skipped the 3D room', event: true });
        } catch (e) {}
    };
    const started = useRef(false);

    // ESC on the loading screen goes straight to AayushOS without the 3D
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape' || started.current) return;
            skip();
            window.location.href = '/os/';
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const onResize = () => {
        if (window.innerWidth < 768) {
            setMobileWarning(true);
        } else {
            setMobileWarning(false);
        }
    };

    window.addEventListener('resize', onResize);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug')) {
            start();
        } else if (!detectWebGLContext()) {
            setWebGLError(true);
        } else {
            setShowBiosInfo(true);
        }
    }, []);

    useEffect(() => {
        eventBus.on('loadedSource', (data) => {
            setProgress(data.progress);
            setToLoad(data.toLoad);
            setLoaded(data.loaded);
            resources.push(
                `Loaded ${data.sourceName}${getSpace(
                    data.sourceName
                )} ... ${Math.round(data.progress * 100)}%`
            );
            if (resources.length > 8) {
                resources.shift();
            }
        });
    }, []);

    useEffect(() => {
        setShowLoadingResources(true);
        setCounter(counter + 1);
    }, [loaded]);

    useEffect(() => {
        if (progress >= 1 && !webGLError) {
            setDoneLoading(true);

            // no START button: the room opens by itself, unless this device may struggle,
            // in which case the visitor chooses between the 3D room and the plain desktop
            if (!slow) {
                setTimeout(start, quick ? 250 : LAUNCH_DELAY);
                return;
            }
            setTimeout(() => {
                setLoadingTextOpacity(0);
                setTimeout(() => {
                    setStartPopupOpacity(1);
                }, 500);
            }, 1000);
        }
    }, [progress]);

    useEffect(() => {
        if (webGLError) {
            setTimeout(() => {
                setWebGLErrorOpacity(1);
            }, 500);
        }
    }, [webGLError]);

    const start = useCallback(() => {
        if (started.current) return;
        started.current = true;
        try {
            localStorage.setItem(SEEN_KEY, '1');
        } catch (e) {}
        setLoadingOverlayOpacity(0);
        eventBus.dispatch('loadingScreenDone', {});
        const ui = document.getElementById('ui');
        if (ui) {
            ui.style.pointerEvents = 'none';
        }
    }, []);

    const getSpace = (sourceName: string) => {
        let spaces = '';
        for (let i = 0; i < 24 - sourceName.length; i++) spaces += '\xa0';
        return spaces;
    };

    const getCurrentDate = () => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        // add leading zero
        const monthFormatted = month < 10 ? `0${month}` : month;
        const dayFormatted = day < 10 ? `0${day}` : day;
        return `${monthFormatted}/${dayFormatted}/${year}`;
    };

    const detectWebGLContext = () => {
        var canvas = document.createElement('canvas');

        // Get WebGLRenderingContext from canvas element.
        var gl =
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl');
        // Report the result.
        if (gl && gl instanceof WebGLRenderingContext) {
            return true;
        }
        return false;
    };

    return (
        <div
            style={Object.assign({}, styles.overlay, {
                opacity: overlayOpacity,
                transform: `scale(${overlayOpacity === 0 ? 1.1 : 1})`,
            })}
        >
            {/* the room, blurred, behind the start box (and the whole short screen) */}
            <div style={Object.assign({}, styles.roomBg, { opacity: quick && !webGLError ? 1 : startPopupOpacity * 0.9 })} />
            {quick && !webGLError && (
                <div style={styles.quick} className="loading-quick">
                    <p className={progress >= 1 ? undefined : 'loading'}>
                        {progress >= 1 ? 'READY' : `LOADING THE ROOM ${Math.round(progress * 100)}%`}
                    </p>
                    <a href="/os/" onClick={skip} style={styles.quickSkip}>
                        {TOUCH ? 'skip to the desktop' : 'ESC: skip to the desktop'}
                    </a>
                </div>
            )}
            {startPopupOpacity === 0 && loadingTextOpacity === 0 && (
                <div style={styles.blinkingContainer}>
                    <span className="blinking-cursor" />
                </div>
            )}
            {!webGLError && !quick && (
                <div
                    style={Object.assign({}, styles.overlayText, {
                        opacity: loadingTextOpacity,
                    })}
                >
                    <div
                        style={styles.header}
                        className="loading-screen-header"
                    >
                        <div style={styles.logoContainer}>
                            <div>
                                <p style={styles.green}>
                                    <b>Agrawal,</b>{' '}
                                </p>
                                <p style={styles.green}>
                                    <b>Aayush Inc.</b>
                                </p>
                            </div>
                        </div>
                        <div style={styles.headerInfo}>
                            <p>Released: 11/06/2026</p>
                            <p>AABIOS (C)2026 Agrawal Aayush Inc.,</p>
                        </div>
                    </div>
                    <div style={styles.body} className="loading-screen-body">
                        <p>ASP S13 2000-2026 Special BLR560</p>
                        <div style={styles.spacer} />
                        {showBiosInfo && (
                            <>
                                <p>
                                    CPU : {device.cores ? `${device.cores} cores detected` : 'Detected'}
                                </p>
                                <p>
                                    Checking RAM : {ramShown} {device.memMB ? 'MB' : 'KB'}
                                    {ramShown >= (device.memMB || 640) ? ' OK' : ''}
                                </p>
                                {device.gpu && <p>Graphics : {device.gpu}</p>}
                                <p>
                                    Display : {device.screen} @ {device.dpr}x
                                </p>
                                <div style={styles.spacer} />
                                <div style={styles.spacer} />
                                {showLoadingResources ? (
                                    progress == 1 ? (
                                        <p>FINISHED LOADING RESOURCES</p>
                                    ) : (
                                        <p className="loading">
                                            LOADING RESOURCES ({loaded}/
                                            {toLoad === 0 ? '-' : toLoad})
                                        </p>
                                    )
                                ) : (
                                    <p className="loading">WAIT</p>
                                )}
                            </>
                        )}
                        <div style={styles.spacer} />
                        <div style={styles.resourcesLoadingList}>
                            {resources.map((sourceName) => (
                                <p key={sourceName}>{sourceName}</p>
                            ))}
                        </div>
                        <div style={styles.spacer} />
                        {showLoadingResources && doneLoading && (
                            <p>
                                All Content Loaded, launching{' '}
                                <b style={styles.green}>
                                    'Aayush Agrawal Portfolio Showcase'
                                </b>{' '}
                                V1.0
                            </p>
                        )}
                        <div style={styles.spacer} />
                        <span className="blinking-cursor" />
                    </div>
                    <div
                        style={styles.footer}
                        className="loading-screen-footer"
                    >
                        <p>
                            Press <b>DEL</b> to enter SETUP ,{' '}
                            <a href="/os/" onClick={skip} style={styles.footerLink}>
                                <b>ESC</b> to skip to the desktop (no 3D)
                            </a>
                        </p>
                        <p>{getCurrentDate()}</p>
                    </div>
                </div>
            )}
            <div
                style={Object.assign({}, styles.popupContainer, {
                    opacity: startPopupOpacity,
                })}
            >
                <div style={styles.startPopup}>
                    {/* <p style={styles.red}>
                        <b>THIS SITE IS CURRENTLY A W.I.P.</b>
                    </p>
                    <p>But do enjoy what I have done so far :)</p>
                    <div style={styles.spacer} />
                    <div style={styles.spacer} /> */}
                    <p>Aayush Agrawal Portfolio Showcase 2026</p>
                    {mobileWarning && (
                        <>
                            <br />
                            <b>
                                <p style={styles.warning}>
                                    WARNING: This experience is best viewed on
                                </p>
                                <p style={styles.warning}>
                                    a desktop or laptop computer.
                                </p>
                            </b>
                            <br />
                        </>
                    )}
                    {slow && !mobileWarning && (
                        <>
                            <br />
                            <b>
                                <p style={styles.warning}>HEADS UP: {slow}</p>
                            </b>
                            <p>You can go straight to the desktop instead. Same content, no 3D.</p>
                            <br />
                        </>
                    )}
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <p>Click start to begin{'\xa0'}</p>
                        <span className="blinking-cursor" />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '16px',
                            gap: 16,
                        }}
                    >
                        <div className="bios-start-button" onClick={start}>
                            <p>{slow ? 'START 3D' : 'START'}</p>
                        </div>
                        {slow && (
                            <a className="bios-start-button" href="/os/" onClick={skip} style={styles.skipButton}>
                                <p>SKIP TO DESKTOP</p>
                            </a>
                        )}
                    </div>
                    {!slow && (
                        <a href="/os/" onClick={skip} style={styles.skipLink}>
                            or skip the 3D and go straight to the desktop
                        </a>
                    )}
                </div>
            </div>
            {webGLError && (
                <div
                    style={Object.assign({}, styles.popupContainer, {
                        opacity: webGLErrorOpacity,
                    })}
                >
                    <div style={styles.startPopup}>
                        <p>
                            <b style={{ color: 'red' }}>CRITICAL ERROR:</b> No
                            WebGL Detected
                        </p>
                        <div style={styles.spacer} />
                        <div style={styles.spacer} />

                        <p>WebGL is required to run this site.</p>
                        <p>
                            Please enable it or switch to a browser which
                            supports WebGL
                        </p>
                        <div style={styles.spacer} />
                        <p>
                            Or open the same portfolio without 3D:{' '}
                            <a href="/os/" onClick={skip} style={styles.inlineLink}>
                                AayushOS
                            </a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles: StyleSheetCSS = {
    overlay: {
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
        display: 'flex',
        transition: 'opacity 0.6s, transform 0.6s',

        transitionTimingFunction: 'ease-in-out',
        MozTransitionTimingFunction: 'ease-in-out',
        WebkitTransitionTimingFunction: 'ease-in-out',
        OTransitionTimingFunction: 'ease-in-out',
        msTransitionTimingFunction: 'ease-in-out',
        position: 'relative',

        boxSizing: 'border-box',
        fontSize: 16,
        letterSpacing: 0.8,
    },

    spacer: {
        height: 16,
    },
    roomBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.5)), url(images/room-blur.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.8s ease-out',
        pointerEvents: 'none',
    },
    header: {
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
    },
    popupContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    warning: {
        color: 'yellow',
    },
    skipButton: {
        color: '#fff',
        textDecoration: 'none',
    },
    skipLink: {
        marginTop: 18,
        color: '#aaa',
        fontFamily: 'monospace',
        fontSize: 14,
        textAlign: 'center',
        textDecoration: 'underline',
    },
    footerLink: {
        color: 'inherit',
        textDecoration: 'none',
    },
    quick: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: '#000',
        padding: '6px 14px',
    },
    quickSkip: {
        color: '#aaa',
        fontFamily: 'monospace',
        fontSize: 14,
        textDecoration: 'none',
    },
    inlineLink: {
        color: '#ff6a1a',
    },
    blinkingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        boxSizing: 'border-box',
        padding: 48,
    },
    startPopup: {
        backgroundColor: '#000',
        padding: 24,
        border: '7px solid #fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: 500,
        // alignItems: 'center',
    },
    headerInfo: {
        marginLeft: 64,
    },
    red: {
        color: '#00ff00',
    },
    link: {
        // textDecoration: 'none',
        color: '#4598ff',
        cursor: 'pointer',
    },
    overlayText: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    body: {
        flex: 1,
        display: 'flex',
        width: '100%',
        boxSizing: 'border-box',
        flexDirection: 'column',
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    resourcesLoadingList: {
        display: 'flex',
        paddingLeft: 32,
        paddingBottom: 32,
        flexDirection: 'column',
    },
    logoImage: {
        width: 64,
        height: 42,
        imageRendering: 'pixelated',
        marginRight: 16,
    },
    footer: {
        boxSizing: 'border-box',
        width: '100%',
    },
};

export default LoadingScreen;
