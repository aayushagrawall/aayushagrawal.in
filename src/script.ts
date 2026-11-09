import './style.css';

// The 3D app is its own file, loaded only when it's needed: on a phone, the choice screen
// (src/index.html) holds it back until "Explore the 3D room" is tapped, so a phone that goes to
// AayushOS Lite never downloads or runs the 3D at all.
const start = () =>
    import(/* webpackChunkName: "app" */ './Application/Application').then(({ default: Application }) => new Application());

const w = window as any;
if (w.__aosHold3D) window.addEventListener('aos-start-3d', () => start(), { once: true });
else start();
