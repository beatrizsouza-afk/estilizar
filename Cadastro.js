import { useState } from "react";
import { register } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("paciente");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await register(name, email, password, role);

      setSuccess(true);                //  ativa mensagem de sucesso
      setTimeout(() => navigate("/login"), 2000); //  redireciona após 2s
    } catch (err) {
      console.error(err);
      alert(err.code + " — " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Criar Conta</h2>

      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          🎉 Cadastro realizado com sucesso! Redirecionando…
        </p>
      )}

      <input
        placeholder="Nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={success}
      /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={success}
      /><br />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={success}
      /><br /><br />

      <label>
        Tipo de conta:{" "}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={success}
        >
          <option value="paciente">Paciente</option>
          <option value="nutricionista">Nutricionista</option>
        </select>

      </label>

      <br /><br />

      <button disabled={loading || success} onClick={handleRegister}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
    </div>
  );
}
