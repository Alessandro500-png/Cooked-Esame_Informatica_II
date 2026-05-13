import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Per il Database delle ricette

const firebaseConfig = {
  apiKey: "AIzaSyALIrTFwhkUrnEvuC7BUSTznwEfywugIZU",
  authDomain: "cooked-5ccd9.firebaseapp.com",
  projectId: "cooked-5ccd9",
  storageBucket: "cooked-5ccd9.firebasestorage.app",
  messagingSenderId: "38214822",
  appId: "1:38214822:web:5cbbd96ac92c7b237ba867",
  measurementId: "G-VX2ZN0J16L"
};

// Inizializziamo Firebase
const app = initializeApp(firebaseConfig);

// Esportiamo i servizi che useremo nelle schermate (views)
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; // Aggiunta consigliata