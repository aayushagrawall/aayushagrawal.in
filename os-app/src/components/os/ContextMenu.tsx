import React, { useEffect } from 'react';

export type MenuItem = { label: string; onSelect?: () => void; disabled?: boolean } | '-';

export interface ContextMenuProps {
    x: number;
    y: number;
    items: MenuItem[];
    onClose: () => void;
}

// Win98-style right-click menu
const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
    useEffect(() => {
        const close = () => onClose();
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        // next tick, so the click that opened the menu doesn't close it
        const t = setTimeout(() => {
            window.addEventListener('mousedown', close);
            window.addEventListener('keydown', onKey);
        }, 0);
        return () => {
            clearTimeout(t);
            window.removeEventListener('mousedown', close);
            window.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    const w = 190;
    const h = items.reduce((n, i) => n + (i === '-' ? 8 : 24), 6);
    const left = Math.min(x, window.innerWidth - w - 4);
    const top = Math.min(y, window.innerHeight - h - 36);

    return (
        <div style={{ ...styles.menu, left, top, width: w }} onMouseDown={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
            {items.map((item, i) =>
                item === '-' ? (
                    <div key={i} style={styles.line} />
                ) : (
                    <p
                        key={item.label}
                        className={item.disabled ? '' : 'ctx-item'}
                        style={{ ...styles.item, ...(item.disabled ? styles.disabled : {}) }}
                        onMouseDown={() => {
                            if (item.disabled) return;
                            onClose();
                            item.onSelect && item.onSelect();
                        }}
                    >
                        {item.label}
                    </p>
                )
            )}
        </div>
    );
};

const styles: StyleSheetCSS = {
    menu: {
        position: 'fixed',
        zIndex: 110000,
        flexDirection: 'column',
        background: '#c0c0c0',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        padding: 3,
    },
    item: { margin: 0, padding: '4px 20px', fontFamily: 'MSSerif', fontSize: 14, cursor: 'default', height: 16 },
    disabled: { color: '#808080', textShadow: '1px 1px #fff' },
    line: { height: 1, margin: '3px 2px', borderTop: '1px solid #808080', borderBottom: '1px solid #fff' },
};

export default ContextMenu;
