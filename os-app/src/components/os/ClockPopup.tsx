import React, { useEffect, useState } from 'react';
import { activity, difference, fmtTime, istNow, visitorZone } from '../../utils/bangalore';

export interface ClockPopupProps {
    onClose: () => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Taskbar clock pop-up: Bangalore time, a calendar and what Aayush is probably up to
const ClockPopup: React.FC<ClockPopupProps> = ({ onClose }) => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        const onDown = () => onClose();
        window.addEventListener('keydown', onKey);
        const t2 = setTimeout(() => window.addEventListener('mousedown', onDown), 0);
        return () => {
            clearInterval(t);
            clearTimeout(t2);
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('mousedown', onDown);
        };
    }, [onClose]);

    const ist = istNow(now);
    const first = new Date(ist.year, ist.month, 1).getDay();
    const days = new Date(ist.year, ist.month + 1, 0).getDate();
    const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
    while (cells.length % 7) cells.push(null);

    const zone = visitorZone();
    const sameZone = /Calcutta|Kolkata/.test(zone);
    const city = zone.split('/').pop()?.replace(/_/g, ' ');
    const diff = difference();

    return (
        <div style={styles.pop} onMouseDown={(e) => e.stopPropagation()}>
            <div style={styles.bar}>
                <p style={styles.barText}>Date/Time · Bangalore, India</p>
                <button style={styles.x} onMouseDown={onClose} aria-label="Close">
                    ×
                </button>
            </div>
            <div style={styles.body}>
                <p style={styles.time}>{fmtTime(now, 'Asia/Kolkata')}</p>
                <p style={styles.date}>
                    {DAYS[ist.weekday]}, {ist.day} {MONTHS[ist.month]} {ist.year} · IST
                </p>
                <div style={styles.cal}>
                    <div style={styles.calHead}>
                        <p style={styles.month}>
                            {MONTHS[ist.month]} {ist.year}
                        </p>
                    </div>
                    <div style={styles.grid}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <p key={'h' + i} style={{ ...styles.cell, ...styles.dow }}>
                                {d}
                            </p>
                        ))}
                        {cells.map((c, i) => (
                            <p key={i} style={{ ...styles.cell, ...(c === ist.day ? styles.today : {}) }}>
                                {c || ''}
                            </p>
                        ))}
                    </div>
                </div>
                <div style={styles.status}>
                    <p style={styles.statusText}>
                        It's {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })} in Bangalore, so
                        Aayush is <b>{activity(ist)}</b>.
                    </p>
                    <p style={styles.small}>
                        {sameZone
                            ? "You're in the same time zone as Aayush!"
                            : `Your time: ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}${city ? ` (${city})` : ''}. ${diff}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    pop: {
        position: 'absolute',
        right: 4,
        bottom: 34,
        width: 300,
        zIndex: 100001,
        flexDirection: 'column',
        background: '#c3c6ca',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        padding: 3,
    },
    bar: { background: '#0000a3', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px' },
    barText: { margin: 0, color: '#fff', fontFamily: 'lores-15-bold-alt-oakland, MSSerif', fontSize: 13 },
    x: { border: 'none', background: '#c3c6ca', width: 16, height: 14, padding: 0, lineHeight: '12px', fontSize: 13, cursor: 'pointer' },
    body: { flexDirection: 'column', padding: '10px 10px 8px' },
    time: { margin: 0, fontFamily: 'MillenniumBold, serif', fontSize: 30 },
    date: { margin: '2px 0 10px', fontFamily: 'MSSerif', fontSize: 13 },
    cal: { flexDirection: 'column', background: '#fff', boxShadow: 'var(--border-field)', padding: 6 },
    calHead: { justifyContent: 'center', background: '#0000a3', marginBottom: 4 },
    month: { margin: 2, color: '#fff', fontFamily: 'MSSerif', fontSize: 13 },
    grid: { flexWrap: 'wrap' },
    cell: { width: `${100 / 7}%`, margin: 0, textAlign: 'center', fontFamily: 'MSSerif', fontSize: 13, lineHeight: '20px', display: 'block' },
    dow: { color: '#0000a3' },
    today: { background: '#ff6a1a', color: '#fff' },
    status: { flexDirection: 'column', marginTop: 10, background: '#ffffe1', boxShadow: 'var(--border-field)', padding: '8px 10px' },
    statusText: { margin: 0, fontSize: 15, lineHeight: 1.35 },
    small: { margin: '6px 0 0', fontSize: 13, color: '#444' },
};

export default ClockPopup;
