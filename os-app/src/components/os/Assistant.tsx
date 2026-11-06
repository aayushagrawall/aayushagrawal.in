import React, { useEffect, useRef, useState } from 'react';
import { achieve } from '../achievements/list';
import { track } from '../../utils/track';

/**
 * "Chai", Aayush's desk assistant: a cup of chai that answers common questions.
 * Answers are written ahead of time (no AI, no network). Open it with
 * window.postMessage({ type: 'aos-assistant' }, '*') or from the Start menu.
 */

type Action = { label: string; app: string; route?: string };
type QA = { q: string; a: string; actions?: Action[] };

const QAS: QA[] = [
    {
        q: 'Who is Aayush?',
        a: "He's an AI & Machine Learning undergrad at BMS College of Engineering in Bangalore, graduating in 2028. He builds small, useful software: Python tools, Discord bots and websites.",
        actions: [{ label: 'About me', app: 'showcase', route: '/about' }],
    },
    {
        q: "What's his tech stack?",
        a: 'Python, JavaScript, Java and C, plus HTML & CSS, Node.js, Discord.js, MySQL, MongoDB, machine learning and Git.',
    },
    {
        q: 'Which project should I look at first?',
        a: 'Start with clienterr.com and imgurr.me on the Websites page. If you like bots, the Discord moderation bot is under Bots & Tools.',
        actions: [
            { label: 'Websites', app: 'showcase', route: '/projects/software' },
            { label: 'Bots & Tools', app: 'showcase', route: '/projects/tools' },
        ],
    },
    {
        q: 'Can I see his resume?',
        a: "Of course. It's one page, and you can download it too.",
        actions: [{ label: 'Open resume', app: 'resume' }],
    },
    {
        q: 'Is he open to internships?',
        a: "Best to ask him directly! Send a message from the Contact page or email agrawal.aayush38@gmail.com and he'll get back to you.",
        actions: [{ label: 'Contact', app: 'showcase', route: '/contact' }],
    },
    {
        q: 'How was this site built?',
        a: "The desk is a Three.js scene, and this desktop is a React app adapted from Henry Heffernan's portfolio, with his permission. Terminal, Tetris and Paint are Aayush's own.",
        actions: [{ label: 'Credits', app: 'credits' }],
    },
    {
        q: 'Any secrets?',
        a: 'A few. Type "sudo hire aayush" in the Terminal, try the Konami code, peek in the Recycle Bin, or keep pressing Shut Down. Your progress is in Achievements.',
        actions: [{ label: 'Achievements', app: 'achievements' }],
    },
];

const SESSION_KEY = 'aayushos-chai-shown';

const ChaiCup: React.FC<{ blink: boolean }> = ({ blink }) => (
    <svg width="96" height="104" viewBox="0 0 24 26" shapeRendering="crispEdges" aria-hidden>
        {/* steam */}
        <g className="chai-steam" fill="#ffffff" opacity="0.9">
            <rect x="8" y="0" width="1" height="2" />
            <rect x="9" y="2" width="1" height="2" />
            <rect x="13" y="1" width="1" height="2" />
            <rect x="12" y="3" width="1" height="2" />
        </g>
        {/* handle */}
        <rect x="19" y="10" width="3" height="1" fill="#000" />
        <rect x="21" y="11" width="1" height="5" fill="#000" />
        <rect x="19" y="16" width="3" height="1" fill="#000" />
        {/* cup */}
        <rect x="3" y="6" width="17" height="1" fill="#000" />
        <rect x="3" y="7" width="1" height="12" fill="#000" />
        <rect x="19" y="7" width="1" height="12" fill="#000" />
        <rect x="4" y="19" width="15" height="1" fill="#000" />
        <rect x="5" y="20" width="13" height="1" fill="#000" />
        <rect x="4" y="7" width="15" height="2" fill="#96400a" />
        <rect x="4" y="9" width="15" height="10" fill="#e8b478" />
        <rect x="4" y="9" width="2" height="10" fill="#f5cf9e" />
        <rect x="5" y="19" width="13" height="1" fill="#cd8c50" />
        {/* face */}
        {blink ? (
            <>
                <rect x="8" y="12" width="2" height="1" fill="#000" />
                <rect x="13" y="12" width="2" height="1" fill="#000" />
            </>
        ) : (
            <>
                <rect x="8" y="11" width="2" height="2" fill="#000" />
                <rect x="13" y="11" width="2" height="2" fill="#000" />
                <rect x="8" y="11" width="1" height="1" fill="#fff" />
                <rect x="13" y="11" width="1" height="1" fill="#fff" />
            </>
        )}
        <rect x="7" y="14" width="1" height="1" fill="#ff8a7a" />
        <rect x="15" y="14" width="1" height="1" fill="#ff8a7a" />
        <rect x="10" y="15" width="3" height="1" fill="#000" />
        <rect x="9" y="14" width="1" height="1" fill="#000" />
        <rect x="13" y="14" width="1" height="1" fill="#000" />
        {/* saucer */}
        <rect x="1" y="22" width="22" height="1" fill="#000" />
        <rect x="2" y="21" width="20" height="1" fill="#ff6a1a" />
        <rect x="3" y="23" width="18" height="1" fill="#000" />
    </svg>
);

