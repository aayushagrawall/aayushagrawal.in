import React, { useState, useEffect } from 'react';
export interface ShutdownSequenceProps {
    numShutdowns: number;
    setShutdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const SPEED_MULTIPLIER = 1;

const _F = `>${200 * SPEED_MULTIPLIER}<`;
const _X = `>${500 * SPEED_MULTIPLIER}<`;
const _S = `>${1000 * SPEED_MULTIPLIER}<`;
const _M = `>${2000 * SPEED_MULTIPLIER}<`;
const _L = `>${5000 * SPEED_MULTIPLIER}<`;

function delay(time: number) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

const ShutdownSequence: React.FC<ShutdownSequenceProps> = ({
    numShutdowns,
    setShutdown,
}) => {
    const [text, setText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [ee, setEE] = useState(false);

    const getTime = () => {
        const date = new Date();
        const h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();
        const time =
            h + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
        return time;
    };

    const NORMAL_SHUTDOWN = `Beginning Pre-Shutdown Sequence... ${_F}
    Connecting to AAOS11/06:2026.${_F}.${_F}.${_F}
    |
    Established connection to AA0S11/06:2026, attempting data transfer.
    |
    ${_F}
    |Analyzing data... Done.| ${_F}
    |Packing Transfer... Done.| ${_F}
    |Beginning Transfer...| ${_F}
    |[${getTime()} START]| .${_F}.....${_X}.|............|.${_S}.|......|.${_S}...........${_M} |[Transfer Failed.]|


    |(AAOS11/06:2026:560050) [DEP_ANALYTICS_SERVER_ON_AFTER_SETUP_MIDDLEWARE] InvalidFormatting: 'onAnalyticsConversion' option received invalid parameters. Please contact a server administrator to resolve the issue.|
    ${_F}
    |(AAOS11/06:2026:560050) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:00]|
    |(AAOS11/06:2026:560050) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:01]
    (AAOS11/06:2026:560050) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:03]
    (AAOS11/06:2026:560050) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:05]
    (AAOS11/06:2026:560050) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:08]
    (AAOS11/06:2026:560050) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:12]
    (AAOS11/06:2026:560050) [SOCKET_FAILED_TO_RESPOND] Connection Refused: Reconnecting... [${getTime()}:14]
    FATAL ERROR: (AAOS11/06:2026:560050) Server became unresponsive and the transfer failed. Unable to shutdown computer. 
    |
    Aborting shutdown sequence and rebooting.




    Rebooting${_S}.${_S}.${_S}.
    `;

    const SHUTDOWN_3 = `
    Hmm${_S}.${_S}.${_S}. ${_M} You really want to shut this computer down?${_L}
    Bad news:${_S} it can't be shut down...${_S} it always reboots.
    ${_L}
    |See you soon!|
    ${_M}


    Rebooting${_S}.${_S}.${_S}.
    `;

    const SHUTDOWN_4 = `
    Still here?${_S} This computer will A${_F}L${_F}W${_F}A${_F}Y${_F}S${_F} reboot. The shutdown sequence is just for show.
    ${_M}
    There's Tetris, Paint, a Terminal and a whole portfolio to explore...
    and you keep pressing Shut Down.
    ${_L}
    |See you again!|
    ${_M}

    Rebooting${_S}.${_S}.${_S}.
    `;

    const SHUTDOWN_5 = `
    Again${_X}?${_X}?${_X}?
    ${_M}
    Okay, I respect the dedication. ${_M}Have you tried typing "sudo hire aayush" in the Terminal instead?
    ${_L}

    Rebooting${_F}.${_F}.${_F}.
    `;

    const SHUTDOWN_6 = `
    ${_M}>${_M}:${_M}(${_M}


    Rebooting${_F}.${_F}.${_F}.
    `;

    const SHUTDOWN_7 = `
    7th shutdown! ${_M}

    To celebrate, here is my attendance this semester, counted one class at a time:
    ${_L}
    1${_M},2${_M},3${_M},4${_M},5${_M},6${_M},7${_M},8${_M},9${_M},10${_M}...${_S}

    Relax, it's above 85%. I built a shortcut for that.
    ${_M}


    Rebooting${_F}.${_F}.${_F}.
    `;

    const SHUTDOWN_8 = `
    Your commitment is honestly impressive.${_S} ${_M}I think I'm ready to let you win. ${_M}

    ${_L}
    |JUST KIDDING!!!|


    Rebooting${_F}.${_F}.${_F}.
    `;

    const SHUTDOWN_10 = `
    Alright, alright${_M}. You win${_S}.${_S}.${_S}.${_S} fair and square. ${_M}
    Grab a cold can of White, and thanks for spending this much time on my portfolio.
    ${_L}
    Shutting${_M} Down${_M}.${_M}.${_M}.
    `;
    const SHUTDOWN_MAP = [
        NORMAL_SHUTDOWN,
        NORMAL_SHUTDOWN,
        NORMAL_SHUTDOWN,
        SHUTDOWN_3,
        SHUTDOWN_4,
        SHUTDOWN_5,
        SHUTDOWN_6,
        SHUTDOWN_7,
        SHUTDOWN_8,
        '',
        SHUTDOWN_10,
    ];

    const typeText = (
        i: number,
        curText: string,
        text: string,
        setText: React.Dispatch<React.SetStateAction<string>>,
        callback: () => void,
        refOverride?: React.MutableRefObject<string>
    ) => {
        if (refOverride) {
            text = refOverride.current;
        }
        let delayExtra = 0;
        if (i < text.length) {
            if (text[i] === '|') {
                let dumpText = '';
                for (let j = i + 1; j < text.length; j++) {
                    if (text[j] === '|') {
                        i = j + 1;
                        break;
                    }
                    dumpText += text[j];
                }
                setText(curText + dumpText);
                typeText(
                    i,
                    curText + dumpText,
                    text,
                    setText,
                    callback,
                    refOverride
                );
                return;
            }
            if (text[i] === '>') {
                let delayTime = '';
                for (let j = i + 1; j < text.length; j++) {
                    if (text[j] === '<') {
                        i = j + 1;
                        break;
                    }
                    delayTime += text[j];
                }
                delayExtra = parseInt(delayTime);
            }

            setTimeout(() => {
                setText(curText + text[i]);
                typeText(
                    i + 1,
                    curText + text[i],
                    text,
                    setText,
                    callback,
                    refOverride
                );
            }, 20 + delayExtra);
        } else {
            callback();
        }
    };

    useEffect(() => {
        delay(2000).then(() => {
            setLoading(false);
            delay(1000).then(() => {
                const shutdown = SHUTDOWN_MAP[numShutdowns];
                if (numShutdowns === 9) {
                    delay(10000).then(() => {
                        setLoading(true);
                        delay(6000).then(() => {
                            setShutdown(false);
                        });
                    });
                } else if (numShutdowns === 10) {
                    typeText(0, '', shutdown, setText, () => {
                        setLoading(true);
                        delay(6000).then(() => {
                            setLoading(false);
                            setEE(true);
                        });
                    });
                } else {
                    typeText(0, '', shutdown, setText, () => {
                        setLoading(true);
                        delay(6000).then(() => {
                            setShutdown(false);
                        });
                    });
                }
            });
        });
        // eslint-disable-next-line
    }, []);

    return ee ? (
        <div style={styles.imageContainer}>
            <p style={styles.text}>
                {'You shut down AayushOS ten times.\nAchievement unlocked: Most Persistent Visitor.\n\nRefresh the page to boot it again.'}
            </p>
        </div>
    ) : loading ? (
        <div style={styles.shutdown}>
            <div className="blinking-cursor" />
        </div>
    ) : numShutdowns === 10 ? (
        <div style={styles.imageContainer}>
            <p style={styles.text}>{'It is now safe to turn off your computer.'}</p>
        </div>
    ) : (
        <div style={styles.shutdown}>
            <p style={styles.text}>{text}</p>
        </div>
    );
};

const styles: StyleSheetCSS = {
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#1d2e2f',
        padding: 64,
    },
    text: {
        color: 'white',
        fontFamily: 'monospace',
        whiteSpace: 'pre-line',
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#1d2e2f',
        padding: 64,
    },
    img: {
        width: 1000,
        height: 700,
    },
};

export default ShutdownSequence;
