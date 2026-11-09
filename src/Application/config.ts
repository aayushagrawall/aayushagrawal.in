/**
 * Site switches you might want to flip without touching the rest of the code.
 * Change a value, run `npm run build`, deploy.
 */

// The neon "Open to internships" sign on the desk. Set to false to take it down.
export const OPEN_TO_INTERNSHIPS = true;

// Extra desk objects. Flip a value to put an object on the desk or take it off.
export const SHOW_NAMEPLATE = false; // walnut nameplate with the name and title
export const SHOW_RESUME_FRAME = true; // framed resume with a QR code (click opens /cv/)

// New things in preview, before they go live: on only with ?next=1 (remembered for the visit;
// ?next=0 turns them off). NEXT_FOR_EVERYONE = true puts them live for everyone. Right now:
// rain on the window (click it), drag to look around the room, and the room on the phone
// choice screen (src/index.html reads the same sessionStorage key).
export const NEXT_FOR_EVERYONE = false;
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
