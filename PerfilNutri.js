import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { isNutricionista } from "../../auth";

export default function PerfilNutri() {
  const [nutri, setNutri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNutri() {
      if (!isNutricionista() || !auth.currentUser) {
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setNutri(snap.data());
      }

      setLoading(false);
    }

    loadNutri();
  }, []);

  if (!isNutricionista()) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Perfil</h2>
        <p style={{ background: "#fff3cd", padding: 15 }}>
          Você precisa estar logado como nutricionista.
        </p>
      </div>
    );
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Carregando perfil profissional...</p>;
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${nutri?.name}&background=0d6efd&color=fff`;

  return (
    <div style={{ padding: 20 }}>
      <h2>Perfil Profissional</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginTop: 20,
          padding: 20,
          border: "1px solid #cce5ff",
          borderRadius: 8,
          maxWidth: 550,
          background: "#f0f8ff"
        }}
      >
        <img
          src={avatarUrl}
          alt="Foto do nutricionista"
          style={{ width: 100, height: 100, borderRadius: "50%" }}
        />

        <div>
          <p><strong>Nome:</strong> {nutri?.name}</p>
          <p><strong>Email:</strong> {nutri?.email}</p>
          <p><strong>Perfil:</strong> Nutricionista</p>
          <p><strong>Status:</strong> Ativo</p>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Área profissional</h3>
        <ul>
          <li>📋 Gerenciar pacientes</li>
          <li>📅 Agenda</li>
          <li>🥗 Planos alimentares</li>
          <li>📊 Evolução nutricional</li>
        </ul>
      </div>
    </div>
  );
}
