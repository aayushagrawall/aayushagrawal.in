import React from 'react';
import { isNight } from './night';
// Desktop wallpapers for Display Properties. Kept dark enough for white icon labels.
export type Wallpaper = { id: string; name: string; css: React.CSSProperties };

const px = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

export const WALLPAPERS: Wallpaper[] = [
    { id: 'teal', name: '(None)', css: { backgroundColor: '#207f80' } },
    {
        id: 'tiles',
        name: 'Tiles',
        css: {
            backgroundColor: '#17696a',
            backgroundImage: px(
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" shape-rendering="crispEdges"><rect width="8" height="8" fill="#207f80"/><rect x="8" y="8" width="8" height="8" fill="#207f80"/></svg>'
            ),
        },
    },
    {
        id: 'bricks',
        name: 'Bricks',
        css: {
            backgroundColor: '#7a2f12',
            backgroundImage: px(
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" shape-rendering="crispEdges"><rect width="24" height="16" fill="#8f3a16"/><rect y="7" width="24" height="1" fill="#5c240c"/><rect y="15" width="24" height="1" fill="#5c240c"/><rect x="11" width="1" height="7" fill="#5c240c"/><rect x="23" y="8" width="1" height="7" fill="#5c240c"/></svg>'
            ),
        },
    },
    {
        id: 'cans',
        name: 'Cold Cans',
        css: {
            backgroundColor: '#2c3a48',
            backgroundImage: px(
                '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" shape-rendering="crispEdges"><rect width="32" height="32" fill="#2c3a48"/><rect x="12" y="8" width="8" height="1" fill="#4c6074"/><rect x="11" y="9" width="10" height="15" fill="#3a4b5d"/><rect x="11" y="9" width="10" height="2" fill="#4c6074"/><rect x="18" y="11" width="1" height="13" fill="#47607a"/></svg>'
            ),
        },
    },
    {
        id: 'night',
        name: 'Bangalore Night',
        css: { backgroundColor: '#0b1638', backgroundImage: 'linear-gradient(#0b1638 0%, #1d2f6b 60%, #3a3f7a 100%)' },
    },
    {
        id: 'navy',
        name: 'Navy Plaid',
        css: {
            backgroundColor: '#14206b',
            backgroundImage: px(
                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" shape-rendering="crispEdges"><rect width="20" height="20" fill="#14206b"/><rect y="9" width="20" height="2" fill="#1f2f8f"/><rect x="9" width="2" height="20" fill="#1f2f8f"/><rect x="9" y="9" width="2" height="2" fill="#ff6a1a"/></svg>'
            ),
        },
    },
];

const KEY = 'aayushos-wallpaper';
// The default follows the clock: Bangalore Night after 7 pm IST, teal by day.
// Once someone picks a wallpaper in Display Properties, their choice wins.
export const defaultWallpaper = () => (isNight() ? 'night' : 'teal');
export const getWallpaper = (): Wallpaper => {
    let id = defaultWallpaper();
    try {
        const saved = localStorage.getItem(KEY);
        if (saved && saved !== 'auto') id = saved === 'chai' ? 'cans' : saved;
    } catch (e) {}
    return WALLPAPERS.find((w) => w.id === id) || WALLPAPERS[0];
};
export const savedWallpaperId = () => {
    try {
        return localStorage.getItem(KEY) || 'auto';
    } catch (e) {
        return 'auto';
    }
};
export const saveWallpaper = (id: string) => {
    try {
        localStorage.setItem(KEY, id);
    } catch (e) {}
    window.dispatchEvent(new Event('aos-wallpaper'));
};
