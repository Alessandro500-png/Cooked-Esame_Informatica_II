<template>
  <div class="recipe-auth-container" :class="{ 'form-active': isInputFocused }">
    <!-- Linea di accento cromatica superiore -->
    <div class="palette-line">
      <span class="line-segment orange"></span>
      <span class="line-segment green"></span>
      <span class="line-segment yellow"></span>
    </div>

    <!-- Sfondo vivo ed energetico che si espande quando lo chef interagisce -->
    <div class="spice-ambient orange-glow"></div>
    <div class="spice-ambient yellow-glow"></div>
    <div class="spice-ambient green-glow"></div>

    <div class="auth-inner">
      <!-- Header premium -->
      <header class="auth-header">
        <p class="brand-category">BRIGATA DI CUCINA</p>
        <h2 class="brand-logo">Cooked<span class="dynamic-dot">.</span></h2>
      </header>
      
      <!-- Form minimale e immersivo -->
      <form @submit.prevent="gestisciLogin" class="minimal-form">
        
        <div class="form-field">
          <label for="email">Email dello Chef</label>
          <input 
            type="email" 
            v-model="emailInserita" 
            required 
            placeholder="Inserisci la tua email..." 
            id="email"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
          />
        </div>
        
        <div class="form-field">
          <div class="label-row">
            <label for="password">Password Chiave</label>
            <button 
              type="button" 
              class="minimal-toggle" 
              @click="mostraPassword = !mostraPassword"
              tabindex="-1"
            >
              {{ mostraPassword ? 'Nascondi' : 'Mostra' }}
            </button>
          </div>
          <input 
            :type="mostraPassword ? 'text' : 'password'" 
            v-model="passwordInserita" 
            required 
            placeholder="Inserisci la tua password..." 
            id="password"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
          />
        </div>

        <div class="form-utility">
          <a href="#" @click.prevent="recuperaPassword" class="link-subtle">Hai smarrito le credenziali?</a>
        </div>
        
        <!-- Pulsante Premium ad Alto Contrasto e Impatto -->
        <button type="submit" class="action-button-premium">
          <span class="btn-text">Accedi al Ricettario</span>
          <span class="arrow">→</span>
        </button>
      </form>

      <p v-if="messaggioErrore" class="error-banner-minimal">{{ messaggioErrore }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js"; 

const emit = defineEmits(['login-success']);

const emailInserita = ref('');
const passwordInserita = ref('');
const messaggioErrore = ref('');
const mostraPassword = ref(false);

// Stato per attivare le animazioni immersive dello sfondo
const isInputFocused = ref(false);

const gestisciLogin = () => {
  messaggioErrore.value = ""; 

  signInWithEmailAndPassword(auth, emailInserita.value, passwordInserita.value)
    .then((userCredential) => {
      emit('login-success', userCredential.user);
    })
    .catch((error) => {
      console.error(error);
      messaggioErrore.value = "Credenziali non trovate nel database della cucina.";
    });
};

const recuperaPassword = () => { console.log("Recupero..."); };
</script>

<style scoped>
/* Struttura di sfondo con pattern a griglia professionale */
.recipe-auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #F9F7F2;
  background-image: 
    linear-gradient(rgba(45, 52, 54, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45, 52, 54, 0.02) 1px, transparent 1px);
  background-size: 20px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: background-color 0.5s ease;
}

/* Quando l'utente clicca sui campi, lo sfondo si scalda leggermente */
.recipe-auth-container.form-active {
  background-color: #f6f1e7;
}

/* Linea minimalista superiore con la palette */
.palette-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  display: flex;
  z-index: 5;
}

