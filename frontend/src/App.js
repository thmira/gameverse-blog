import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import NewsList from './components/NewsList';
import NewsDetails from './components/NewsDetails';
import CreateNews from './components/CreateNews';
import EditNews from './components/EditNews';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();

  if (authLoading) {
    return <p className="loading-message">Carregando aplicação...</p>;
  }

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1><Link to="/">Bem-vindo ao GameVerse!</Link></h1>
          <p>O seu blog de notícias de games.</p>
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Notícias</Link></li>
              {/* CORREÇÃO AQUI: Envolvendo o <li> em um Fragmento */}
              {isAdmin && (
                <>
                  <li><Link to="/create">Criar Notícia</Link></li>
                </>
              )}
              {user ? (
                <>
                  <li style={{ fontWeight: 'bold' }}>Olá, {user.username}!</li>
                  <li>
                    <button onClick={logout} className="btn-danger">
                      Sair
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Registrar</Link></li>
                </>
              )}
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/create" element={<CreateNews />} />
              <Route path="/edit/:id" element={<EditNews />} />
            </Route>

            <Route path="*" element={<h2 className="loading-message">404 - Página Não Encontrada</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;