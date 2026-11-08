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
export const NEW_ROOM = true;
