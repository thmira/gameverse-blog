import React, { createContext, useState, useEffect, useContext } from 'react';

// Cria o Contexto de Autenticação
const AuthContext = createContext(null);

// Cria o Provedor de Autenticação (AuthProvider)
// Este componente vai envolver a aplicação e gerenciar o estado de autenticação
export const AuthProvider = ({ children }) => {
  // Estado para armazenar as informações do usuário (null se não logado)
  const [user, setUser] = useState(null);
  // Estado para armazenar o token JWT
  const [token, setToken] = useState(null);
  // Estado para indicar se o carregamento inicial do estado de autenticação terminou
  const [loading, setLoading] = useState(true);

  // Efeito para carregar o estado de autenticação do localStorage ao iniciar a aplicação
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Armazenaremos um JSON com username e role

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (e) {
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
        // Se houver erro, limpa o armazenamento para evitar loops
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // Carregamento inicial concluído
  }, []);

  // Função para realizar o login
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData); // userData deve conter { username, role }
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData)); // Armazena como string JSON
  };

  // Função para realizar o logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Verifica se o usuário logado é um administrador
  const isAdmin = user && user.role === 'admin';

  // O valor que será disponibilizado para os componentes que consumirem o contexto
  const authContextValue = {
    user,
    token,
    loading,
    isAdmin,
    login,
    logout
  };

  // Renderiza os componentes filhos, passando o valor do contexto
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o consumo do contexto em outros componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};