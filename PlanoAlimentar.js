import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import { isNutricionista } from "../auth";
import jsPDF from "jspdf";

export default function PlanoAlimentar() {
  const [planos, setPlanos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [editId, setEditId] = useState(null);

  const [dieta, setDieta] = useState({
    cafe: "",
    lancheManha: "",
    almoco: "",
    lancheTarde: "",
    jantar: "",
    observacoes: ""
  });

  const nutri = isNutricionista();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    carregarDados();
  }, [user]);

  async function carregarDados() {
    if (nutri) {
      const usersSnap = await getDocs(collection(db, "users"));
      setUsuarios(
        usersSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.role === "paciente")
      );

      const q = query(
        collection(db, "planos"),
        where("nutriId", "==", user.uid)
      );
      const planosSnap = await getDocs(q);
      setPlanos(planosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } else {
      const q = query(
        collection(db, "planos"),
        where("pacienteId", "==", user.uid)
      );
      const planosSnap = await getDocs(q);
      setPlanos(planosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  }

  async function salvar() {
    if (!pacienteId || !titulo) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const paciente = usuarios.find(u => u.id === pacienteId);

    const dados = {
      pacienteId,
      pacienteNome: paciente?.name || paciente?.email,
      nutriId: user.uid,
      titulo,
      planoAlimentar: dieta
    };

    if (editId) {
      await updateDoc(doc(db, "planos", editId), dados);
    } else {
      await addDoc(collection(db, "planos"), dados);
    }

    limpar();
    carregarDados();
  }

  function editar(p) {
    setEditId(p.id);
    setPacienteId(p.pacienteId);
    setTitulo(p.titulo);
    setDieta(p.planoAlimentar);
  }

  async function excluir(id) {
    if (!window.confirm("Excluir dieta?")) return;
    await deleteDoc(doc(db, "planos", id));
    carregarDados();
  }

  function limpar() {
    setEditId(null);
    setPacienteId("");
    setTitulo("");
    setDieta({
      cafe: "",
      lancheManha: "",
      almoco: "",
      lancheTarde: "",
      jantar: "",
      observacoes: ""
    });
  }

  function handleChange(campo, valor) {
    setDieta({ ...dieta, [campo]: valor });
  }

  // 📄 GERAR PDF
  function gerarPDF(plano) {
    const pdf = new jsPDF();
    let y = 20;

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Plano Alimentar", 105, y, { align: "center" });

    y += 10;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Paciente: ${plano.pacienteNome || "-"}`, 10, y);
    y += 6;
    pdf.text(`Título: ${plano.titulo}`, 10, y);

    y += 6;
    pdf.line(10, y, 200, y);
    y += 8;

    const r = plano.planoAlimentar;

    function bloco(titulo, texto) {
      if (!texto) return;
      pdf.setFont("helvetica", "bold");
      pdf.text(titulo, 10, y);
      y += 6;

      pdf.setFont("helvetica", "normal");
      const linhas = pdf.splitTextToSize(texto, 180);
      pdf.text(linhas, 12, y);
      y += linhas.length * 6 + 4;
    }

    bloco("Café da manhã", r.cafe);
    bloco("Lanche da manhã", r.lancheManha);
    bloco("Almoço", r.almoco);
    bloco("Lanche da tarde", r.lancheTarde);
    bloco("Jantar", r.jantar);
    bloco("Observações", r.observacoes);

    pdf.setFontSize(10);
    pdf.text(
      "Plano alimentar elaborado por profissional de nutrição",
      105,
      290,
      { align: "center" }
    );

    pdf.save(`plano-alimentar-${plano.pacienteNome || "paciente"}.pdf`);
  }

  return (
    <div>
      <h2>Dieta do Paciente</h2>

      {nutri && (
        <>
          <select
            value={pacienteId}
            onChange={e => setPacienteId(e.target.value)}
          >
            <option value="">Selecione o paciente</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>
                {u.name || u.email}
              </option>
            ))}
          </select>

          <br /><br />

          <input
            placeholder="Título da dieta"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />

          <br /><br />

          <textarea placeholder="Café da manhã" value={dieta.cafe}
            onChange={e => handleChange("cafe", e.target.value)} />

          <textarea placeholder="Lanche da manhã" value={dieta.lancheManha}
            onChange={e => handleChange("lancheManha", e.target.value)} />

          <textarea placeholder="Almoço" value={dieta.almoco}
            onChange={e => handleChange("almoco", e.target.value)} />

          <textarea placeholder="Lanche da tarde" value={dieta.lancheTarde}
            onChange={e => handleChange("lancheTarde", e.target.value)} />

          <textarea placeholder="Jantar" value={dieta.jantar}
            onChange={e => handleChange("jantar", e.target.value)} />

          <textarea placeholder="Observações gerais" value={dieta.observacoes}
            onChange={e => handleChange("observacoes", e.target.value)} />

          <br />
          <button onClick={salvar}>
            {editId ? "Salvar alterações" : "Criar dieta"}
          </button>

          <hr />
        </>
      )}

      {planos.map(p => (
        <div key={p.id}>
          <h3>{p.titulo}</h3>

          <p><b>Café:</b> {p.planoAlimentar.cafe}</p>
          <p><b>Lanche manhã:</b> {p.planoAlimentar.lancheManha}</p>
          <p><b>Almoço:</b> {p.planoAlimentar.almoco}</p>
          <p><b>Lanche tarde:</b> {p.planoAlimentar.lancheTarde}</p>
          <p><b>Jantar:</b> {p.planoAlimentar.jantar}</p>

          {p.planoAlimentar.observacoes && (
            <p><b>Observações:</b> {p.planoAlimentar.observacoes}</p>
          )}

          <button onClick={() => gerarPDF(p)}>Gerar PDF</button>

          {nutri && (
            <>
              <button onClick={() => editar(p)}>Editar</button>
              <button onClick={() => excluir(p.id)}>Excluir</button>
            </>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}
