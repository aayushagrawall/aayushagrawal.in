/**
 * On a phone, the CRT opens AayushOS Lite (the phone-friendly AayushOS) full screen over the 3D
 * room, with a button back to the room. It stays loaded, so coming back to it picks up where
 * you were.
 */
let box: HTMLDivElement | null = null;

export function openPhoneLite() {
    if (!box) {
        box = document.createElement('div');
        box.id = 'phone-lite';
        box.style.cssText = 'position:fixed;inset:0;z-index:100001;background:#000;display:none';
        // a bar on top with the way back, and Lite below it
        const bar = document.createElement('div');
        bar.style.cssText =
            "position:absolute;left:0;right:0;top:0;height:calc(46px + env(safe-area-inset-top));padding-top:env(safe-area-inset-top);box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;padding-left:10px;padding-right:14px;background:#0b0c10;color:#aeb0bd;font:13px system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
        const back = document.createElement('button');
        back.type = 'button';
        back.textContent = '\u2190 Back to the room';
        back.style.cssText =
            "padding:8px 12px;border:1.5px solid rgba(255,255,255,.6);border-radius:999px;background:transparent;color:#fff;font:600 13px system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;cursor:pointer";
        const label = document.createElement('span');
        label.textContent = 'AayushOS Lite';
        bar.appendChild(back);
        bar.appendChild(label);
        const frame = document.createElement('iframe');
        frame.src = 'os-lite/';
        frame.title = 'AayushOS Lite';
        frame.style.cssText = 'position:absolute;left:0;right:0;bottom:0;top:calc(46px + env(safe-area-inset-top));width:100%;height:calc(100% - 46px - env(safe-area-inset-top));border:0';
        back.onclick = () => {
            box!.style.display = 'none';
            document.body.style.touchAction = 'none'; // the room handles drags itself again
        };
        box.appendChild(bar);
        box.appendChild(frame);
        document.body.appendChild(box);
    }
    box.style.display = 'block';
    // the room turns the browser's own touch scrolling off; Lite needs it back to scroll its pages
    document.body.style.touchAction = 'auto';
    try {
        const gc = (window as any).goatcounter;
        if (gc && gc.count) gc.count({ path: '3d/phone-lite', title: 'Phone: AayushOS Lite from the 3D room', event: true });
    } catch (e) {}
}
