/**
 * Counts an event in GoatCounter (shown under "Events" in the dashboard).
 * Inside the 3D monitor the OS has no GoatCounter of its own, so it uses the
 * 3D page's (same origin). Each event is counted once per visit.
 */
export const track = (path: string, title?: string) => {
    try {
        const key = 'aayushos-tracked';
        const done: string[] = JSON.parse(sessionStorage.getItem(key) || '[]');
        if (done.includes(path)) return;
        let gc: any = (window as any).goatcounter;
        if ((!gc || !gc.count) && window.parent !== window) gc = (window.parent as any).goatcounter;
        if (!gc || !gc.count) return;
        gc.count({ path: 'os/' + path, title: title || path, event: true });
        done.push(path);
        sessionStorage.setItem(key, JSON.stringify(done));
    } catch (e) {}
};
