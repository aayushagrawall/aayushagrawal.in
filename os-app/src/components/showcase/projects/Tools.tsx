import React from 'react';
import ResumeDownload from '../ResumeDownload';

export interface ToolProjectsProps {}

const ToolProjects: React.FC<ToolProjectsProps> = () => {
    return (
        <div className="site-page-content">
            <h1>Bots</h1>
            <h3>& Tools</h3>
            <br />
            <p>Bots, Python tools and shortcuts, most of them built because I wanted them myself.</p>
            <br />
            <ResumeDownload />
            <br />
            <div className="text-block">
                <h2>Discord Moderation Bot</h2>
                <p style={styles.meta}>
                    <b>Bot · Python, MongoDB, Discord API · Sep 2024</b>
                </p>
                <br />
                <p>A feature-rich Discord bot that improves the server experience and adds moderation commands, with slash commands and buttons. Built for the Clienterrverse community.</p>
                <br />
                <p>
                    <a rel="noreferrer" target="_blank" href="https://github.com/aayushagrawall/clienterrverse-bot">
                        View on GitHub »
                    </a>
                </p>
                <br />
                <br />
                <h2>QR Code Generator</h2>
                <p style={styles.meta}>
                    <b>Python tool · Oct 2024</b>
                </p>
                <br />
                <p>Turns any URL or text into a scannable QR code, with custom sizing and encoding.</p>
                <br />
                <p>
                    <a rel="noreferrer" target="_blank" href="https://github.com/aayushagrawall/QR-Code-Generator">
                        View on GitHub »
                    </a>
                </p>
                <br />
                <br />
                <h2>Words Per Minute Test</h2>
                <p style={styles.meta}>
                    <b>Python tool · Jan 2025</b>
                </p>
                <br />
                <p>A console typing test that measures WPM and accuracy against random text prompts. My first-semester project.</p>
                <br />
                <p>
                    <a rel="noreferrer" target="_blank" href="https://github.com/aayushagrawall/Typing-Test-using-Python">
                        View on GitHub »
                    </a>
                </p>
                <br />
                <br />
                <h2>Attendance Calculator</h2>
                <p style={styles.meta}>
                    <b>iOS Shortcut</b>
                </p>
                <br />
                <p>An iPhone Shortcut that tells you how many classes you can skip, or must attend, to stay above 85% attendance.</p>
                <br />
                <p>
                    <a rel="noreferrer" target="_blank" href="https://routinehub.co/shortcut/25458/">
                        Get the shortcut »
                    </a>
                </p>
                <br />
                <br />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    meta: { fontSize: 16, marginTop: 4 },
};

export default ToolProjects;
