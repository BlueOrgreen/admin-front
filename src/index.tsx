import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { Suspense } from 'react';
import { gotoVSCode, Inspector } from 'react-dev-inspector';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './app';

import { queryClient } from '@/http/tanstack/react-query';

// 引入 icons svg 雪碧图
import './icons';
// i18n
import './locales/i18n';
// tailwind css
import './theme/index.css';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Inspector
            keys={['Ctrl', 'q']}
            onInspectElement={({ codeInfo }) => {
                gotoVSCode(codeInfo);
            }}
        />
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <Suspense>
                    <App />
                </Suspense>
            </QueryClientProvider>
        </HelmetProvider>
    </React.StrictMode>,
);
