import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <AppRoutes />
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
