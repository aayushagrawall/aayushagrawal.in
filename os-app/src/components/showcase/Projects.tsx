import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import software from '../../assets/icons/globeIcon.png';
import tools from '../../assets/icons/terminalIcon.png';

export interface ProjectsProps {}

interface ProjectBoxProps {
    icon: string;
    title: string;
    subtitle: string;
    route: string;
    iconStyle: React.CSSProperties;
}

const ProjectBox: React.FC<ProjectBoxProps> = ({
    icon,
    title,
    subtitle,
    route,
    iconStyle,
}) => {
    const [, setIsHovering] = useState(false);
    const navigation = useNavigate();

    const handleClick = () => {
        navigation(`/projects/${route}`);
    };

    const onMouseEnter = () => {
        setIsHovering(true);
    };

    const onMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div
            onMouseDown={handleClick}
            className="big-button-container"
            style={styles.projectLink}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div style={styles.projectLinkLeft}>
                <img
                    src={icon}
                    style={Object.assign(
                        {},
                        styles.projectLinkImage,
                        iconStyle
                    )}
                    alt=""
                />
                <div style={styles.projectText}>
                    <h1 style={{ fontSize: 48 }}>{title}</h1>
                    <h3>{subtitle}</h3>
                </div>
            </div>
            <div style={styles.projectLinkRight}></div>
        </div>
    );
};

const Projects: React.FC<ProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Projects</h1>
            <h3>& Side Quests</h3>
            <br />
            <p>
                Click on one of the areas below to check out the things I've
                built: websites and apps, plus the bots and tools I made to
                scratch my own itch. Enjoy!
            </p>
            <br />
            <div style={styles.projectLinksContainer}>
                <ProjectBox
                    icon={software}
                    iconStyle={styles.computerIcon}
                    title="Websites & Apps"
                    subtitle="PROJECTS"
                    route="software"
                />
                <ProjectBox
                    icon={tools}
                    iconStyle={styles.computerIcon}
                    title="Bots & Tools"
                    subtitle="PROJECTS"
                    route="tools"
                />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    projectLinksContainer: {
        flexDirection: 'column',
        width: '100%',
        display: 'flex',
        flex: 1,
    },
    projectLink: {
        marginBottom: 24,
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',

        alignItems: 'center',
        justifyContent: 'space-between',
    },
    projectText: {
        justifyContent: 'center',
        flexDirection: 'column',
    },
    projectLinkImage: {
        width: 48,
        // height: 48,
        marginRight: 38,
    },
    projectLinkLeft: {
        marginLeft: 16,
        alignItems: 'center',
    },
    computerIcon: {
        width: 64,
        height: 64,
        imageRendering: 'pixelated',
    },
    musicIcon: {
        width: 48,
        height: 48,
    },
    arrowIcon: {
        width: 48,
        height: 48,
    },
    artIcon: {
        width: 21 * 2,
        height: 37 * 2,
    },
};

export default Projects;
