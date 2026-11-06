/**
 * Live Bangalore weather from Open-Meteo (free, no key). Cached for 15 minutes in
 * sessionStorage under the same key the 3D room and AayushOS Lite use, so one visit
 * makes one request.
 */
export type Weather = { temp: number; code: number; isDay: boolean; text: string; rain: boolean };

const KEY = 'aayushos-weather';
const URL =
    'https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,weather_code,is_day&timezone=Asia%2FKolkata';

export const describe = (code: number): string => {
    if (code === 0) return 'clear skies';
    if (code === 1) return 'mostly clear';
    if (code === 2) return 'partly cloudy';
    if (code === 3) return 'overcast';
    if (code === 45 || code === 48) return 'foggy';
    if (code >= 51 && code <= 57) return 'drizzle';
    if (code === 61 || code === 80) return 'light rain';
    if (code === 63 || code === 81) return 'rain';
    if (code === 65 || code === 82) return 'heavy rain';
    if (code === 66 || code === 67) return 'freezing rain';
    if (code >= 71 && code <= 77) return 'snow (in Bangalore?!)';
    if (code >= 95) return 'thunderstorms';
    return 'weather';
};
export const isRain = (code: number) => (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;

const shape = (temp: number, code: number, isDay: boolean): Weather => ({
    temp: Math.round(temp),
    code,
    isDay,
    text: describe(code),
    rain: isRain(code),
});

let pending: Promise<Weather | null> | null = null;
export const getWeather = (): Promise<Weather | null> => {
    try {
        const c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
        if (c && Date.now() - c.t < 15 * 60 * 1000) return Promise.resolve(shape(c.temp, c.code, c.isDay));
    } catch (e) {}
    if (pending) return pending;
    pending = fetch(URL)
        .then((r) => r.json())
        .then((j) => {
            const cur = j && j.current;
            if (!cur || typeof cur.temperature_2m !== 'number') return null;
            const w = { t: Date.now(), temp: cur.temperature_2m, code: cur.weather_code, isDay: cur.is_day === 1 };
            try {
                sessionStorage.setItem(KEY, JSON.stringify(w));
            } catch (e) {}
            return shape(w.temp, w.code, w.isDay);
        })
        .catch(() => null);
    return pending;
};
