/**
 * Same rule as the 3D room's "Bangalore night" look: 7 pm to 6 am IST, with
 * ?night=1 / ?night=0 (or ?time=night / day / sunset) on the page, or on the 3D page
 * around the monitor, to force it.
 * Decided once per page load, like the room.
 */
const decide = (): boolean => {
    const read = (search: string) => {
        const p = new URLSearchParams(search);
        const t = p.get('time');
        if (t) return t === 'night' ? '1' : '0';
        return p.get('night');
    };
    let q = read(window.location.search);
    if (q === null && window.parent !== window) {
        try {
            q = read(window.parent.location.search);
        } catch (e) {}
    }
    if (q === '1') return true;
    if (q === '0') return false;
    // the desk lamp in the 3D room can switch day/night for the visit
    try {
        const s = sessionStorage.getItem('aayushos-time');
        if (s) return s === 'night';
    } catch (e) {}
    const now = new Date();
    const ist = (now.getUTCHours() + now.getUTCMinutes() / 60 + 5.5) % 24;
    return ist >= 19 || ist < 6;
};

let night = decide();
/** True while the desktop is in its night look. Changes when the 3D room's lamp is clicked. */
export const isNight = () => night;
export const NIGHT = night; // the value at page load
window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || d.type !== 'aos-time') return;
    const next = d.time === 'night';
    if (next === night) return;
    night = next;
    window.dispatchEvent(new Event('aos-night-change'));
    window.dispatchEvent(new Event('aos-wallpaper')); // the automatic wallpaper follows
});
export const IN_MONITOR = window.parent !== window;
