// Every achievement in AayushOS. Unlock one from anywhere (including apps in
// iframes) with: window.postMessage({ type: 'aos-achieve', id }, '*')

export type Achievement = { id: string; title: string; hint: string; done: string };

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'explorer', title: 'Explorer', hint: 'Open every app on the desktop.', done: 'Opened every app on the desktop.' },
    { id: 'reader', title: 'Background Check', hint: 'Read every page of My Showcase.', done: 'Read About, Experience, Projects and Contact.' },
    { id: 'resume', title: 'Due Diligence', hint: 'Take a look at the resume.', done: 'Opened the resume.' },
    { id: 'recruiter', title: 'Root Access', hint: 'Find the magic words for the Terminal.', done: 'Ran sudo hire aayush.' },
    { id: 'konami', title: 'Old School', hint: 'Some codes never get old.', done: 'Entered the Konami code.' },
    { id: 'tetris', title: 'Block Party', hint: 'Score 1,000 points in Tetris.', done: 'Scored 1,000 points in Tetris.' },
    { id: 'tetris4', title: 'Line Cook', hint: 'Clear four lines at once in Tetris.', done: 'Cleared four lines at once.' },
    { id: 'codele', title: 'Codebreaker', hint: 'Win a game of Codele.', done: 'Solved Codele.' },
    { id: 'artist', title: 'Artist', hint: 'Save a drawing from Paint.', done: 'Saved a Paint masterpiece.' },
    { id: 'dumpster', title: 'Dumpster Diver', hint: "Peek inside something that's been thrown away.", done: 'Opened a file in the Recycle Bin.' },
    { id: 'afk', title: 'AFK', hint: 'Step away from the computer for a while.', done: 'Watched the screensaver.' },
    { id: 'chatty', title: 'Small Talk', hint: 'Ask Chai three questions.', done: 'Asked Chai three questions.' },
    { id: 'shutdown', title: 'Persistent', hint: 'Try to turn the computer off. A few times.', done: 'Shut down AayushOS five times.' },
    { id: 'night', title: 'Night Owl', hint: 'Visit when Bangalore is asleep.', done: 'Visited between midnight and 5 am IST.' },
    { id: 'all', title: 'Completionist', hint: 'Unlock every other achievement.', done: 'Unlocked everything. Respect.' },
];

// Apps that count towards "Explorer"
export const EXPLORER_APPS = ['showcase', 'resume', 'terminal', 'tetris', 'paint', 'mycomputer', 'wordle', 'recycle', 'credits', 'achievements'];
export const READER_PAGES = ['/about', '/experience', '/projects', '/contact'];

const KEY = 'aayushos-achievements';
const SEEN_APPS = 'aayushos-seen-apps';
const SEEN_PAGES = 'aayushos-seen-pages';

const load = (k: string): string[] => {
    try {
        const v = JSON.parse(localStorage.getItem(k) || '[]');
        return Array.isArray(v) ? v : [];
    } catch (e) {
        return [];
    }
};
const save = (k: string, v: string[]) => {
    try {
        localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
};

export const getUnlocked = () => load(KEY);

/** Records an achievement. Returns true when it is new. */
export const record = (id: string): boolean => {
    if (!ACHIEVEMENTS.some((a) => a.id === id)) return false;
    const got = load(KEY);
    if (got.includes(id)) return false;
    got.push(id);
    save(KEY, got);
    return true;
};

/** Adds an item to a progress list; returns true once every item is seen. */
const progress = (k: string, item: string, all: string[]) => {
    const seen = load(k);
    if (!seen.includes(item)) {
        seen.push(item);
        save(k, seen);
    }
    return all.every((a) => seen.includes(a));
};
export const seenApp = (app: string) => EXPLORER_APPS.includes(app) && progress(SEEN_APPS, app, EXPLORER_APPS);
export const seenPage = (path: string) => {
    const page = READER_PAGES.find((p) => path === p || path.startsWith(p + '/'));
    return !!page && progress(SEEN_PAGES, page, READER_PAGES);
};
export const counts = () => ({ apps: load(SEEN_APPS).length, pages: load(SEEN_PAGES).length });

export const achieve = (id: string) => window.postMessage({ type: 'aos-achieve', id }, '*');