.line-segment { flex: 1; }
.line-segment.orange { background-color: #E67E22; }
.line-segment.green { background-color: #27AE60; }
.line-segment.yellow { background-color: #F1C40F; }

/* Bagliori ambientali caldi (effetto fuoco/energia della cucina) */
.spice-ambient {
  position: absolute;
  border-radius: 50%;
  filter: blur(130px);
  opacity: 0.15;
  z-index: 1;
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.orange-glow {
  width: 450px;
  height: 450px;
  background-color: #E67E22;
  top: -120px;
  right: -80px;
}

.yellow-glow {
  width: 400px;
  height: 400px;
  background-color: #F1C40F;
  bottom: -80px;
  left: -80px;
}

.green-glow {
  width: 300px;
  height: 300px;
  background-color: #27AE60;
  top: 40%;
  left: -150px;
  opacity: 0.05;
}

/* GIOCO 2: Reattività immersiva. Quando un input è attivo, i bagliori si dilatano e si avvicinano */
.recipe-auth-container.form-active .orange-glow {
  transform: scale(1.15) translate(-30px, 30px);
  opacity: 0.22;
}

.recipe-auth-container.form-active .yellow-glow {
  transform: scale(1.2) translate(40px, -40px);
  opacity: 0.22;
}

/* Card interna ultra-strutturata */
.auth-inner {
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  padding: 60px 45px;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(45, 52, 54, 0.04);
  z-index: 10;
  border: 1px solid rgba(45, 52, 54, 0.02);
  transition: transform 0.3s ease;
}

.auth-header {
  margin-bottom: 45px;
}

.brand-category {
  font-size: 11px;
  font-weight: 700;
  color: #636e72;
  letter-spacing: 2px;
  margin: 0 0 8px 0;
}

.brand-logo {
  font-size: 34px;
  font-weight: 800;
  color: #2D3436;
  margin: 0;
  letter-spacing: -1px;
}

/* GIOCO 1: Il punto dinamico che pulsa cromaticamente tra arancio e giallo */
.dynamic-dot {
  display: inline-block;
  color: #E67E22;
  animation: spicePulse 3s infinite ease-in-out;
}

@keyframes spicePulse {
  0%, 100% {
    color: #E67E22;
    transform: scale(1);
  }
  50% {
    color: #F1C40F;
    transform: scale(1.2);
  }
}

/* Campi del form */
.minimal-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-field label {
  font-size: 11px;
  font-weight: 700;
  color: #2D3436;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.minimal-toggle {
  background: none;
  border: none;
  font-size: 11px;
  font-weight: 600;
  color: #636e72;
  cursor: pointer;
  padding: 0;
}

.minimal-toggle:hover {
  color: #2D3436;
}

.form-field input {
  width: 100%;
  padding: 16px;
  background-color: #fcfbfa;
  border: 1px solid #e2ded6;
  border-radius: 12px;
  font-size: 14px;
  color: #2D3436;
  outline: none;
  box-sizing: border-box;
  transition: all 0.25s ease;
}

.form-field input::placeholder {
  color: #b2bec3;
  font-weight: 400;
}

/* Focus deciso e netto: bordo antracite e ombra sottile arancione */
.form-field input:focus {
  border-color: #2D3436;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
}

.form-utility {
  text-align: right;
  margin-top: -12px;
}

.link-subtle {
  font-size: 12px;
  color: #636e72;
  text-decoration: none;
}

.link-subtle:hover {
  color: #E67E22;
}

/* GIOCO 3: Pulsante di azione Premium e Aggressivo con riempimento magnetico */
.action-button-premium {
  width: 100%;
  padding: 18px 22px;
  background-color: #2D3436;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 10px 20px rgba(45, 52, 54, 0.1);
}

/* Pseudo-elemento per l'effetto riempimento arancione dinamico */
.action-button-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background-color: #E67E22;
  z-index: -1;
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.action-button-premium:hover::before {
  width: 100%;
}

.action-button-premium:hover {
  box-shadow: 0 12px 25px rgba(230, 126, 34, 0.25);
}

.action-button-premium:active {
  transform: scale(0.98);
}

.arrow {
  font-size: 18px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.action-button-premium:hover .arrow {
  transform: translateX(5px);
}

/* Errore */
.error-banner-minimal {
  color: #d63031;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  background-color: #fff5f5;
  border-radius: 8px;
}
</style>