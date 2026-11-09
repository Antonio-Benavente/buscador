import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'

import i18n, { cargarIdioma } from './i18n';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import PageError from './pages/PageError';
import { logError } from './utils/log';

cargarIdioma(i18n.language)
    .catch((err) => logError(err, 'i18n:cargarIdioma'))
    .finally(() => {
        createRoot(document.getElementById('root')).render(
            <StrictMode>
                <BrowserRouter>
                    <ErrorBoundary fallback={<PageError />}>
                        <App />
                    </ErrorBoundary>
                </BrowserRouter>
            </StrictMode>
        );
    });
