import React from 'react';
import getIconByName, { IconName } from '../../assets/icons';

export interface IconProps {
    style?: React.CSSProperties;
    icon: IconName;
    size?: number;
}

const Icon: React.FC<IconProps> = ({ icon, style, size }) => {
    const iconStyle = Object.assign(
        {},
        styles.icon,
        style,
        size && { width: size, height: size }
    );
    // explicit width/height lets the browser reserve space before the image loads
    const w = typeof iconStyle.width === 'number' ? iconStyle.width : undefined;
    const h = typeof iconStyle.height === 'number' ? iconStyle.height : undefined;
    return (
        <img
            width={w}
            height={h}
            style={iconStyle}
            alt={''}
            src={getIconByName(icon) as unknown as string}
        />
    );
};

const styles: StyleSheetCSS = {
    icon: {
        imageRendering: 'pixelated',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        pointerEvents: 'none',
    },
};

export default Icon;
