import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../showcase/Home';
import About from '../showcase/About';
import Window from '../os/Window';
import Experience from '../showcase/Experience';
import Projects from '../showcase/Projects';
import Contact from '../showcase/Contact';
import SoftwareProjects from '../showcase/projects/Software';
import ToolProjects from '../showcase/projects/Tools';
import VerticalNavbar from '../showcase/VerticalNavbar';

export interface ShowcaseExplorerProps extends WindowAppProps {
    initialRoute?: string;
}

// Lets the desktop, Start menu and the Terminal open a specific page.
const RouteBridge: React.FC<{ initialRoute?: string }> = ({ initialRoute }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const first = React.useRef(true);

    // report pages for achievements, and keep the address bar shareable (/os/#projects)
    useEffect(() => {
        window.postMessage({ type: 'aos-page', path: location.pathname }, '*');
        if (first.current) {
            first.current = false;
            return;
        }
        if (window.parent !== window) return;
        const hash = location.pathname === '/' ? '' : '#' + location.pathname.slice(1);
        window.history.replaceState(null, '', window.location.pathname + window.location.search + hash);
    }, [location.pathname]);

    // navigate's identity changes with every page, so keep the latest in a ref
    // and only apply the initial route once
    const nav = React.useRef(navigate);
    nav.current = navigate;
    useEffect(() => {
        if (initialRoute) nav.current(initialRoute);
        const onRoute = (e: Event) => nav.current((e as CustomEvent).detail);
        window.addEventListener('aos-route', onRoute);
        return () => window.removeEventListener('aos-route', onRoute);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};

const ShowcaseExplorer: React.FC<ShowcaseExplorerProps> = (props) => {
    // leave the two columns of desktop icons visible on the left
    const left = 196;
    const initWidth = Math.max(640, window.innerWidth - left - 20);
    const initHeight = Math.max(480, window.innerHeight - 24 - 32 - 20);

    return (
        <Window
            top={24}
            left={left}
            width={initWidth}
            height={initHeight}
            windowTitle="Aayush Agrawal - Showcase 2026"
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'© Copyright 2026 Aayush Agrawal'}
        >
            <Router>
                <RouteBridge initialRoute={props.initialRoute} />
                <div className="site-page">
                    <VerticalNavbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/experience" element={<Experience />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route
                            path="/projects/software"
                            element={<SoftwareProjects />}
                        />
                        <Route
                            path="/projects/tools"
                            element={<ToolProjects />}
                        />
                    </Routes>
                </div>
            </Router>
        </Window>
    );
};

export default ShowcaseExplorer;
