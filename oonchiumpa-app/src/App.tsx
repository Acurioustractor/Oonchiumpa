import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { AppRoutes } from './routes/Routes';
import { AuthProvider } from './contexts/AuthContext';
import { EditModeProvider } from './contexts/EditModeContext';
import { EmpathyMediaWidget } from './components/EmpathyMediaWidget';
import { hydratePhotosFromRemote } from './services/siteConfig';
import { Agentation } from 'agentation';

function App() {
  useEffect(() => {
    void hydratePhotosFromRemote();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <EditModeProvider>
          <AppRoutes />
          <EmpathyMediaWidget />
        </EditModeProvider>
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
