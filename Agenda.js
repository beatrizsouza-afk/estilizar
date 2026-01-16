import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  where
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { isNutricionista } from "../auth";

export default function Agenda() {

  // Usuário logado
  const [usuario, setUsuario] = useState(null);

  // Lista de agendamentos
  const [agendamentos, setAgendamentos] = useState([]);

  // Campos do formulário
  const [paciente, setPaciente] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  // Edição
  const [editId, setEditId] = useState(null);

  // Detecta login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsub();
  }, []);

  // 🔥 CARREGAR AGENDA (FILTRADA)
  async function carregarAgendamentos() {
    if (!usuario) return;

    let q;

    // Nutricionista vê tudo
    if (isNutricionista()) {
      q = query(collection(db, "agendas"), orderBy("data"));
    } 
    // Usuário comum vê só o dele
    else {
      q = query(
        collection(db, "agendas"),
        where("userId", "==", usuario.uid),
        orderBy("data")
      );
    }

    const snap = await getDocs(q);

    const list = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setAgendamentos(list);
  }

  function limparForm() {
    setPaciente("");
    setData("");
    setHora("");
    setTelefone("");
    setEmail("");
    setEditId(null);
  }

  // 🔐 SALVAR NOVO AGENDAMENTO
  async function salvarAgendamento() {
    if (!usuario) {
      alert("Faça login para agendar");
      return;
    }

    if (!paciente || !data || !hora || !telefone || !email) {
      alert("Preencha todos os campos.");
      return;
    }

    await addDoc(collection(db, "agendas"), {
      paciente,
      data,
      hora,
      telefone,
      email,
      status: "pendente",
      userId: usuario.uid // 🔥 VÍNCULO COM USUÁRIO
    });

    alert("Consulta agendada!");
    limparForm();
    carregarAgendamentos();
  }

  // EXCLUIR (somente dono ou nutri)
  async function excluir(id, userId) {
    if (!isNutricionista() && userId !== usuario.uid) return;

    if (!window.confirm("Excluir este agendamento?")) return;

    await deleteDoc(doc(db, "agendas", id));
    carregarAgendamentos();
  }

  function editar(ag) {
    if (!isNutricionista() && ag.userId !== usuario.uid) return;

    setEditId(ag.id);
    setPaciente(ag.paciente);
    setData(ag.data);
    setHora(ag.hora);
    setTelefone(ag.telefone);
    setEmail(ag.email);
  }

  async function salvarEdicao() {
    await updateDoc(doc(db, "agendas", editId), {
      paciente,
      data,
      hora,
      telefone,
      email
    });

    alert("Agendamento atualizado!");
    limparForm();
    carregarAgendamentos();
  }

  // 🥼 CONFIRMAR (SÓ NUTRI)
  async function confirmar(id) {
    if (!isNutricionista()) return;

    await updateDoc(doc(db, "agendas", id), {
      status: "confirmada"
    });

    alert("Consulta confirmada!");
    carregarAgendamentos();
  }

  useEffect(() => {
    carregarAgendamentos();
  }, [usuario]);

  if (!usuario) {
    return <p>Faça login para acessar a agenda.</p>;
  }

  return (
    <div>
      <h2>Agenda Online</h2>

      {!isNutricionista() && (
        <>
          <h3>{editId ? "Editar agendamento" : "Novo agendamento"}</h3>

          <input placeholder="Nome" value={paciente}
            onChange={e => setPaciente(e.target.value)} /><br/>

          <input type="date" value={data}
            onChange={e => setData(e.target.value)} /><br/>

          <input type="time" value={hora}
            onChange={e => setHora(e.target.value)} /><br/>

          <input placeholder="Telefone" value={telefone}
            onChange={e => setTelefone(e.target.value)} /><br/>

          <input placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} /><br/><br/>

          {editId ? (
            <>
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={limparForm}>Cancelar</button>
            </>
          ) : (
            <button onClick={salvarAgendamento}>Agendar</button>
          )}

          <hr/>
        </>
      )}

      <h3>{isNutricionista() ? "Todas as consultas" : "Minhas consultas"}</h3>

      {agendamentos.length === 0 && <p>Nenhuma consulta.</p>}

      <ul>
        {agendamentos.map(a => (
          <li key={a.id}>
            <b>{a.data}</b> — {a.hora} — {a.paciente}<br/>
            📞 {a.telefone} | ✉️ {a.email}<br/>
            Status: {a.status}<br/>

            {isNutricionista() && a.status !== "confirmada" && (
              <button onClick={() => confirmar(a.id)}>
                Confirmar
              </button>
            )}

            {(isNutricionista() || a.userId === usuario.uid) && (
              <>
                <button onClick={() => editar(a)}>Editar</button>
                <button onClick={() => excluir(a.id, a.userId)}>Excluir</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
