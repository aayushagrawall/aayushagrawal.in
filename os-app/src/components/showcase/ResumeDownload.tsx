import React from 'react';
import printer from '../../assets/icons/docIcon.png';
const Resume = `${process.env.PUBLIC_URL}/files/Aayush-Agrawal-Resume.pdf`;

export interface ResumeDownloadProps {
    altText?: string;
}

const ResumeDownload: React.FC<ResumeDownloadProps> = ({ altText }) => {
    return (
        <div style={styles.resumeContainer}>
            <img style={styles.resumePrinter} alt="" src={printer} />
            <div style={styles.resumeContainerText}>
                <h3>{altText ? altText : 'Looking for my resume?'}</h3>
                <a
                    rel="noreferrer"
                    target="_blank"
                    href={Resume}
                    download="Aayush-Agrawal-Resume.pdf"
                >
                    <p>Click here to download it!</p>
                </a>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    resumeContainer: {
        backgroundColor: 'white',
        padding: 12,
        boxSizing: 'border-box',
        border: '2px solid black',
        borderLeftWidth: 0,
        borderRightWidth: 0,
        width: '100%',
        alignItems: 'center',
    },
    resumeContainerText: { flexDirection: 'column' },
    resumePrinter: {
        width: 48,
        height: 48,
        marginRight: 24,
        imageRendering: 'pixelated',
    },
};

export default ResumeDownload;
