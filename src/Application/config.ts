/**
 * Site switches you might want to flip without touching the rest of the code.
 * Change a value, run `npm run build`, deploy.
 */

// The neon "Open to internships" sign on the desk. Set to false to take it down.
export const OPEN_TO_INTERNSHIPS = true;

// Extra desk objects. Flip a value to put an object on the desk or take it off.
export const SHOW_NAMEPLATE = false; // walnut nameplate with the name and title
export const SHOW_RESUME_FRAME = true; // framed resume with a QR code (click opens /cv/)

// New things in preview, before they go live: with NEXT_FOR_EVERYONE = false they're on only
// with ?next=1 (remembered for the visit; ?next=0 turns them off). Live now: rain on the window
// (click it), drag to look around the room, and the room on the phone choice screen
// (src/index.html has its own copy of the switch: NEXT_FOR_EVERYONE there too).
export const NEXT_FOR_EVERYONE = true;
export const NEXT: boolean = (() => {
    if (NEXT_FOR_EVERYONE) return true;
    try {
        const q = new URLSearchParams(window.location.search).get('next');
        if (q === '1' || q === '0') sessionStorage.setItem('aayushos-next', q);
        return sessionStorage.getItem('aayushos-next') === '1';
    } catch (e) {
        return false;
    }
})();

// The system's "reduce motion" setting: the room's idle animations (LED strips breathing, curtains
// swaying, the CRT's flicker, floating Zzz, the cat breathing, the phone shivering) stay still.
export const REDUCED_MOTION: boolean = (() => {
    try {
        return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
        return false;
    }
})();

// A touch screen, and a phone (a touch screen under 768 px on its short side: the same test as the
// choice screen in src/index.html). On a phone the 3D room is framed for a tall screen and the
// monitor opens AayushOS Lite (UI/PhoneLite.ts) instead of the desktop AayushOS.
export const TOUCH: boolean = (() => {
    try {
        return typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
    } catch (e) {
        return false;
    }
})();
export const PHONE: boolean = TOUCH && Math.min(window.screen.width, window.screen.height) < 768;
