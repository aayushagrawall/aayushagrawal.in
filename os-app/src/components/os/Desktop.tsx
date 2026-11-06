import React, { useCallback, useEffect, useRef, useState } from 'react';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import ShutdownSequence from './ShutdownSequence';
import ThisComputer from '../applications/ThisComputer';
import Welcome, { WELCOME_OFF_KEY } from '../applications/Welcome';
import CheatCode from '../applications/CheatCode';
import Extras from './Extras';
import Henordle from '../applications/Henordle';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import LegacyApp from '../applications/LegacyApp';
import ResumeApp from '../applications/ResumeApp';
import { IconName } from '../../assets/icons';
import Credits from '../applications/Credits';
import AchievementsApp from '../achievements/AchievementsApp';
import AchievementCenter from '../achievements/AchievementCenter';
import { achieve } from '../achievements/list';
import Assistant from './Assistant';
import BootScreen from './BootScreen';
import DisplayProperties from '../applications/DisplayProperties';
import ContextMenu from './ContextMenu';
import { track } from '../../utils/track';
import { getWallpaper, Wallpaper } from '../../utils/wallpaper';

export interface DesktopProps {}

type ExtendedWindowAppProps<T> = T & WindowAppProps;

type AppDef = {
    key: string;
    name: string;
    shortcutIcon: IconName;
    component?: React.FC<ExtendedWindowAppProps<any>>;
    props?: { [k: string]: any };
    href?: string; // opens in a new tab instead of a window
    alias?: { app: string; route: string }; // opens another app at a page
    hidden?: boolean; // not shown on the desktop
    message?: string; // posts this message type instead of opening a window
};

const legacy = (
    app: string,
    title: string,
    icon: IconName,
    width: number,
    height: number,
    top: number,
    left: number,
    status?: string
) => ({ component: LegacyApp, props: { app, title, icon, width, height, top, left, status } });

const APPLICATIONS: { [key in string]: AppDef } = {
    showcase: { key: 'showcase', name: 'My Showcase', shortcutIcon: 'showcaseIcon', component: ShowcaseExplorer },
    projects: { key: 'projects', name: 'Projects', shortcutIcon: 'folderIcon', alias: { app: 'showcase', route: '/projects' } },
    resume: { key: 'resume', name: 'Resume.pdf', shortcutIcon: 'docIcon', component: ResumeApp },
    terminal: { key: 'terminal', name: 'Terminal', shortcutIcon: 'terminalIcon', ...legacy('terminal', 'C:\\WINDOWS\\cmd.exe', 'terminalSmall', 860, 600, 70, 260, 'Type help to get started') },
    tetris: { key: 'tetris', name: 'Tetris', shortcutIcon: 'tetrisIcon', ...legacy('tetris', 'Tetris', 'tetrisSmall', 490, 684, 40, 420, 'Arrows to play · Space to drop') },
    paint: { key: 'paint', name: 'Paint', shortcutIcon: 'paintIcon', ...legacy('paint', 'untitled - Paint', 'paintSmall', 852, 678, 40, 240, 'Draw something!') },
    mycomputer: { key: 'mycomputer', name: 'This Computer', shortcutIcon: 'myComputer', component: ThisComputer },
    wordle: { key: 'wordle', name: 'Codele', shortcutIcon: 'henordleIcon', component: Henordle },
    github: { key: 'github', name: 'GitHub', shortcutIcon: 'githubIcon', href: 'https://github.com/aayushagrawall' },
    linkedin: { key: 'linkedin', name: 'LinkedIn', shortcutIcon: 'linkedinIcon', href: 'https://www.linkedin.com/in/aayush-agrawall/' },
    instagram: { key: 'instagram', name: 'Instagram', shortcutIcon: 'instagramIcon', href: 'https://instagram.com/_aayush.agrawal' },
    site: { key: 'site', name: 'My Website', shortcutIcon: 'globeIcon', href: 'https://aayushagrawal.codes' },
    recycle: { key: 'recycle', name: 'Recycle Bin', shortcutIcon: 'recycleIcon', ...legacy('recycle', 'Recycle Bin', 'recycleSmall', 760, 470, 160, 320, 'Double-click a file to peek inside') },
    credits: { key: 'credits', name: 'Credits', shortcutIcon: 'credits', component: Credits },
    achievements: { key: 'achievements', name: 'Achievements', shortcutIcon: 'trophyIcon', component: AchievementsApp },
    chai: { key: 'chai', name: 'Ask Chai', shortcutIcon: 'chaiIcon', message: 'aos-assistant' },
    welcome: { key: 'welcome', name: 'Welcome', shortcutIcon: 'computerSmall', component: Welcome, hidden: true },
    display: { key: 'display', name: 'Display Properties', shortcutIcon: 'computerSmall', component: DisplayProperties, hidden: true },
    cheat: { key: 'cheat', name: 'Cheat Code', shortcutIcon: 'windowGameIcon', component: CheatCode, hidden: true },
};

