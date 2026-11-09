/**
 * Site switches you might want to flip without touching the rest of the code.
 * Change a value, run `npm run build`, deploy.
 */

// The neon "Open to internships" sign on the desk. Set to false to take it down.
export const OPEN_TO_INTERNSHIPS = true;

// Extra desk objects. Flip a value to put an object on the desk or take it off.
export const SHOW_NAMEPLATE = false; // walnut nameplate with the name and title
export const SHOW_RESUME_FRAME = true; // framed resume with a QR code (click opens /cv/)

// The lo-fi bedroom around the desk (walls, window, LED backlight, shelf, fairy lights).
// false = the original studio backdrop.
export const LOFI_ROOM = false;

// The streetwear bedroom, modelled and light-baked in Blender (scripts/room-blender/).
// Replaces Henry's desk, chair, backdrop and desk props; the CRT and the desk items stay.
// NEW_ROOM_FOR_EVERYONE = false puts it back in preview: then it's on only with ?room=new
// (remembered for the visit; ?room=old turns it off again).
export const NEW_ROOM_FOR_EVERYONE = true;
export const NEW_ROOM: boolean = (() => {
    if (NEW_ROOM_FOR_EVERYONE) return true;
    try {
        const q = new URLSearchParams(window.location.search).get('room');
        if (q === 'new' || q === 'old') sessionStorage.setItem('aayushos-room', q);
        return sessionStorage.getItem('aayushos-room') === 'new';
    } catch (e) {
        return false;
    }
})();

// Things to play with in the room (needs NEW_ROOM): kick the football, click the bed to sleep,
// flick the neon sign, a cat that wakes up and watches you, a phone that gets notifications,
// an earbuds case, and small idle animations. Uses its own bake in static/models/Room2/.
// ROOM_TOYS_FOR_EVERYONE = false keeps it in preview: on only with ?toys=1 (remembered for
// the visit; ?toys=0 turns it off). AayushOS reads the same sessionStorage key, and src/index.html
// preloads Room2's files for it (switch its default too when this goes to everyone).
export const ROOM_TOYS_FOR_EVERYONE = false;
export const ROOM_TOYS: boolean =
    NEW_ROOM &&
    (() => {
        if (ROOM_TOYS_FOR_EVERYONE) return true;
        try {
            const q = new URLSearchParams(window.location.search).get('toys');
            if (q === '1' || q === '0') sessionStorage.setItem('aayushos-toys', q);
            return sessionStorage.getItem('aayushos-toys') === '1';
        } catch (e) {
            return false;
        }
    })();
