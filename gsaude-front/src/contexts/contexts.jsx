import { createContext, useState, useContext } from 'react';

// Cria o contexto do usuário, que será usado para compartilhar dados entre componentes
const UserContext = createContext({
  usuario: null,
  login: () => {},
  logout: () => {},
});

// Componente provedor do contexto de usuário
export function UserProvider({ children }) {
  // Estado para armazenar os dados do usuário logado
  const [usuario, setUsuario] = useState(null);

  // Função para realizar login e salvar os dados do usuário
  function login(userData) {
    setUsuario(userData);
  }

  // Função para realizar logout e limpar os dados do usuário
  function logout() {
    setUsuario(null);
  }

  // O valor do contexto inclui o usuário atual e as funções de login/logout
  return (
    <UserContext.Provider value={{ usuario, login, logout }}>
      {children} {/* Renderiza os componentes filhos que terão acesso ao contexto */}
    </UserContext.Provider>
  );
}

// Hook personalizado para acessar facilmente o contexto do usuário em outros componentes
export function useUser() {
  return useContext(UserContext);
}