// Shareable links: /os/#projects opens the Showcase on Projects, /os/#tetris opens Tetris...
const DEEP_LINKS: { [hash: string]: { app: string; route?: string } } = {
    home: { app: 'showcase', route: '/' },
    about: { app: 'showcase', route: '/about' },
    experience: { app: 'showcase', route: '/experience' },
    projects: { app: 'showcase', route: '/projects' },
    'projects/software': { app: 'showcase', route: '/projects/software' },
    'projects/tools': { app: 'showcase', route: '/projects/tools' },
    contact: { app: 'showcase', route: '/contact' },
    resume: { app: 'resume' },
    terminal: { app: 'terminal' },
    tetris: { app: 'tetris' },
    paint: { app: 'paint' },
    codele: { app: 'wordle' },
    achievements: { app: 'achievements' },
    computer: { app: 'mycomputer' },
    recycle: { app: 'recycle' },
    credits: { app: 'credits' },
};

const openDeepLink = (open: (key: string, route?: string) => void) => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#\/?/, '')).toLowerCase();
    const link = DEEP_LINKS[hash];
    if (link) {
        open(link.app, link.route);
        track('link/' + hash, 'Arrived via #' + hash);
    }
    return !!link;
};

const highestZ = (wins: DesktopWindows) =>
    Object.keys(wins).reduce((m, k) => (wins[k] && wins[k].zIndex > m ? wins[k].zIndex : m), 0);

