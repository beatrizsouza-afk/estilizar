import {  isPaciente } from "../auth";
import PlanoAlimentar from "../components/PlanoAlimentar";
import Evolucao from "../components/Evolucao";

export default function Paciente() {
  const logado = isPaciente();

  return (
    <div>
      <h2>Área do Paciente</h2>

      <PlanoAlimentar />

      {logado ? (
        <Evolucao />
      ) : (
        <p>Faça login para ver seu acompanhamento nutricional.</p>
      )}
    </div>
  );
}
