import PerfilPaci from "./PerfilPaci";
import PerfilNutri from "./PerfilNutri";
import { isPaciente, isNutricionista } from "../../auth";

export default function Perfil() {
  // NÃO LOGADO
  if (!isPaciente() && !isNutricionista()) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Perfil</h2>
        <p
          style={{
            marginTop: 10,
            padding: 15,
            background: "#fff3cd",
            border: "1px solid #ffeeba",
            borderRadius: 6,
            color: "#856404",
          }}
        >
          Você precisa estar logado para acessar seu perfil.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Perfil</h2>

      {/* PERFIL DO USUÁRIO LOGADO */}
      {isPaciente() && (
        <>
          <hr />
          <PerfilPaci />
        </>
      )}

      {isNutricionista() && (
        <>
          <hr />
          <PerfilNutri />
        </>
      )}
    </div>
  );
}
