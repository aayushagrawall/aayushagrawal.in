import React, { useEffect, useRef, useState } from 'react';
import { IN_MONITOR } from '../../utils/night';
import { crtOn } from '../../utils/crt';

/**
 * The same layers the 3D monitor draws over the screen, for AayushOS on its own:
 * an inner shadow at the edges, two looping static/scanline videos added on top,
 * and faint smudges on the glass. Purely visual: it never takes clicks.
 * Inside the 3D monitor the room already draws these, so this stays off there.
 */
const CrtOverlay: React.FC = () => {
    const [on, setOn] = useState(crtOn());
    const v1 = useRef<HTMLVideoElement>(null);
    const v2 = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const sync = () => setOn(crtOn());
        window.addEventListener('aos-crt', sync);
        return () => window.removeEventListener('aos-crt', sync);
    }, []);

    useEffect(() => {
        if (!on) return;
        // still frames for people who'd rather not see moving static
        const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        [v1.current, v2.current].forEach((v) => {
            if (!v) return;
            if (still) v.pause();
            else v.play().catch(() => {});
        });
    }, [on]);

    if (IN_MONITOR || !on) return null;
    return (
        // no wrapper: each layer is its own fixed element so its blend mode reaches the desktop
        // underneath (a wrapper would form a stacking context and blend only with itself)
        <>
            <img src="/textures/monitor/layers/compressed/shadow-compressed.webp" alt="" aria-hidden style={styles.shadow} />
            <video ref={v1} aria-hidden className="crt-add" style={{ ...styles.layer, opacity: 0.5 }} src="/textures/monitor/video/base-static.mp4" muted loop autoPlay playsInline />
            <video ref={v2} aria-hidden className="crt-add" style={{ ...styles.layer, opacity: 0.1 }} src="/textures/monitor/video/static-texture-layer.mp4" muted loop autoPlay playsInline />
            <img src="/textures/monitor/layers/compressed/smudges.jpg" alt="" aria-hidden className="crt-add" style={{ ...styles.layer, opacity: 0.12 }} />
        </>
    );
};

const styles: StyleSheetCSS = {
    layer: { position: 'fixed', inset: 0, zIndex: 2147483000, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' },
    // lighter than in the 3D monitor so the taskbar and window edges stay readable
    shadow: { opacity: 0.5, position: 'fixed', inset: 0, zIndex: 2147483000, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none' },
};

export default CrtOverlay;
