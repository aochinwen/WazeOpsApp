import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logPageView } from './services/firebaseAnalytics';

function AnalyticsTracker({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);
  return <>{children}</>;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <AnalyticsTracker>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/detail/:incidentId" element={<App />} />
          </Routes>
        </AnalyticsTracker>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);