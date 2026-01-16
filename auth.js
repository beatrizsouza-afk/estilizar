import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

// Mantém login salvo
setPersistence(auth, browserLocalPersistence);

// CADASTRO
export async function register(name, email, password, role) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCred.user.uid), {
    name,
    email,
    role
  });

  localStorage.setItem("role", role);

  return userCred.user;
}

// LOGIN
export async function login(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);

  const ref = doc(db, "users", userCred.user.uid);
  const snap = await getDoc(ref);

  const data = snap.data();

  localStorage.setItem("role", data.role);

  return data.role;
}

// LOGOUT
export function logout() {
  localStorage.clear();
  signOut(auth);
  window.location.reload(); // 🔥 mantém navbar e rotas corretas
}

// VERIFICADORES
export function isPaciente() {
  return localStorage.getItem("role") === "paciente";
}

export function isNutricionista() {
  return localStorage.getItem("role") === "nutricionista";
}
