import React from 'react';
import Window from '../os/Window';
import { IconName } from '../../assets/icons';

export interface LegacyAppProps extends WindowAppProps {
    app: string;
    title: string;
    icon: IconName;
    width: number;
    height: number;
    top: number;
    left: number;
    status?: string;
}

// Aayush's own apps (Terminal, Tetris, Paint, Recycle Bin) live in AayushOS lite.
// Each one runs in single-app mode inside an iframe so its styles stay separate.
const LegacyApp: React.FC<LegacyAppProps> = (props) => {
    return (
        <Window
            top={props.top}
            left={props.left}
            width={props.width}
            height={props.height}
            windowTitle={props.title}
            windowBarIcon={props.icon}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={props.status || '© Copyright 2026 Aayush Agrawal'}
        >
            <iframe
                className="legacy-frame"
                title={props.title}
                src={`/os-lite/?app=${props.app}`}
                style={styles.frame}
            />
        </Window>
    );
};

const styles: StyleSheetCSS = {
    frame: {
        border: 'none',
        width: '100%',
        height: '100%',
        flex: 1,
        display: 'block',
        background: '#c0c0c0',
    },
};

export default LegacyApp;
