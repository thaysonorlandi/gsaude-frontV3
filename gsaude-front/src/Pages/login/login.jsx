import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/contexts';
import Logo from '../../assets/logoGSaude.png';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import './login.css';

function Login() {
  const [form, setForm] = useState({ usuario: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        console.log('Tentando autenticação na API...');
        
        // Determina as credenciais baseadas no input do usuário
        let email, password;
        
        if (form.usuario.toLowerCase() === 'admin') {
          email = 'admin@gsaude.com';
          password = form.senha || '123456'; // usa a senha digitada ou padrão
        } else if (form.usuario.toLowerCase() === 'recepcao') {
          email = 'secretaria@gsaude.com';
          password = form.senha || 'secret123';
        } else if (form.usuario.toLowerCase() === 'paciente') {
          email = 'paciente@gsaude.com';
          password = form.senha || 'paciente123';
        } else {
          // Se não é um dos padrões, assume que é um email real
          email = form.usuario;
          password = form.senha;
        }

        console.log('Credenciais mapeadas:', { email, password: '***' });

        const response = await fetch('http://localhost:8000/api/v1/auth/login', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email: email, password: password })
        });
        
        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', response.headers);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Dados recebidos da API:', data);
          userData = {
            nome: data.user.nome,
            tipo: data.user.tipo,
            token: data.token,
            id: data.user.id
          };
          userType = data.user.tipo;
          console.log('Login na API bem-sucedido:', { ...userData, token: '***' });
        } else {
          const errorData = await response.json();
          console.error('Erro na API - Status:', response.status, 'Data:', errorData);
          throw new Error('Credenciais inválidas');
        }
      } catch (apiError) {
        console.error('Erro completo ao tentar autenticar na API:', apiError);
        setError('Erro ao fazer login. Verifique suas credenciais.');
        setLoading(false);
        return;
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
              type={showPassword ? "text" : "password"}
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              size="small"
              style={{ 
                position: 'absolute', 
                right: '8px', 
                padding: '4px',
                backgroundColor: 'transparent',
                color: 'black'
              }}
            >
              {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </div>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;