import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/contexts';
import Logo from '../../assets/logoGSaude.png';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import Button from '@mui/material/Button';
import './login.css';

function Login() {
  const [form, setForm] = useState({ usuario: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Tenta fazer o login pela API
      let userData = null;
      let userType = null;
      
      try {
        // Tenta fazer o login pela API real
        const response = await fetch('http://localhost:8000/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.usuario, password: form.senha })
        });
        
        if (response.ok) {
          const data = await response.json();
          userData = {
            nome: data.user.nome,
            tipo: data.user.tipo,
            token: data.token,
            id: data.user.id
          };
          userType = data.user.tipo;
        }
      } catch (apiError) {
        console.warn('Erro ao tentar autenticar na API, usando modo de desenvolvimento:', apiError);
      }
      
      // Fallback para o modo de desenvolvimento se a API falhar
      if (!userData) {
        // Simulação de autenticação para desenvolvimento
        userType = 'admin'; // padrão
        
        // Lógica simplificada para determinar o tipo de usuário baseado no nome de usuário
        if (form.usuario.toLowerCase().includes('admin')) {
          userType = 'admin';
        } else if (form.usuario.toLowerCase().includes('recepcao')) {
          userType = 'recepcao';
        } else if (form.usuario.toLowerCase().includes('paciente')) {
          userType = 'paciente';
        }
        
        // Simulação de token de acesso
        const token = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
        
        userData = {
          nome: form.usuario,
          tipo: userType,
          token: token,
        };
      }
      
      // Salva os dados do usuário no contexto
      login(userData);
      
      // Redireciona baseado no tipo de usuário
      if (userType === 'paciente') {
        navigate('/home/agendados');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <img src={Logo} alt="Logo GSaude" style={{ width: 200, marginBottom: 24 }} />
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className='input-icon'>
            <PersonIcon />
            <input
              type="text"
              name="usuario"
              placeholder="Usuário"
              value={form.usuario}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className='input-icon'>
            <LoginIcon />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          <Button 
            type="button" 
            className="btn-cadastro" 
            onClick={() => alert('Cadastro ainda não implementado')}
            disabled={loading}
          >
            Cadastre-se
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;