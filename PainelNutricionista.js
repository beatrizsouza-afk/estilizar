import { Link } from "react-router-dom";
import { isNutricionista } from "../auth";

export default function PainelNutricionista() {
  if (!isNutricionista()) {
    return <p>Acesso restrito. Faça login como nutricionista.</p>;
  }

  return (
    <div>
      <h2>Painel do Nutricionista</h2>

      <h3>Pacientes</h3>
      <p>Gerencie planos, evolução e consultas</p>

      <h3>Ferramentas</h3>

      <ul>
        <li>
          <Link to="/agenda">📅 Agenda</Link>
        </li>
        <li>
          <Link to="/evolucao">📊 Acompanhamento Nutricional</Link>
        </li>
        <li>
          <Link to="/planos">🥗 Plano Alimentar</Link>
        </li>
      </ul>
    </div>
  );
}
