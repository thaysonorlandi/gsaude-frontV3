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
  const navigate = useNavigate();
  const { login } = useUser();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    
    // Simulação de autenticação - aqui você faria a chamada real para sua API
    let userType = 'admin'; // padrão
    
    // Lógica simplificada para determinar o tipo de usuário baseado no nome de usuário
    if (form.usuario.toLowerCase().includes('admin')) {
      userType = 'admin';
    } else if (form.usuario.toLowerCase().includes('recepcao')) {
      userType = 'recepcao';
    } else if (form.usuario.toLowerCase().includes('paciente')) {
      userType = 'paciente';
    }
    
    // Salva os dados do usuário no contexto
    login({
      nome: form.usuario,
      tipo: userType,
      // outros dados do usuário...
    });
    
    // Redireciona baseado no tipo de usuário
    if (userType === 'paciente') {
      navigate('/home/agendados');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <img src={Logo} alt="Logo GSaude" style={{ width: 200, marginBottom: 24 }} />
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
            />
          </div>
          <Button color="primary" type="submit">Entrar</Button>
          <Button type="button" className="btn-cadastro" onClick={() => alert('Cadastro ainda não implementado')}>
            Cadastre-se
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;