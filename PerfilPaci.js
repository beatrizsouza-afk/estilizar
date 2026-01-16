import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { isPaciente } from "../../auth";

export default function PerfilPaci() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!isPaciente() || !auth.currentUser) {
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUser(snap.data());
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  if (!isPaciente()) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Perfil</h2>
        <p style={{ background: "#fff3cd", padding: 15 }}>
          Você precisa estar logado como paciente para acessar seu perfil.
        </p>
      </div>
    );
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Carregando perfil...</p>;
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${user?.name}&background=6c757d&color=fff`;

  return (
    <div style={{ padding: 20 }}>
      <h2>Perfil do Paciente</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginTop: 20,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 8,
          maxWidth: 500,
          background: "#f9f9f9"
        }}
      >
        <img
          src={avatarUrl}
          alt="Foto do paciente"
          style={{ width: 90, height: 90, borderRadius: "50%" }}
        />

        <div>
          <p><strong>Nome:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Tipo:</strong> Paciente</p>
        </div>
      </div>
    </div>
  );
}
