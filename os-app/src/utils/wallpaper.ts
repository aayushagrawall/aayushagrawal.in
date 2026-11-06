import React from 'react';
// Desktop wallpapers for Display Properties. Kept dark enough for white icon labels.
export type Wallpaper = { id: string; name: string; css: React.CSSProperties };

const px = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

export const WALLPAPERS: Wallpaper[] = [
    { id: 'teal', name: '(None)', css: { backgroundColor: '#3e9697' } },
    {
        id: 'tiles',
        name: 'Tiles',
        css: {
            backgroundColor: '#2f7f80',
            backgroundImage: px(
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" shape-rendering="crispEdges"><rect width="8" height="8" fill="#3e9697"/><rect x="8" y="8" width="8" height="8" fill="#3e9697"/></svg>'
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
        id: 'chai',
        name: 'Chai',
        css: {
            backgroundColor: '#8a4a1a',
            backgroundImage: px(
                '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" shape-rendering="crispEdges"><rect width="32" height="32" fill="#8a4a1a"/><rect x="10" y="12" width="10" height="9" fill="#a85e24"/><rect x="20" y="14" width="2" height="5" fill="#a85e24"/><rect x="12" y="8" width="1" height="3" fill="#a85e24"/><rect x="16" y="7" width="1" height="3" fill="#a85e24"/></svg>'
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
export const getWallpaper = (): Wallpaper => {
    let id = 'teal';
    try {
        id = localStorage.getItem(KEY) || 'teal';
    } catch (e) {}
    return WALLPAPERS.find((w) => w.id === id) || WALLPAPERS[0];
};
export const saveWallpaper = (id: string) => {
    try {
        localStorage.setItem(KEY, id);
    } catch (e) {}
    window.dispatchEvent(new Event('aos-wallpaper'));
};
