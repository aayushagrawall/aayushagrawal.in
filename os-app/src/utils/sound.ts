/**
 * One mute switch for the whole site, stored in localStorage. Other pages on the
 * same site (the 3D scene, apps in iframes) hear about changes through the
 * browser's "storage" event.
 */
const KEY = 'aayushos-muted';

export const isMuted = () => {
    try {
        return localStorage.getItem(KEY) === '1';
    } catch (e) {
        return false;
    }
};

export const setMuted = (muted: boolean) => {
    try {
        localStorage.setItem(KEY, muted ? '1' : '0');
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('aos-mute', { detail: muted }));
};

/** Calls back with the new value whenever this page or another one changes it. */
export const onMuteChange = (cb: (muted: boolean) => void) => {
    const local = (e: Event) => cb((e as CustomEvent).detail);
    const other = (e: StorageEvent) => {
        if (e.key === KEY) cb(e.newValue === '1');
    };
    window.addEventListener('aos-mute', local);
    window.addEventListener('storage', other);
    return () => {
        window.removeEventListener('aos-mute', local);
        window.removeEventListener('storage', other);
    };
};
