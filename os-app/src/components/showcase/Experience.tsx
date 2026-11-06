import React from 'react';
import ResumeDownload from './ResumeDownload';

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = () => {
    return (
        <div className="site-page-content">
            <ResumeDownload />
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>BMS College of Engineering</h1>
                        <a rel="noreferrer" target="_blank" href={'https://bmsce.ac.in'}>
                            <h4>bmsce.ac.in</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>B.E. Artificial Intelligence &amp; Machine Learning</h3>
                        <b>
                            <p>Expected 2028</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>Undergraduate in AI &amp; ML in Bengaluru, studying machine learning, data structures, computer networks and more.</p>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>BMSCE UTSAV</h1>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Student Volunteer</h3>
                        <b>
                            <p>2025 - 2026</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <ul>
                    <li>
                        <p>Managed end-to-end distribution of festival merchandise across sales counters.</p>
                    </li>
                    <li>
                        <p>Worked with committee members on merchandise strategy and sales targets for the fest.</p>
                    </li>
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Rotaract Club of BMSCE</h1>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Member</h3>
                        <b>
                            <p>2023 - 2024</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <ul>
                    <li>
                        <p>Took part in community service and leadership initiatives across Bengaluru.</p>
                    </li>
                    <li>
                        <p>Contributed 40+ hours of social and community service.</p>
                    </li>
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Schooling</h1>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Mayo College, Ajmer · Shiv Jyoti International School, Kota</h3>
                        <b>
                            <p>2012 - 2024</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>CBSE Grade 5 to 10 at Mayo College, then Grade 11 and 12 (Physics, Chemistry, Math) at Shiv Jyoti International School.</p>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Certifications</h1>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>C for Beginners (Great Learning) · Using MongoDB with Python (MongoDB)</h3>
                        <b>
                            <p>2024 - 2025</p>
                        </b>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    header: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    skillRow: {
        flex: 1,
        justifyContent: 'space-between',
    },
    skillName: {
        minWidth: 56,
    },
    skill: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        background: 'red',
        marginLeft: 8,
        height: 8,
    },
    hoverLogo: {
        height: 32,
        marginBottom: 16,
    },
    headerContainer: {
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'center',
    },
    hoverText: {
        marginBottom: 8,
    },
    indent: {
        marginLeft: 24,
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default Experience;
