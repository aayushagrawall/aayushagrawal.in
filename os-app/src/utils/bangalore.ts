// Bangalore time helpers for the taskbar clock pop-up
export type IstNow = { hour: number; minute: number; weekday: number; day: number; month: number; year: number };

export const istNow = (d = new Date()): IstNow => {
    const ms = d.getTime() + d.getTimezoneOffset() * 60000 + 330 * 60000; // UTC+5:30, no daylight saving
    const t = new Date(ms);
    return { hour: t.getHours(), minute: t.getMinutes(), weekday: t.getDay(), day: t.getDate(), month: t.getMonth(), year: t.getFullYear() };
};

export const fmtTime = (d: Date, timeZone?: string) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', timeZone });

export const activity = (n: IstNow) => {
    const h = n.hour;
    const weekend = n.weekday === 0 || n.weekday === 6;
    if (h < 6) return 'probably asleep';
    if (h < 9) return 'probably having his morning chai';
    if (h < 16) return weekend ? 'probably working on a side project' : 'probably in class at BMSCE';
    if (h < 19) return 'probably building a side project';
    if (h < 22) return 'probably coding or reading docs';
    return 'probably still coding (it is late!)';
};

export const visitorZone = () => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (e) {
        return '';
    }
};

/** "5h 30m ahead of you", or '' when the visitor is in India time */
export const difference = () => {
    const mine = -new Date().getTimezoneOffset(); // minutes east of UTC
    const diff = 330 - mine;
    if (diff === 0) return '';
    const a = Math.abs(diff);
    const s = `${Math.floor(a / 60)}h${a % 60 ? ` ${a % 60}m` : ''}`;
    return diff > 0 ? `Bangalore is ${s} ahead of you.` : `Bangalore is ${s} behind you.`;
};
