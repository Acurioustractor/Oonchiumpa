import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/Routes';
import { AuthProvider } from './contexts/AuthContext';
import { Agentation } from 'agentation';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
