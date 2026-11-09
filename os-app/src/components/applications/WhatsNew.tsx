import React from 'react';
import Window from '../os/Window';

export interface WhatsNewProps extends WindowAppProps {}

// The changelog. Newest first; add a new entry at the top when the site changes.
const CHANGES: { date: string; items: string[] }[] = [
    {
        date: '10 November 2026, later',
        items: [
            'On phones the first screen now has a Resume button, so the resume is one tap away, and it says what AayushOS Lite is.',
            'After you tap "Explore the 3D room" on a phone, the room picture stays up with "Loading the room" instead of a black screen, and if the download fails you can try again.',
            'The picture of the room no longer shows hard edges on shorter phones, and the red button is easier to read.',
            'On the resume, project names open their GitHub pages, the contact links are easier to tap on a phone, and the phone number has its country code.',
            'The start-up screen now has a link to the resume, says whose computer it is, and works with the keyboard and screen readers. If your browser cannot draw 3D you get a message with links, not a black page.',
        ],
    },
    {
        date: '10 November 2026',
        items: [
            'Click the window in the 3D room and it starts to rain: drops run down the glass and you can hear it. It also rains there when it is really raining in Bangalore.',
            'Drag to look around the room (with a mouse or a finger); a click still takes you to the desk.',
            'On phones the site opens on the room at night, and the 3D room now fits a phone screen and works with taps. Tap the computer on a phone and AayushOS Lite opens, made for small screens.',
            'The phone version lists every achievement too, the room moves less if you have "reduce motion" on, the sounds are better balanced, and every page has a new picture for when it is shared.',
            'No more START button: the 3D room opens by itself as soon as it has loaded, and if you have been here before you skip the start-up screen. Press Esc while it loads to go straight to the desktop.',
            'Much faster on phones: the 3D room is downloaded only when you choose it.',
            'Phone fixes: pages scroll properly, a tap opens files in the Recycle Bin and devices in Skills, achievement pop-ups no longer cover the close button, and Paint fits the screen.',
        ],
    },
    {
        date: '9 November 2026, night',
        items: [
            'The 3D room is now something to play with: kick the football around, click the bed to turn the lights out, flick the STAY UP neon, and say hi to the cat on the bed (it wakes up and watches you).',
            'A phone on the desk lights up with notifications now and then (tap it for GitHub, LinkedIn or Instagram), and the earbuds case opens.',
            'Small things move: the LED strips breathe, the curtains sway, and the CRT glow flickers a little at night.',
            'Three new achievements to find in the room, and a new picture for when the site is shared.',
        ],
    },
    {
        date: '9 November 2026, later',
        items: [
            'A whole new 3D room: a streetwear bedroom around the old CRT, modelled in Blender with real baked lighting. Sneaker wall, clothes rack, bed, gaming chair, skate decks, a STAY UP neon sign and red LED strips.',
            'Day and night are now two different lighting bakes: click the desk lamp to switch and the whole room relights.',
        ],
    },
    {
        date: '9 November 2026',
        items: [
            'New pixel fonts all over AayushOS, closer to a real Windows 98 screen: a crisp pixel serif for the pages and Pixel Operator for the menus and title bars.',
            'The window you are using now always has the blue title bar, also after closing another window.',
            'The Welcome tips open in the bottom corner, once per visit, and stay out of the way on the 3D monitor (find them in the Start menu).',
            'Tidier Showcase pages: the side menu is tighter and long headings no longer break over two lines.',
            'A calmer desk in 3D: the nameplate is gone, so the screen stands out.',
            'Camera moves in the 3D room now take the same time on slow computers as on fast ones.',
        ],
    },
    {
        date: '6 November 2026',
        items: [
            'About, Experience, Projects and Contact now have their own pages too (aayushagrawal.in/about and friends), fast and easy for Google to find.',
            'The 3D camera now glides on springs: click again mid-flight and it turns around smoothly instead of finishing the trip first.',
            'On phones, pull a window down by its title bar to close it (a quick flick is enough), and pull the Start menu down to put it away.',
            'My skills as a Windows-style Device Manager: open Skills on the desktop and double-click a device.',
            'A desk lamp next to the papers in the 3D room. It switches on by itself at sunset, and you can click it to swap day and night.',
            'Search engines and screen readers now get a plain text version of About, Experience, Projects and Contact.',
            'An "Open to internships" neon sign on the desk that flickers on when you sit down.',
            'The start-up screen now shows your own computer: CPU cores, memory, graphics card and display.',
            'The 3D room downloads about 400 KB less, so it loads faster.',
            'The phone-friendly AayushOS Lite has the CRT look and click sounds too (CRT effect is in the Start menu).',
            'Opened on its own, AayushOS now has the same vintage CRT look and mouse and keyboard clicks as the 3D monitor. Turn the effect off in Display Properties (right-click the desktop).',
            'Click the can on the desk in 3D for a fresh can of White, and a new achievement: Refuel.',
            'The taskbar clock shows live Bangalore weather, and when it rains there you can hear it in the 3D room.',
            'From 5 to 7 pm in Bangalore the 3D room glows with sunset light.',
            'Finish every achievement and you can download a certificate with your name on it.',
            'The visitor counter only ever shows the real visitor count, never a placeholder.',
            'Save my contact card straight to your phone from aayushagrawal.in/cv/.',
            'A skip-to-desktop option on the start screen, suggested automatically when the 3D might be slow.',
            'The coffee mug on the desk is now a cold can of White, my actual fuel.',
            'Chai the desk assistant has been replaced by White, a talking can with the same answers.',
            'The monitor has its full vintage CRT look back: glass smudges, static and scanlines.',
            'A framed poster on the desk with a QR code to my resume. You can click it too.',
            'A Resume button under my name in the 3D view, for anyone in a hurry.',
            'New pixel font: DotGothic16, an open-licence font that is easier to read.',
            'My resume as a web page at aayushagrawal.in/cv/: easy to read on a phone and prints on one page.',
            'After 7 pm in Bangalore the desktop switches to a night wallpaper to match the dark room.',
            'Short links with their own preview cards: aayushagrawal.in/projects, /resume, /about, /experience, /contact.',
            'Click the taskbar clock to see the time in Bangalore and what I am probably up to.',
            'This What’s New window.',
            'The phone version now has achievements, the desk assistant and shareable links too.',
            'Right-click the desktop for wallpapers, Arrange Icons and Refresh.',
            'The taskbar speaker now mutes the whole site, 3D room included.',
            'Keyboard shortcuts: Alt+W switches windows, Alt+M minimises, Alt+Q closes.',
            'Achievements to unlock, and a desk assistant who answers questions about me.',
            'A boot screen with a startup chime, and links like /os/#projects that open a page directly.',
            'Screensaver, Konami code, Welcome tips and This Computer, carried over from the original OS.',
            'The 3D room loads about 40% faster.',
            'New AayushOS, adapted from Henry Heffernan’s portfolio OS with his permission.',
            'Restyled 3D room: orange chair and mug, navy binders, a nameplate and a sticky note.',
            'Paint, a blue-screen 404 page and a retro visitor counter.',
        ],
    },
    {
        date: '5 November 2026',
        items: [
            'aayushagrawal.in launched: a 3D desk with a retro computer you can use.',
            'Terminal (try "sudo hire aayush"), Tetris, Recycle Bin and a phone-friendly version.',
            'Desktop icons for my projects, resume, GitHub, LinkedIn and Instagram.',
        ],
    },
];

