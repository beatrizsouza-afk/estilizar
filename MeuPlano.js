import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function MeuPlano() {
  const [planos, setPlanos] = useState([]);

  async function carregar() {
    const q = query(
      collection(db, "planos"),
      where("pacienteId", "==", auth.currentUser.uid)
    );

    const snap = await getDocs(q);
    setPlanos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h2>📋 Meu Plano Alimentar</h2>

      {planos.length === 0 && <p>Nenhum plano disponível.</p>}

      {planos.map(p => (
        <div key={p.id}>
          <h3>{p.titulo}</h3>

          <h4>Plano alimentar</h4>
          <pre>{p.planoAlimentar}</pre>

          <h4>Acompanhamento</h4>
          <pre>{p.acompanhamento}</pre>

          <hr/>
        </div>
      ))}
    </div>
  );
}
