<template>
  <div class="login-container">
    <h2>Accesso Professore (Cooked)</h2>
    
    <form @submit.prevent="gestisciLogin">
      <div>
        <label>Email:</label>
        <input type="email" v-model="emailInserita" required placeholder="Inserisci l'email" />
      </div>
      
      <div>
        <label>Password:</label>
        <input type="password" v-model="passwordInserita" required placeholder="Inserisci la password" />
      </div>
      
      <button type="submit">Accedi</button>
    </form>

    <p v-if="messaggioErrore" class="error-msg">{{ messaggioErrore }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js"; 

// Questo serve per "avvisare" il file App.vue quando il prof riesce a loggarsi
const emit = defineEmits(['login-success']);

const emailInserita = ref('');
const passwordInserita = ref('');
const messaggioErrore = ref('');

const gestisciLogin = () => {
  messaggioErrore.value = ""; 

  signInWithEmailAndPassword(auth, emailInserita.value, passwordInserita.value)
    .then((userCredential) => {
      console.log("Accesso eseguito con successo!");
      // Diciamo ad App.vue: "Ehi, il prof è dentro! Puoi cambiare pagina!"
      emit('login-success', userCredential.user);
    })
    .catch((error) => {
      console.error("Errore Firebase:", error.message);
      messaggioErrore.value = "Email o Password errate. Riprova.";
    });
};
</script>

<style scoped>
/* 'scoped' assicura che questo stile non vada a scombinare le altre pagine del sito */
.login-container {
  max-width: 350px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  font-family: sans-serif;
  background-color: white;
}

.login-container div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}

button:hover {
  background-color: #ff5252;
}

.error-msg {
  color: red;
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
}
</style>