const WhatsNew: React.FC<WhatsNewProps> = (props) => {
    return (
        <Window
            top={40}
            left={300}
            width={640}
            height={720}
            windowBarIcon="docSmall"
            windowTitle="What's New - Notepad"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText="Changelog for aayushagrawal.in"
        >
            <div style={styles.page}>
                <div style={styles.menu}>
                    {['File', 'Edit', 'Search', 'Help'].map((m) => (
                        <p key={m} style={styles.menuItem}>
                            <u>{m[0]}</u>
                            {m.slice(1)}
                        </p>
                    ))}
                </div>
                <div style={styles.paper}>
                    <p style={styles.head}>WHAT'S NEW IN AAYUSHOS</p>
                    <p style={styles.line}>==========================</p>
                    {CHANGES.map((c) => (
                        <div key={c.date} style={styles.block}>
                            <p style={styles.date}>[{c.date}]</p>
                            {c.items.map((it, i) => (
                                <p key={i} style={styles.item}>
                                    <span style={styles.dash}>-</span>
                                    <span>{it}</span>
                                </p>
                            ))}
                        </div>
                    ))}
                    <p style={styles.line}>-- end of file --</p>
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    page: { position: 'absolute', inset: 0, flexDirection: 'column', background: '#c0c0c0' },
    menu: { gap: 14, padding: '3px 8px', borderBottom: '1px solid #808080' },
    menuItem: { margin: 0, fontFamily: 'MSSerif', fontSize: 14 },
    paper: { flexDirection: 'column', flex: 1, overflowY: 'auto', background: '#fff', margin: 2, padding: '12px 16px', boxShadow: 'var(--border-field)' },
    head: { margin: 0, fontFamily: 'Terminal, monospace', fontSize: 26 },
    line: { margin: '0 0 10px', fontFamily: 'Terminal, monospace', fontSize: 22, color: '#666' },
    block: { flexDirection: 'column', marginBottom: 14 },
    date: { margin: '0 0 4px', fontFamily: 'Terminal, monospace', fontSize: 24, color: '#0000a3' },
    item: { margin: '2px 0', fontFamily: 'Terminal, monospace', fontSize: 21, lineHeight: 1.15, display: 'flex', gap: 8 },
    dash: { flexShrink: 0 },
};

export default WhatsNew;
