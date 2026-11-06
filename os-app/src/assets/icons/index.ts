import React from 'react';

import close from './close.png';
import computerBig from './computerBig.png';
import computerSmall from './computerSmall.png';
import credits from './credits.png';
import docIcon from './docIcon.png';
import docSmall from './docSmall.png';
import folderIcon from './folderIcon.png';
import githubIcon from './githubIcon.png';
import globeIcon from './globeIcon.png';
import henordleIcon from './henordleIcon.png';
import instagramIcon from './instagramIcon.png';
import linkedinIcon from './linkedinIcon.png';
import mailIcon from './mailIcon.png';
import maximize from './maximize.png';
import minimize from './minimize.png';
import myComputer from './myComputer.png';
import paintIcon from './paintIcon.png';
import paintSmall from './paintSmall.png';
import recycleIcon from './recycleIcon.png';
import recycleSmall from './recycleSmall.png';
import showcaseIcon from './showcaseIcon.png';
import terminalIcon from './terminalIcon.png';
import terminalSmall from './terminalSmall.png';
import tetrisIcon from './tetrisIcon.png';
import tetrisSmall from './tetrisSmall.png';
import volumeOff from './volumeOff.png';
import volumeOn from './volumeOn.png';
import windowExplorerIcon from './windowExplorerIcon.png';
import windowGameIcon from './windowGameIcon.png';
import windowResize from './windowResize.png';
import windowsStartIcon from './windowsStartIcon.png';

const icons = {
    close: close,
    computerBig: computerBig,
    computerSmall: computerSmall,
    credits: credits,
    docIcon: docIcon,
    docSmall: docSmall,
    folderIcon: folderIcon,
    githubIcon: githubIcon,
    globeIcon: globeIcon,
    henordleIcon: henordleIcon,
    instagramIcon: instagramIcon,
    linkedinIcon: linkedinIcon,
    mailIcon: mailIcon,
    maximize: maximize,
    minimize: minimize,
    myComputer: myComputer,
    paintIcon: paintIcon,
    paintSmall: paintSmall,
    recycleIcon: recycleIcon,
    recycleSmall: recycleSmall,
    showcaseIcon: showcaseIcon,
    terminalIcon: terminalIcon,
    terminalSmall: terminalSmall,
    tetrisIcon: tetrisIcon,
    tetrisSmall: tetrisSmall,
    volumeOff: volumeOff,
    volumeOn: volumeOn,
    windowExplorerIcon: windowExplorerIcon,
    windowGameIcon: windowGameIcon,
    windowResize: windowResize,
    windowsStartIcon: windowsStartIcon,
};

export type IconName = keyof typeof icons;

const getIconByName = (
    iconName: IconName
    // @ts-ignore
): React.FC<React.SVGAttributes<SVGElement>> => icons[iconName];

export default getIconByName;
