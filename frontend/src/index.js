import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <--- ESTA LINHA É A CHAVE! Certifique-se que está aqui e NÃO comentada
import App from './App';
// import reportWebVitals from './reportWebVitals'; // Esta linha pode estar comentada ou removida se você limpou

import { AuthProvider } from './contexts/AuthContext'; // Já adicionamos este

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Se você apagou o reportWebVitals, pode remover
// reportWebVitals();