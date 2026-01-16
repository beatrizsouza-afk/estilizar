import { Link } from "react-router-dom";
import { isPaciente, isNutricionista, logout } from "../auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (isPaciente()) {
      setAuth(true);
      setRole("paciente");
    } else if (isNutricionista()) {
      setAuth(true);
      setRole("nutricionista");
    } else {
      setAuth(false);
      setRole(null);
    }
  }, []);

  async function handleLogout() {
    await logout();
    window.location.reload(); // ✅ reload SOMENTE ao sair
  }

  return (
    <nav style={{ padding: 10, background: "#e8f7f1" }}>
      <Link to="/">Início</Link> |{" "}
      <Link to="/agenda">Agenda</Link> |{" "}
      <Link to="/paciente">Área do Paciente</Link> |{" "}
      <Link to="/nutricionista">Painel</Link> |{" "}

      {role === "paciente" && (
        <>
          <Link to="/paciente/perfil">Perfil</Link> |{" "}
        </>
      )}

      {role === "nutricionista" && (
        <>
          <Link to="/nutricionista/perfil">Perfil</Link> |{" "}
        </>
      )}

      {!auth ? (
        <Link to="/login">Login</Link>
      ) : (
        <button onClick={handleLogout}>Sair</button>
      )}
    </nav>
  );
}
