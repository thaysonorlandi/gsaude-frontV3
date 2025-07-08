# Sistema de Permissões - GSaude Frontend

## Configuração Implementada

O sistema de permissões foi implementado com base no tipo de usuário, controlando o acesso às diferentes páginas da aplicação.

### Tipos de Usuário e Permissões

#### 🔹 **Admin** (Administrador)

- **Acesso total a todas as funcionalidades**
- Páginas permitidas:
  - ✅ Agendamento
  - ✅ Agendados (Horários Reservados)
  - ✅ Financeiro
  - ✅ Cadastros
  - ✅ Configurações

#### 🔹 **Recepção**

- **Acesso limitado às operações principais**
- Páginas permitidas:
  - ✅ Agendamento
  - ✅ Agendados (Horários Reservados)
  - ✅ Financeiro
  - ❌ Cadastros
  - ❌ Configurações

#### 🔹 **Paciente**

- **Acesso apenas para consultar agendamentos**
- Páginas permitidas:
  - ❌ Agendamento
  - ✅ Agendados (Horários Reservados)
  - ❌ Financeiro
  - ❌ Cadastros
  - ❌ Configurações

### Como Testar

1. **Login como Admin:**

   - Username: qualquer texto contendo "admin"
   - Senha: qualquer
   - Resultado: Acesso total

2. **Login como Recepção:**

   - Username: qualquer texto contendo "recepcao"
   - Senha: qualquer
   - Resultado: Acesso limitado

3. **Login como Paciente:**
   - Username: qualquer texto contendo "paciente"
   - Senha: qualquer
   - Resultado: Redirecionamento direto para "Agendados"

### Arquivos Modificados

- `src/hooks/usePermissions.js` - Hook principal para gerenciar permissões
- `src/components/PermissionsManager.jsx` - Componentes auxiliares
- `src/components/ProtectedRoute.jsx` - Proteção de rotas
- `src/components/AccessDenied.jsx` - Página de acesso negado
- `src/Pages/Home/home.jsx` - Menu dinâmico baseado em permissões
- `src/Pages/login/login.jsx` - Lógica de login com tipos de usuário
- `src/routes/index.jsx` - Rotas protegidas
- `src/contexts/contexts.jsx` - Contexto de usuário com persistência

### Funcionamento

1. **Login:** O sistema identifica o tipo de usuário baseado no username
2. **Persistência:** Os dados do usuário são salvos no localStorage
3. **Menu Dinâmico:** Apenas os itens permitidos são exibidos no menu lateral
4. **Proteção de Rotas:** Tentativas de acesso não autorizado mostram página de "Acesso Negado"
5. **Redirecionamento:** Pacientes são automaticamente redirecionados para a página de agendados

### Integração com API

Para integrar com uma API real, substitua a lógica de login em `src/Pages/login/login.jsx`:

```javascript
const handleLogin = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.usuario, password: form.senha }),
    });

    const userData = await response.json();

    login({
      nome: userData.nome,
      tipo: userData.tipo, // 'admin', 'recepcao', ou 'paciente'
      // outros dados...
    });

    // Redireciona baseado no tipo
    if (userData.tipo === "paciente") {
      navigate("/home/agendados");
    } else {
      navigate("/home");
    }
  } catch (error) {
    // Tratar erro de login
  }
};
```

### Recursos Implementados

- ✅ Controle de acesso por tipo de usuário
- ✅ Menu dinâmico baseado em permissões
- ✅ Proteção de rotas
- ✅ Persistência de sessão
- ✅ Redirecionamento automático
- ✅ Página de acesso negado
- ✅ Logout com limpeza de dados