const Assistant: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<QA | null>(null);
    const [blink, setBlink] = useState(false);
    // step aside while the Welcome tips are open
    const [welcomeOpen, setWelcomeOpen] = useState(!!(window as any).__aosWelcomeOpen);
    useEffect(() => {
        const sync = () => setWelcomeOpen(!!(window as any).__aosWelcomeOpen);
        window.addEventListener('aos-welcome-change', sync);
        return () => window.removeEventListener('aos-welcome-change', sync);
    }, []);
    const asked = useRef(new Set<string>());

    useEffect(() => {
        const onMsg = (e: MessageEvent) => {
            if (e.data && e.data.type === 'aos-assistant') {
                setCurrent(null);
                setOpen(true);
            }
        };
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        window.addEventListener('message', onMsg);
        // say hi once per visit, after people have had a look around
        let shown = false;
        try {
            shown = sessionStorage.getItem(SESSION_KEY) === '1';
        } catch (e) {}
        let t: ReturnType<typeof setTimeout> | undefined;
        const greet = () => {
            // don't talk over the Welcome tips; try again once they're closed
            if ((window as any).__aosWelcomeOpen) {
                t = setTimeout(greet, 5000);
                return;
            }
            setOpen(true);
            try {
                sessionStorage.setItem(SESSION_KEY, '1');
            } catch (e) {}
        };
        if (!shown) t = setTimeout(greet, 25000);
        return () => {
            window.removeEventListener('message', onMsg);
            window.removeEventListener('keydown', onKey);
            if (t) clearTimeout(t);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const t = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 160);
        }, 3200);
        return () => clearInterval(t);
    }, [open]);

    const ask = (qa: QA) => {
        setCurrent(qa);
        track('chai/' + qa.q.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''), 'Asked Chai: ' + qa.q);
        asked.current.add(qa.q);
        if (asked.current.size >= 3) achieve('chatty');
    };

    const act = (a: Action) => window.postMessage({ type: 'aos-open', app: a.app, route: a.route }, '*');

    if (!open || welcomeOpen) return null;
    return (
        <div style={styles.wrap} onMouseDown={(e) => e.stopPropagation()}>
            <div style={styles.bubble}>
                <button style={styles.x} aria-label="Close" onMouseDown={() => setOpen(false)}>
                    ×
                </button>
                {!current ? (
                    <>
                        <p style={styles.text}>
                            Hi! I'm <b>Chai</b>, Aayush's desk assistant. What would you like to know?
                        </p>
                        <div style={styles.qs}>
                            {QAS.map((qa) => (
                                <p key={qa.q} className="chai-q" style={styles.q} onMouseDown={() => ask(qa)}>
                                    {qa.q}
                                </p>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <p style={styles.qTitle}>{current.q}</p>
                        <p style={styles.text}>{current.a}</p>
                        <div style={styles.actions}>
                            {(current.actions || []).map((a) => (
                                <button key={a.label} className="site-button" style={styles.btn} onMouseDown={() => act(a)}>
                                    {a.label}
                                </button>
                            ))}
                            <button className="site-button" style={styles.btn} onMouseDown={() => setCurrent(null)}>
                                Ask something else
                            </button>
                        </div>
                    </>
                )}
                <div style={styles.tail} />
            </div>
            <div style={styles.cup} onMouseDown={() => setCurrent(null)} title="Chai">
                <ChaiCup blink={blink} />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    wrap: {
        position: 'fixed',
        right: 18,
        bottom: 44,
        zIndex: 120000,
        flexDirection: 'column',
        alignItems: 'flex-end',
        animation: 'aos-chai-in 0.3s steps(6)',
    },
    bubble: {
        position: 'relative',
        width: 330,
        flexDirection: 'column',
        background: '#ffffe1',
        border: '1px solid #000',
        borderRadius: 10,
        padding: '12px 14px',
        marginBottom: 14,
        marginRight: 30,
        boxShadow: '3px 3px 0 rgba(0,0,0,0.35)',
    },
    tail: {
        position: 'absolute',
        right: 26,
        bottom: -11,
        width: 18,
        height: 18,
        background: '#ffffe1',
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000',
        transform: 'rotate(45deg)',
    },
    x: {
        position: 'absolute',
        top: 4,
        right: 6,
        border: 'none',
        background: 'transparent',
        fontSize: 18,
        lineHeight: 1,
        cursor: 'pointer',
        padding: 2,
    },
    text: { margin: '0 10px 0 0', fontSize: 16, lineHeight: 1.4 },
    qTitle: { margin: '0 14px 6px 0', fontFamily: 'MillenniumBold, serif', fontSize: 16 },
    qs: { flexDirection: 'column', marginTop: 8 },
    q: { margin: '3px 0', fontSize: 15, color: '#0000a3', textDecoration: 'underline', cursor: 'pointer' },
    actions: { flexWrap: 'wrap', gap: 6, marginTop: 10 },
    btn: { padding: '4px 10px', fontFamily: 'MSSerif', fontSize: 13 },
    cup: { cursor: 'pointer' },
};

export default Assistant;
