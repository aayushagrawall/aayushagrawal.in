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
    welcome: { key: 'welcome', name: 'Welcome', shortcutIcon: 'computerSmall', component: Welcome, hidden: true },
    cheat: { key: 'cheat', name: 'Cheat Code', shortcutIcon: 'windowGameIcon', component: CheatCode, hidden: true },
};

const highestZ = (wins: DesktopWindows) =>
    Object.keys(wins).reduce((m, k) => (wins[k] && wins[k].zIndex > m ? wins[k].zIndex : m), 0);

const Desktop: React.FC<DesktopProps> = (props) => {
    const [windows, setWindows] = useState<DesktopWindows>({});

    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);

    const [shutdown, setShutdown] = useState(false);
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
        if (app.href) {
            window.open(app.href, '_blank', 'noopener');
            return;
        }
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

        // tips dialog on first visit, but not inside the 3D monitor (keeps the hero clean there)
        let welcomeOff = false;
        try {
            welcomeOff = localStorage.getItem(WELCOME_OFF_KEY) === '1';
        } catch (e) {}
        const welcomeTimer = window.parent === window && !welcomeOff ? setTimeout(() => openApp('welcome'), 700) : undefined;

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

    const perColumn = Math.max(1, Math.floor((window.innerHeight - 70) / 96));

    return !shutdown ? (
        <div style={styles.desktop}>
            {/* For each window in windows, loop over and render  */}
            {Object.keys(windows).map((key) => {
                const element = windows[key].component;
                if (!element) return <div key={`win-${key}`}></div>;
                return (
                    <div
                        key={`win-${key}`}
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
            <div style={styles.shortcuts}>
                {shortcuts.map((shortcut, i) => {
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
                            />
                        </div>
                    );
                })}
            </div>
            <Extras onKonami={() => openApp('cheat')} />
            <Toolbar
                windows={windows}
                toggleMinimize={toggleMinimize}
                shutdown={startShutdown}
            />
        </div>
    ) : (
        <ShutdownSequence
            setShutdown={setShutdown}
            numShutdowns={numShutdowns}
        />
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
