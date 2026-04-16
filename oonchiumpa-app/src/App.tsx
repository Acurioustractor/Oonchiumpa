import { BrowserRouter, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppRoutes } from './routes/Routes';
import { AuthProvider } from './contexts/AuthContext';
import { EditModeProvider } from './contexts/EditModeContext';
import { EmpathyMediaWidget } from './components/EmpathyMediaWidget';
import { hydratePhotosFromRemote } from './services/siteConfig';
import { Agentation } from 'agentation';

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    void hydratePhotosFromRemote();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <EditModeProvider>
          <ScrollToTopOnRouteChange />
          <AppRoutes />
          <EmpathyMediaWidget />
        </EditModeProvider>
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
