import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  // Removemos 'isAdmin' pois não é diretamente utilizado neste componente
  const { user, loading } = useAuth(); // <-- LINHA CORRIGIDA AQUI

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Verificando autenticação...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert('Você não tem permissão para acessar esta página.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;