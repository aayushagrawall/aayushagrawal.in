// The vintage CRT look (static, scanlines, glass) when AayushOS is opened on its own.
// On by default; Display Properties can turn it off. Stored per browser.
const KEY = 'aayushos-crt';

export const crtOn = () => {
    try {
        return localStorage.getItem(KEY) !== '0';
    } catch (e) {
        return true;
    }
};

export const setCrt = (on: boolean) => {
    try {
        localStorage.setItem(KEY, on ? '1' : '0');
    } catch (e) {}
    window.dispatchEvent(new Event('aos-crt'));
};
