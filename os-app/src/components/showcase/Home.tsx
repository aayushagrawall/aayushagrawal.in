import React, { useEffect, useState } from 'react';
import { Link } from '../general';

export interface HomeProps {}

// 90s hit counter backed by GoatCounter's public count for the home page.
const useVisitorCount = () => {
    const [count, setCount] = useState<number | null>(null);
    useEffect(() => {
        const host = window.location.host || 'aayushagrawal.in';
        const path = encodeURIComponent(host.replace(/^www\./, '') + '/');
        fetch(`https://clienterr.goatcounter.com/counter/${path}.json`)
            .then((r) => r.json())
            .then((j) =>
                setCount((parseInt(String(j.count).replace(/\D/g, ''), 10) || 0) + 1)
            )
            .catch(() => setCount(1));
    }, []);
    return count;
};

const Home: React.FC<HomeProps> = () => {
    const count = useVisitorCount();
    const digits = count === null ? null : String(count).padStart(6, '0');
    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.name}>Aayush Agrawal</h1>
                <h2>Developer &amp; AI/ML Student</h2>
            </div>
            <div style={styles.buttons}>
                <Link containerStyle={styles.link} to="about" text="ABOUT" />
                <Link containerStyle={styles.link} to="experience" text="EXPERIENCE" />
                <Link containerStyle={styles.link} to="projects" text="PROJECTS" />
                <Link containerStyle={styles.link} to="contact" text="CONTACT" />
            </div>
            {digits && (
                <div style={styles.counter}>
                    <p style={styles.counterText}>You are visitor</p>
                    <div style={styles.digits}>
                        {digits.split('').map((d, i) => (
                            <span key={i} style={styles.digit}>
                                {d}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles: StyleSheetCSS = {
    page: {
        left: 0,
        right: 0,
        top: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        textAlign: 'center',
        marginBottom: 64,
        marginTop: 64,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: { justifyContent: 'space-between' },
    link: { padding: 16 },
    name: { fontSize: 72, marginBottom: 16, lineHeight: 0.9 },
    counter: { marginTop: 48, alignItems: 'center' },
    counterText: { fontFamily: 'MSSerif', fontSize: 14, marginRight: 10 },
    digits: {
        background: '#000',
        padding: 3,
        boxShadow: 'inset -1px -1px #fff, inset 1px 1px #808080',
    },
    digit: {
        fontFamily: 'Terminal',
        fontSize: 26,
        lineHeight: 1,
        color: '#39ff14',
        background: '#111',
        padding: '2px 5px',
        marginRight: 2,
        textShadow: '0 0 4px rgba(57,255,20,.7)',
    },
};

export default Home;
