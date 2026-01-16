import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";
import { isNutricionista } from "../auth";

export default function Evolucao() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [peso, setPeso] = useState("");
  const [cintura, setCintura] = useState("");
  const [obs, setObs] = useState("");
  const [lista, setLista] = useState([]);

  const nutri = isNutricionista();
  const user = auth.currentUser;

  // 🔹 carrega dados SOMENTE quando o usuário existir
  useEffect(() => {
    if (!user) return;
    carregarDados();
  }, [user]);

  async function carregarDados() {
    // 🥼 NUTRICIONISTA
    if (nutri) {
      // carrega pacientes
      const snapUsers = await getDocs(collection(db, "users"));
      setPacientes(
        snapUsers.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.role === "paciente")
      );

      // carrega TODAS as evoluções
      const snap = await getDocs(collection(db, "evolucoes"));
      setLista(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }

    // 👤 PACIENTE
    else {
      const q = query(
        collection(db, "evolucoes"),
        where("pacienteId", "==", user.uid)
      );

      const snap = await getDocs(q);
      setLista(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  }

  // 🥼 salvar evolução (somente nutri)
  async function salvar() {
    if (!pacienteId || !peso) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    await addDoc(collection(db, "evolucoes"), {
      pacienteId,
      nutriId: user.uid,
      peso,
      cintura,
      observacoes: obs,
      criadoEm: serverTimestamp()
    });

    setPeso("");
    setCintura("");
    setObs("");
    setPacienteId("");
    carregarDados();
  }

  // 🥼 excluir evolução
  async function excluir(id) {
    if (!window.confirm("Excluir evolução?")) return;
    await deleteDoc(doc(db, "evolucoes", id));
    carregarDados();
  }

  return (
    <div>
      <h3>Acompanhamento Nutricional</h3>

      {/* 🥼 FORMULÁRIO – SOMENTE NUTRICIONISTA */}
      {nutri && (
        <>
          <select
            value={pacienteId}
            onChange={e => setPacienteId(e.target.value)}
          >
            <option value="">Selecione o paciente</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>
                {p.name || p.email}
              </option>
            ))}
          </select>

          <br /><br />

          <input
            placeholder="Peso (kg)"
            value={peso}
            onChange={e => setPeso(e.target.value)}
          />

          <input
            placeholder="Cintura (cm)"
            value={cintura}
            onChange={e => setCintura(e.target.value)}
          />

          <br /><br />

          <textarea
            placeholder="Observações"
            value={obs}
            onChange={e => setObs(e.target.value)}
          />

          <br /><br />

          <button onClick={salvar}>Adicionar evolução</button>

          <hr />
        </>
      )}

      {/* 📊 LISTAGEM */}
      {lista.length === 0 && <p>Nenhuma evolução registrada.</p>}

      {lista.map(e => (
        <div key={e.id}>
          <p><b>Peso:</b> {e.peso} kg</p>
          {e.cintura && <p><b>Cintura:</b> {e.cintura} cm</p>}
          {e.observacoes && <p>{e.observacoes}</p>}

          {/* 🥼 excluir só para nutri */}
          {nutri && (
            <button onClick={() => excluir(e.id)}>Excluir</button>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}
