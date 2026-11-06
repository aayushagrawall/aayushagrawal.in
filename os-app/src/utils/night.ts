/**
 * Same rule as the 3D room's "Bangalore night" look: 7 pm to 6 am IST, with
 * ?night=1 / ?night=0 on the page (or on the 3D page around the monitor) to force it.
 * Decided once per page load, like the room.
 */
const decide = (): boolean => {
    const read = (search: string) => new URLSearchParams(search).get('night');
    let q = read(window.location.search);
    if (q === null && window.parent !== window) {
        try {
            q = read(window.parent.location.search);
        } catch (e) {}
    }
    if (q === '1') return true;
    if (q === '0') return false;
    const now = new Date();
    const ist = (now.getUTCHours() + now.getUTCMinutes() / 60 + 5.5) % 24;
    return ist >= 19 || ist < 6;
};

export const NIGHT = decide();
export const IN_MONITOR = window.parent !== window;
