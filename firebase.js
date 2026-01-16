import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyAHXDec2wOf6HvLWfHANakR_JIcW4IjLD0",
  authDomain: "app-nutri-f5bb1.firebaseapp.com",
  databaseURL: "https://app-nutri-f5bb1-default-rtdb.firebaseio.com",
  projectId: "app-nutri-f5bb1",
  storageBucket: "app-nutri-f5bb1.firebasestorage.app",
  messagingSenderId: "679685850470",
  appId: "1:679685850470:web:655e420b77846b218674a7",
  measurementId: "G-3FXYN9LDTR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
