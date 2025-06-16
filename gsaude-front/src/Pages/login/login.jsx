import { useState } from 'react';
import Logo from '../../assets/logoGSaude.png';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import Button from '@mui/material/Button';
import './login.css';

function Login() {
  const [form, setForm] = useState({ usuario: '', senha: '' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('Login realizado!');
  }

  return (
    <div className="background">
      <div className="login-container">
        <img src={Logo} alt="Logo GSaude" style={{ width: 200, marginBottom: 24 }} />
        <form onSubmit={handleSubmit}>
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