import React from 'react';

/** Whether the window rendered inside is the active one (blue title bar). The desktop works
 *  this out: the topmost window that isn't minimized, unless the desktop itself was clicked.
 *  undefined = no desktop around it, the window decides for itself. */
export const WindowActiveContext = React.createContext<boolean | undefined>(undefined);
