import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  // 
  const recuperarSenha = async () => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: "http://localhost:3000/login" 
    });

    setMsg("Email enviado! Verifique sua caixa de entrada.");
  } catch (error) {
    setMsg("Erro ao enviar email. Verifique se o email está correto.");
  }
};

  

  return (
    <div>
      <h2>Recuperar Senha</h2>

      <input
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={recuperarSenha}>Enviar</button>

      {msg && <p>{msg}</p>}
    </div>
  );
};
