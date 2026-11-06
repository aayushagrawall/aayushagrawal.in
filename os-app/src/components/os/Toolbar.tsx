import React, { useEffect, useRef, useState } from 'react';
import Colors from '../../constants/colors';
import { Icon } from '../general';
import { isMuted, setMuted, onMuteChange } from '../../utils/sound';
import ClockPopup from './ClockPopup';
// import { } from '../general';
// import Home from '../site/Home';
// import Window from './Window';

export interface ToolbarProps {
    windows: DesktopWindows;
    toggleMinimize: (key: string) => void;
    shutdown: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
    windows,
    toggleMinimize,
    shutdown,
}) => {
    const getTime = () => {
        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        let mins = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + mins + ' ' + amPm;
        return strTime;
    };

    const [startWindowOpen, setStartWindowOpen] = useState(false);
    const [muted, setMutedState] = useState(isMuted());
    const [clockOpen, setClockOpen] = useState(false);
    useEffect(() => onMuteChange(setMutedState), []);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                lastClickInside.current = false;
                setStartWindowOpen(false);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);
    const lastClickInside = useRef(false);

    const [lastActive, setLastActive] = useState('');

    useEffect(() => {
        let max = 0;
        let k = '';
        Object.keys(windows).forEach((key) => {
            if (windows[key].zIndex >= max) {
                max = windows[key].zIndex;
                k = key;
            }
        });
        setLastActive(k);
    }, [windows]);

    const [time, setTime] = useState(getTime());

    // one clock timer for the lifetime of the toolbar
    useEffect(() => {
        const t = setInterval(() => setTime(getTime()), 5000);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const launch = (e: React.MouseEvent, app: string, route?: string) => {
        e.stopPropagation();
        lastClickInside.current = false;
        setStartWindowOpen(false);
        window.postMessage({ type: 'aos-open', app, route }, '*');
    };

    const onCheckClick = () => {
        if (lastClickInside.current) {
            setStartWindowOpen(true);
        } else {
            setStartWindowOpen(false);
        }
        lastClickInside.current = false;
    };

    useEffect(() => {
        window.addEventListener('mousedown', onCheckClick, false);
        return () => {
            window.removeEventListener('mousedown', onCheckClick, false);
        };
    }, []);

    const onStartWindowClicked = () => {
        setStartWindowOpen(true);
        lastClickInside.current = true;
    };

    const toggleStartWindow = () => {
        if (!startWindowOpen) {
            lastClickInside.current = true;
        } else {
            lastClickInside.current = false;
        }
    };

    return (
        <div style={styles.toolbarOuter}>
            {startWindowOpen && (
                <div
                    onMouseDown={onStartWindowClicked}
                    style={styles.startWindow}
                >
                    <div style={styles.startWindowInner}>
                        <div style={styles.verticalStartContainer}>
                            <p style={styles.verticalText}>AayushOS</p>
                        </div>
                        <div style={styles.startWindowContent}>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'showcase')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="showcaseIcon" />
                                <p style={styles.startMenuText}>My <u>S</u>howcase</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'projects')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="folderIcon" />
                                <p style={styles.startMenuText}><u>P</u>rojects</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'resume')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="docIcon" />
                                <p style={styles.startMenuText}><u>R</u>esume</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'terminal')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="terminalIcon" />
                                <p style={styles.startMenuText}><u>T</u>erminal</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'tetris')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="tetrisIcon" />
                                <p style={styles.startMenuText}>Tetr<u>i</u>s</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'paint')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="paintIcon" />
                                <p style={styles.startMenuText}>P<u>a</u>int</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'wordle')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="henordleIcon" />
                                <p style={styles.startMenuText}><u>C</u>odele</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'achievements')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="trophyIcon" />
                                <p style={styles.startMenuText}>Achie<u>v</u>ements</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'ultra')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="canIcon" />
                                <p style={styles.startMenuText}>Ask C<u>h</u>ai</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'mycomputer')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="myComputer" />
                                <p style={styles.startMenuText}>This C<u>o</u>mputer</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'welcome')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="computerSmall" />
                                <p style={styles.startMenuText}><u>W</u>elcome Tips</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'whatsnew')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="docIcon" />
                                <p style={styles.startMenuText}>What's <u>N</u>ew</p>
                            </div>
                            <div
                                className="start-menu-option"
                                style={styles.startMenuItem}
                                onMouseDown={(e) => launch(e, 'credits')}
                            >
                                <Icon style={styles.startMenuItemIcon} icon="credits" />
                                <p style={styles.startMenuText}>Cr<u>e</u>dits</p>
                            </div>
                            <div style={styles.startMenuLine} />
                            <div
                                className="start-menu-option"
                                style={styles.startMenuOption}
                                onMouseDown={shutdown}
                            >
                                <Icon
                                    style={styles.startMenuIcon}
                                    icon="computerBig"
                                />
                                <p style={styles.startMenuText}>
                                    Sh<u>u</u>t down...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div style={styles.toolbarInner}>
                <div style={styles.toolbar}>
                    <div
                        style={Object.assign(
                            {},
                            styles.startContainerOuter,
                            startWindowOpen && styles.activeTabOuter
                        )}
                        onMouseDown={toggleStartWindow}
                    >
                        <div
                            style={Object.assign(
                                {},
                                styles.startContainer,
                                startWindowOpen && styles.activeTabInner
                            )}
                        >
                            <Icon
                                size={18}
                                icon="windowsStartIcon"
                                style={styles.startIcon}
                            />
                            <p className="toolbar-text ">Start</p>
                        </div>
                    </div>
                    <div style={styles.toolbarTabsContainer}>
                        {Object.keys(windows).map((key) => {
                            return (
                                <div
                                    key={key}
                                    style={Object.assign(
                                        {},
                                        styles.tabContainerOuter,
                                        lastActive === key &&
                                            !windows[key].minimized &&
                                            styles.activeTabOuter
                                    )}
                                    onMouseDown={() => toggleMinimize(key)}
                                >
                                    <div
                                        style={Object.assign(
                                            {},
                                            styles.tabContainer,
                                            lastActive === key &&
                                                !windows[key].minimized &&
                                                styles.activeTabInner
                                        )}
                                    >
                                        <Icon
                                            size={18}
                                            icon={windows[key].icon}
                                            style={styles.tabIcon}
                                        />
                                        <p style={styles.tabText}>
                                            {windows[key].name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div style={styles.time}>
                    <div
                        title={muted ? 'Sound is off. Click to turn it on' : 'Sound is on. Click to mute'}
                        style={{ cursor: 'pointer' }}
                        onMouseDown={() => setMuted(!muted)}
                    >
                        <Icon style={styles.volumeIcon} icon={muted ? 'volumeOff' : 'volumeOn'} />
                    </div>
                    <p
                        style={Object.assign({}, styles.timeText, { cursor: 'pointer' })}
                        title="Bangalore time"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setClockOpen(!clockOpen);
                        }}
                    >
                        {time}
                    </p>
                    {clockOpen && <ClockPopup onClose={() => setClockOpen(false)} />}
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    toolbarOuter: {
        boxSizing: 'border-box',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 32,
        background: Colors.lightGray,
        borderTop: `1px solid ${Colors.lightGray}`,
        zIndex: 100000,
    },
    verticalStartContainer: {
        // width: 30,
        height: '100%',
        background: Colors.darkGray,
    },
    verticalText: {
        fontFamily: 'Terminal',
        textOrientation: 'sideways',
        fontSize: 32,
        padding: 4,
        paddingBottom: 64,
        paddingTop: 8,
        letterSpacing: 1,
        color: Colors.lightGray,
        transform: 'scale(-1)',
        WebkitTransform: 'scale(-1)',
        MozTransform: 'scale(-1)',
        msTransform: 'scale(-1)',
        OTransform: 'scale(-1)',
        // @ts-ignore
        writingMode: 'tb-rl',
    },
    startWindowContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        // alignItems: 'flex-end',
    },
    startWindow: {
        position: 'absolute',
        bottom: 28,
        display: 'flex',
        flex: 1,
        width: 256,
        // height: 400,
        left: 4,
        boxSizing: 'border-box',
        border: `1px solid ${Colors.white}`,
        borderBottomColor: Colors.black,
        borderRightColor: Colors.black,
        background: Colors.lightGray,
    },
    activeTabOuter: {
        border: `1px solid ${Colors.black}`,
        borderBottomColor: Colors.white,
        borderRightColor: Colors.white,
    },
    startWindowInner: {
        border: `1px solid ${Colors.lightGray}`,
        borderBottomColor: Colors.darkGray,
        borderRightColor: Colors.darkGray,
        flex: 1,
    },
    startMenuIcon: {
        width: 32,
        height: 32,
    },
    startMenuText: {
        fontSize: 14,
        fontFamily: 'MSSerif',
        marginLeft: 8,
    },
    startMenuOption: {
        alignItems: 'center',
        // flex: 1,
        height: 24,
        padding: 12,
    },
    startMenuSpace: {
        flex: 1,
    },
    startMenuItem: {
        alignItems: 'center',
        height: 22,
        padding: '6px 12px',
    },
    startMenuItemIcon: {
        width: 24,
        height: 24,
    },
    startMenuLine: {
        height: 1,
        background: Colors.white,
        borderTop: `1px solid ${Colors.darkGray}`,
    },
    activeTabInner: {
        border: `1px solid ${Colors.darkGray}`,
        borderBottomColor: Colors.lightGray,
        borderRightColor: Colors.lightGray,
        backgroundImage: `linear-gradient(45deg, white 25%, transparent 25%),
        linear-gradient(-45deg,  white 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%,  white 75%),
        linear-gradient(-45deg, transparent 75%,  white 75%)`,
        backgroundSize: `4px 4px`,
        backgroundPosition: `0 0, 0 2px, 2px -2px, -2px 0px`,
        pointerEvents: 'none',
    },
    tabContainerOuter: {
        display: 'flex',
        flex: 1,
        maxWidth: 300,
        marginRight: 4,
        boxSizing: 'border-box',
        cursor: 'pointer',
        border: `1px solid ${Colors.white}`,
        borderBottomColor: Colors.black,
        borderRightColor: Colors.black,
    },
    tabContainer: {
        display: 'flex',
        border: `1px solid ${Colors.lightGray}`,
        borderBottomColor: Colors.darkGray,
        borderRightColor: Colors.darkGray,
        alignItems: 'center',
        paddingLeft: 4,
        flex: 1,
    },
    tabIcon: {
        marginRight: 6,
    },
    startContainer: {
        alignItems: 'center',
        flexShrink: 1,
        // background: 'red',
        border: `1px solid ${Colors.lightGray}`,
        borderBottomColor: Colors.darkGray,
        borderRightColor: Colors.darkGray,
        padding: 1,
        paddingLeft: 5,
        paddingRight: 5,
    },
    startContainerOuter: {
        marginLeft: 3,
        boxSizing: 'border-box',
        cursor: 'pointer',
        border: `1px solid ${Colors.white}`,
        borderBottomColor: Colors.black,
        borderRightColor: Colors.black,
    },
    toolbarTabsContainer: {
        // background: 'blue',
        flex: 1,
        marginLeft: 4,
        marginRight: 4,
    },
    startIcon: {
        marginRight: 4,
    },
    toolbarInner: {
        borderTop: `1px solid ${Colors.white}`,

        alignItems: 'center',
        flex: 1,
    },
    toolbar: {
        flexGrow: 1,
        width: '100%',
    },
    time: {
        flexShrink: 1,
        width: 86,
        height: 24,
        boxSizing: 'border-box',
        marginRight: 4,
        paddingLeft: 4,
        paddingRight: 4,
        border: `1px solid ${Colors.white}`,
        borderTopColor: Colors.darkGray,

        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftColor: Colors.darkGray,
    },
    volumeIcon: {
        cursor: 'pointer',
        height: 18,
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'MSSerif',
    },
    timeText: {
        fontSize: 12,
        fontFamily: 'MSSerif',
    },
};

export default Toolbar;
