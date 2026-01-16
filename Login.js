import { useState } from "react";
import { login } from "../auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // EMAIL DO NUTRICIONISTA
  const NUTRI_EMAIL = "beanutri@gmail.com";

  async function handleLogin(role) {
    setLoading(true);

    try {
      const userRole = await login(email, password);

      if (userRole !== role) {
        alert("Essa conta não pertence a esse tipo de acesso.");
        return;
      }

      if (role === "nutricionista" && email !== NUTRI_EMAIL) {
        alert("Somente o nutricionista autorizado pode acessar.");
        return;
      }

      if (role === "paciente") {
        navigate("/paciente");
      } else {
        navigate("/nutricionista");
      }

      //  FORÇA O REACT A ATUALIZAR O ESTADO
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br/>

      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br/><br/>

       <p style={{ marginTop: 10 }}>
        <Link to="/recuperar-senha">Esqueci minha senha</Link>
      </p>
      
      <p>Entrar como:</p>

      <button disabled={loading} onClick={() => handleLogin("paciente")}>
        {loading ? "Aguarde..." : "Paciente"}
      </button>

      <br/><br/>

      <button disabled={loading} onClick={() => handleLogin("nutricionista")}>
        {loading ? "Aguarde..." : "Nutricionista"}
      </button>

      <br/><br/>

     <a>Não tem uma conta?</a> <Link to="/cadastro">Cadastre-se</Link>
    </div>
  );
}
