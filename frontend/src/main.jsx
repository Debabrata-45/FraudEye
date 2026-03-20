import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/feedback';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);