const Desktop: React.FC<DesktopProps> = (props) => {
    const [windows, setWindows] = useState<DesktopWindows>({});

    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);
    const [wallpaper, setWallpaper] = useState<Wallpaper>(getWallpaper());
    const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
    const [byName, setByName] = useState(false);
    const [hideIcons, setHideIcons] = useState(false);
    const [kbIndex, setKbIndex] = useState<number | null>(null);
    const desktopFocused = useRef(true);

    useEffect(() => {
        const onWp = () => setWallpaper(getWallpaper());
        window.addEventListener('aos-wallpaper', onWp);
        return () => window.removeEventListener('aos-wallpaper', onWp);
    }, []);

    const [shutdown, setShutdown] = useState(false);
    const [booted, setBooted] = useState(() => {
        if (window.parent !== window) return true; // the 3D scene has its own boot screen
        try {
            return sessionStorage.getItem('aayushos-booted') === '1';
        } catch (e) {
            return false;
        }
    });
    const finishBoot = () => {
        setBooted(true);
        try {
            sessionStorage.setItem('aayushos-booted', '1');
        } catch (e) {}
    };
    const [numShutdowns, setNumShutdowns] = useState(1);

    useEffect(() => {
        if (shutdown === true) {
            rebootDesktop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shutdown]);

    // keep the latest windows in a ref so message handlers never use stale state
    const windowsRef = useRef<DesktopWindows>({});
    windowsRef.current = windows;

    const openApp = (key: string, route?: string): void => {
        const app = APPLICATIONS[key];
        if (!app) return;
        if (!app.hidden || key === 'display') track('open/' + key, 'Opened ' + app.name);
        if (app.href) {
            window.open(app.href, '_blank', 'noopener');
            return;
        }
        if (app.message) {
            window.postMessage({ type: app.message }, '*');
            return;
        }
        window.postMessage({ type: 'aos-opened', app: key }, '*');
        if (key === 'resume') achieve('resume');
        if (app.alias) {
            openApp(app.alias.app, app.alias.route);
            return;
        }
        const existing = windowsRef.current[key];
        if (existing) {
            setWindows((prev) => ({
                ...prev,
                [key]: { ...prev[key], minimized: false, zIndex: highestZ(prev) + 1 },
            }));
            if (route) window.dispatchEvent(new CustomEvent('aos-route', { detail: route }));
            return;
        }
        const Comp = app.component!;
        addWindow(
            key,
            <Comp
                {...(app.props || {})}
                initialRoute={route}
                onInteract={() => onWindowInteract(key)}
                onMinimize={() => minimizeWindow(key)}
                onClose={() => removeWindow(key)}
                key={key}
            />
        );
    };

    useEffect(() => {
        const newShortcuts: DesktopShortcutProps[] = [];
        Object.keys(APPLICATIONS).forEach((key) => {
            const app = APPLICATIONS[key];
            if (app.hidden) return;
            newShortcuts.push({
                shortcutName: app.name,
                icon: app.shortcutIcon,
                onOpen: () => openApp(key),
            });
        });
        openApp('showcase');
        setShortcuts(newShortcuts);
        const deepLinked = openDeepLink(openApp);
        const onHash = () => openDeepLink(openApp);
        window.addEventListener('hashchange', onHash);

        // tips dialog on first visit, but not inside the 3D monitor (keeps the hero clean there)
        let welcomeOff = false;
        try {
            welcomeOff = localStorage.getItem(WELCOME_OFF_KEY) === '1';
        } catch (e) {}
        const welcomeTimer = window.parent === window && !welcomeOff && !deepLinked ? setTimeout(() => openApp('welcome'), 700) : undefined;

        // messages from Aayush's apps running in iframes (Terminal, Paint...)
        const onMessage = (e: MessageEvent) => {
            const d = e.data;
            if (!d || typeof d !== 'object') return;
            if (d.type === 'aos-open') openApp(d.app, d.route);
            if (d.type === 'aos-focus' && windowsRef.current[d.app]) onWindowInteract(d.app);
            if (d.type === 'aos-close' && windowsRef.current[d.app]) removeWindow(d.app);
        };
        window.addEventListener('message', onMessage);
        return () => {
            window.removeEventListener('message', onMessage);
            window.removeEventListener('hashchange', onHash);
            if (welcomeTimer) clearTimeout(welcomeTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rebootDesktop = useCallback(() => {
        setWindows({});
    }, []);

    const removeWindow = useCallback((key: string) => {
        // Absolute hack and a half
        setTimeout(() => {
            setWindows((prevWindows) => {
                const newWindows = { ...prevWindows };
                delete newWindows[key];
                return newWindows;
            });
        }, 100);
    }, []);

    const minimizeWindow = useCallback((key: string) => {
        setWindows((prevWindows) => {
            const newWindows = { ...prevWindows };
            if (newWindows[key]) newWindows[key] = { ...newWindows[key], minimized: true };
            return newWindows;
        });
    }, []);

    const toggleMinimize = useCallback((key: string) => {
        setWindows((prev) => {
            const w = prev[key];
            if (!w) return prev;
            const top = highestZ(prev);
            const minimized = w.minimized || w.zIndex === top ? !w.minimized : w.minimized;
            return { ...prev, [key]: { ...w, minimized, zIndex: top + 1 } };
        });
    }, []);

    const onWindowInteract = useCallback(
        (key: string) => {
            setWindows((prevWindows) =>
                prevWindows[key]
                    ? {
                          ...prevWindows,
                          [key]: {
                              ...prevWindows[key],
                              zIndex: 1 + highestZ(prevWindows),
                          },
                      }
                    : prevWindows
            );
        },
        []
    );

    const startShutdown = useCallback(() => {
        if (numShutdowns >= 5) achieve('shutdown');
        setTimeout(() => {
            setShutdown(true);
            setNumShutdowns(numShutdowns + 1);
        }, 600);
    }, [numShutdowns]);

    const addWindow = useCallback(
        (key: string, element: JSX.Element) => {
            setWindows((prevState) => ({
                ...prevState,
                [key]: {
                    zIndex: highestZ(prevState) + 1,
                    minimized: false,
                    component: element,
                    name: APPLICATIONS[key].name,
                    icon: APPLICATIONS[key].shortcutIcon,
                },
            }));
        },
        []
    );

    const orderedShortcuts = byName ? [...shortcuts].sort((a, b) => a.shortcutName.localeCompare(b.shortcutName)) : shortcuts;

    // keep latest values for the keyboard handler
    const kbState = useRef({ windows, kbIndex, ordered: orderedShortcuts });
    kbState.current = { windows, kbIndex, ordered: orderedShortcuts };

    /**
     * Keyboard shortcuts (browsers keep Alt+Tab and Alt+F4 for themselves):
     *   Alt+W  switch to the next window      Alt+M  minimise the active window
     *   Alt+Q  close the active window        Esc    close menus
     *   Arrow keys + Enter pick and open desktop icons (after clicking the desktop)
     */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const { windows: wins, kbIndex: idx, ordered } = kbState.current;
            const keys = Object.keys(wins);
            const byZ = [...keys].sort((a, b) => wins[a].zIndex - wins[b].zIndex);
            const top = [...byZ].reverse().find((k) => !wins[k].minimized);
            if (e.altKey && e.code === 'KeyW' && keys.length) {
                e.preventDefault();
                const next = byZ[0]; // the window furthest back comes to the front, so repeats cycle through all
                setWindows((prev) => ({ ...prev, [next]: { ...prev[next], minimized: false, zIndex: highestZ(prev) + 1 } }));
                desktopFocused.current = false;
                return;
            }
            if (e.altKey && e.code === 'KeyM' && top) {
                e.preventDefault();
                minimizeWindow(top);
                return;
            }
            if (e.altKey && e.code === 'KeyQ' && top) {
                e.preventDefault();
                removeWindow(top);
                return;
            }
            if (e.key === 'Escape') {
                setMenu(null);
                setKbIndex(null);
                return;
            }
            if (!desktopFocused.current || !ordered.length) return;
            const tag = (document.activeElement && document.activeElement.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            const per = Math.max(1, Math.floor((window.innerHeight - 70) / 96));
            const n = ordered.length;
            const move: { [k: string]: number } = { ArrowDown: 1, ArrowUp: -1, ArrowRight: per, ArrowLeft: -per };
            if (e.key in move) {
                e.preventDefault();
                setKbIndex(idx === null ? 0 : Math.min(n - 1, Math.max(0, idx + move[e.key])));
            } else if (e.key === 'Enter' && idx !== null) {
                e.preventDefault();
                ordered[idx].onOpen();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDesktopMouseDown = (e: React.MouseEvent) => {
        const t = e.target as HTMLElement;
        const onBackground = t === e.currentTarget || t.dataset.desktop === 'icons';
        desktopFocused.current = true;
        if (onBackground) setKbIndex(null);
    };

    const onDesktopContextMenu = (e: React.MouseEvent) => {
        const t = e.target as HTMLElement;
        if (t !== e.currentTarget && t.dataset.desktop !== 'icons') return;
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY });
    };

    const refreshIcons = () => {
        setHideIcons(true);
        setTimeout(() => setHideIcons(false), 180);
    };

    const perColumn = Math.max(1, Math.floor((window.innerHeight - 70) / 96));

    const overlays = (
        <>
            <Extras onKonami={() => openApp('cheat')} />
            <AchievementCenter />
            {!shutdown && <Assistant />}
            {!booted && <BootScreen onDone={finishBoot} />}
        </>
    );

    return !shutdown ? (
        <>
        <div
            style={Object.assign({}, styles.desktop, wallpaper.css)}
            onMouseDown={onDesktopMouseDown}
            onContextMenu={onDesktopContextMenu}
        >
            {/* For each window in windows, loop over and render  */}
            {Object.keys(windows).map((key) => {
                const element = windows[key].component;
                if (!element) return <div key={`win-${key}`}></div>;
                return (
                    <div
                        key={`win-${key}`}
                        onMouseDownCapture={() => {
                            desktopFocused.current = false;
                        }}
                        style={Object.assign(
                            {},
                            { zIndex: windows[key].zIndex },
                            windows[key].minimized && styles.minimized
                        )}
                    >
                        {React.cloneElement(element, {
                            key,
                            onInteract: () => onWindowInteract(key),
                            onClose: () => removeWindow(key),
                        })}
                    </div>
                );
            })}
            <div style={Object.assign({}, styles.shortcuts, hideIcons && { visibility: 'hidden' })} data-desktop="icons">
                {orderedShortcuts.map((shortcut, i) => {
                    return (
                        <div
                            style={Object.assign({}, styles.shortcutContainer, {
                                top: (i % perColumn) * 96,
                                left: Math.floor(i / perColumn) * 92,
                            })}
                            key={shortcut.shortcutName}
                        >
                            <DesktopShortcut
                                icon={shortcut.icon}
                                shortcutName={shortcut.shortcutName}
                                onOpen={shortcut.onOpen}
                                keyboardSelected={kbIndex === i}
                            />
                        </div>
                    );
                })}
            </div>
            {menu && (
                <ContextMenu
                    x={menu.x}
                    y={menu.y}
                    onClose={() => setMenu(null)}
                    items={[
                        { label: byName ? 'Arrange Icons: Default' : 'Arrange Icons by Name', onSelect: () => setByName(!byName) },
                        { label: 'Refresh', onSelect: refreshIcons },
                        '-',
                        { label: 'Paste', disabled: true },
                        { label: 'New Folder', disabled: true },
                        '-',
                        { label: 'Achievements', onSelect: () => openApp('achievements') },
                        { label: 'Properties', onSelect: () => openApp('display') },
                    ]}
                />
            )}
            <Toolbar
                windows={windows}
                toggleMinimize={toggleMinimize}
                shutdown={startShutdown}
            />
        </div>
            {overlays}
        </>
    ) : (
        <>
            <ShutdownSequence setShutdown={setShutdown} numShutdowns={numShutdowns} />
            {overlays}
        </>
    );
};

const styles: StyleSheetCSS = {
    desktop: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: Colors.turquoise,
    },
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#1d2e2f',
    },
    shortcutContainer: {
        position: 'absolute',
    },
    shortcuts: {
        position: 'absolute',
        top: 16,
        left: 6,
    },
    minimized: {
        pointerEvents: 'none',
        opacity: 0,
    },
};

export default Desktop;
