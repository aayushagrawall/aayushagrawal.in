import React from 'react';
import ResumeDownload from '../ResumeDownload';

export interface SoftwareProjectsProps {}

const SoftwareProjects: React.FC<SoftwareProjectsProps> = () => {
    return (
        <div className="site-page-content">
            <h1>Websites</h1>
            <h3>& Apps</h3>
            <br />
            <p>Things I've built for the web, from a file-sharing app to the site you're on right now.</p>
            <br />
            <ResumeDownload />
            <br />
            <div className="text-block">
                <h2>aayushagrawal.in</h2>
                <p style={styles.meta}>
                    <b>3D portfolio · Three.js, TypeScript, React</b>
                </p>
                <br />
                <p>The website you are on right now. A Three.js desk scene with a retro computer, and this OS running on its screen. The 3D scene is based on Henry Heffernan's open-source portfolio, and the OS is adapted from his with his permission.</p>
                <br />
                <p>
                    <a rel="noreferrer" target="_blank" href="https://github.com/aayushagrawall/aayushagrawal.in">
                        View on GitHub »
                    </a>
                </p>
                <br />
                <br />
                <h2>imgurr.me</h2>
                <p style={styles.meta}>
                    <b>Web app · JavaScript</b>
                </p>
                <br />
                <p>Share an image or a short video without making an account. Drop a file, get a link, send it. Files up to 10 MB.</p>
                <br />
                <p>
                    <a rel="noreferrer" target="_blank" href="https://imgurr.me/">
                        Open imgurr.me »
                    </a>
                </p>
                <br />
                <br />
                <h2>clienterr.com</h2>
                <p style={styles.meta}>
                    <b>Website · JavaScript</b>
                </p>
                <br />
                <p>The website for the Clienterrverse community, built together with other open-source developers.</p>
                <br />
                <p>
                    <a rel="noreferrer" target="_blank" href="https://github.com/aayushagrawall/clienterr.com">
                        View on GitHub »
                    </a>
                </p>
                <br />
                <br />
                <h2>aayushagrawal.codes</h2>
                <p style={styles.meta}>
                    <b>Website · HTML, CSS, JavaScript</b>
                </p>
                <br />
                <p>My minimal portfolio: light and dark themes, no build step, hosted on GitHub Pages.</p>
                <br />
                <p>
                    <a rel="noreferrer" target="_blank" href="https://aayushagrawal.codes">
                        Visit site »
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

export default SoftwareProjects;
