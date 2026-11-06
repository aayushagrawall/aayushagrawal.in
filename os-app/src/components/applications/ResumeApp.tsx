import React from 'react';
import Window from '../os/Window';
import { track } from '../../utils/track';
const Resume = `${process.env.PUBLIC_URL}/files/Aayush-Agrawal-Resume.pdf`;

const ResumeApp: React.FC<WindowAppProps> = (props) => {
    return (
        <Window
            top={30}
            left={320}
            width={780}
            height={820}
            windowTitle="Resume.pdf"
            windowBarIcon="docSmall"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'Aayush-Agrawal-Resume.pdf'}
        >
            <div style={styles.wrap}>
                <div style={styles.bar}>
                    <a className="site-button" href={Resume} download="Aayush-Agrawal-Resume.pdf" onClick={() => track('resume/download', 'Downloaded resume')}>
                        Download
                    </a>
                    <a className="site-button" href={Resume} target="_blank" rel="noreferrer">
                        Open in new tab
                    </a>
                </div>
                <iframe title="Resume" src={`${Resume}#view=FitH`} style={styles.frame} className="legacy-frame" />
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    wrap: { flexDirection: 'column', width: '100%', height: '100%', flex: 1 },
    bar: { padding: 8, gap: 8, background: '#c3c6ca' },
    frame: { border: 'none', flex: 1, width: '100%', background: '#808080' },
};

export default ResumeApp;
