import './style.css';

// The 3D app is its own file, loaded only when it's needed: on a phone, the choice screen
// (src/index.html) holds it back until "Explore the 3D room" is tapped, so a phone that goes to
// AayushOS Lite never downloads or runs the 3D at all.
// The choice screen stays up until 'aos-3d-ready' (the 3D's own loading screen is on the page),
// and comes back with a message on 'aos-3d-failed' (the download didn't make it) so it can be retried.
let busy = false;
const start = () => {
    if (busy) return;
    busy = true;
    import(/* webpackChunkName: "app" */ './Application/Application')
        .then(({ default: Application }) => {
            new Application();
            window.dispatchEvent(new Event('aos-3d-ready'));
        })
        .catch(() => {
            busy = false;
            window.dispatchEvent(new Event('aos-3d-failed'));
        });
};

const w = window as any;
if (w.__aosHold3D) window.addEventListener('aos-start-3d', start);
else start();
