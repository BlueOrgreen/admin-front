import React from 'react';
import { createRoot } from 'react-dom/client';
import { gotoVSCode, gotoVSCodeInsiders, Inspector } from 'react-dev-inspector';

import App from './app';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Inspector
            keys={['Ctrl', 'q']}
            onInspectElement={({ codeInfo }) => {
                gotoVSCode(codeInfo);
            }}
        />
        <App />
    </React.StrictMode>,
);
