<template>
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden login-page">
    
    <div class="palette-line position-absolute top-0 start-0 w-100 d-flex">
      <span class="line-segment bg-orange"></span>
      <span class="line-segment bg-green"></span>
      <span class="line-segment bg-yellow"></span>
    </div>

    <div class="spice-ambient orange-glow position-absolute rounded-circle"></div>
    <div class="spice-ambient yellow-glow position-absolute rounded-circle"></div>

    <div class="row w-100 justify-content-center position-relative z-3 px-2 px-sm-3">
      <!-- Col-12 per mobile-first responsiveness, ampiezza massima ristretta per migliore leggibilità su schermi grandi -->
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 auth-card bg-white rounded-4 py-4 py-sm-5 px-3 px-sm-4 px-md-5 shadow-sm border border-light-subtle">
        
        <header class="mb-5 text-start">
          <!-- Commento: Header con classi custom per design - text-muted per categorie -->
          <p class="brand-category fw-bold text-muted small text-uppercase tracking-wider m-0 mb-2">Il tuo ricettario</p>
          <!-- Commento: H1 per SEO e accessibilità - fw-bold Bootstrap per font weight -->
          <h1 class="brand-logo fw-extrabold text-antracite lh-1 m-0" id="login-title">
            Cooked<span class="dynamic-dot">.</span>
          </h1>
        </header>
        
        <!-- Commento: Form con aria-labelledby per accessibilità, role esplicito per screen readers -->
        <form @submit.prevent="gestisciLogin" class="d-flex flex-column gap-4" role="form" aria-labelledby="login-title">
          
          <!-- Commento: Form group email con aria-describedby collegato a helper text -->
          <div class="form-group">
            <label for="email" class="form-label fw-bold text-antracite small text-uppercase tracking-sm mb-2">Email dello Chef</label>
            <!-- Commento: aria-label per screen reader, aria-describedby per helper text -->
            <input 
              type="email" 
              v-model="emailInserita" 
              required 
              placeholder="Inserisci la tua email..." 
              id="email"
              class="form-control rounded-3 custom-input py-3 px-3"
              aria-label="Inserisci la tua email"
              aria-describedby="email-format"
            />
            <!-- Commento: Helper text invisibile ma leggibile da screen reader -->
            <small id="email-format" class="text-muted d-block mt-2">Formato: nome@esempio.com</small>
          </div>
          
          <!-- Commento: Form group password con toggle mostra/nascondi accessibile -->
          <div class="form-group">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <label for="password" class="form-label fw-bold text-antracite small text-uppercase tracking-sm m-0">Password</label>
              <!-- Commento: Pulsante con aria-pressed per indicare stato toggle, aria-controls per link al field -->
              <button 
                type="button" 
                class="btn btn-link btn-sm text-decoration-none text-muted fw-semibold p-0 minimal-toggle"
                @click="mostraPassword = !mostraPassword"
                :aria-pressed="mostraPassword"
                aria-controls="password"
              >
                <!-- Commento: Testo varia in base allo stato di mostraPassword -->
                {{ mostraPassword ? 'Nascondi' : 'Mostra' }}
              </button>
            </div>
            <!-- Commento: Input password con aria-describedby per requisiti di sicurezza -->
            <input 
              :type="mostraPassword ? 'text' : 'password'" 
              v-model="passwordInserita" 
              required 
              placeholder="Inserisci la tua password..." 
              id="password"
              class="form-control rounded-3 custom-input py-3 px-3"
              aria-label="Inserisci la tua password"
              aria-describedby="password-requirements"
            />
            <!-- Commento: Requisiti password invisibili ma leggibili da screen reader -->
            <small id="password-requirements" class="text-muted d-block mt-2">Minimo 6 caratteri</small>
          </div>
          
          <div class="text-end mb-3">
            <!-- Commento: Link con colore custom per design -->
            <a href="#" @click.prevent="recuperaPassword" class="small text-muted text-decoration-none link-subtle">
              Hai smarrito le credenziali?
            </a>
          </div>
          
          <!-- Commento: Pulsante submit con design premium animato -->
          <button 
            type="submit" 
            class="btn btn-antracite w-100 rounded-3 py-3 px-4 fw-bold d-flex justify-content-between align-items-center action-button-premium shadow-sm"
            aria-label="Accedi al ricettario con le tue credenziali"
          >
            <span>Accedi al Ricettario</span>
            <!-- Commento: Icona nascosta da screen reader -->
            <span class="arrow fs-5" aria-hidden="true">→</span>
          </button>
        </form>

        <!-- Commento: Alert errore con role alert per immediata notifica a screen reader -->
        <div v-if="messaggioErrore" class="alert alert-danger mt-4 text-center border-0 small py-3 rounded-3" role="alert" aria-live="assertive">
          {{ messaggioErrore }}
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js"; 

const emit = defineEmits(['login-success']);
const router = useRouter();

const emailInserita = ref('');
const passwordInserita = ref('');
const messaggioErrore = ref('');
const mostraPassword = ref(false);

const gestisciLogin = () => {
  messaggioErrore.value = ""; 

  signInWithEmailAndPassword(auth, emailInserita.value, passwordInserita.value)
    .then((userCredential) => {
      emit('login-success', userCredential.user);
      router.push({ name: 'Home' });
    })
    .catch((error) => {
      console.error(error);
      messaggioErrore.value = "Email o password errate";
    });
};

const recuperaPassword = () => { 
  alert("Contatta il capo brigata per resettare la chiave d'accesso!"); 
};
</script>

<style scoped>
/* Colori Palette e Struttura con Pattern a griglia */
.login-page {
  background-color: #F9F7F2; /* Panna */
  background-image: 
    linear-gradient(rgba(45, 52, 54, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45, 52, 54, 0.02) 1px, transparent 1px);
  background-size: 20px 20px;
}

.text-antracite { color: #2D3436; }
.btn-antracite { background-color: #2D3436; color: #ffffff; }
.btn-antracite:hover { background-color: #1e2224; color: #ffffff; }

.fw-extrabold { font-weight: 800; }
.tracking-wider { letter-spacing: 2px; }
.tracking-sm { letter-spacing: 0.5px; }
.z-3 { z-index: 3; }

/* Linea superiore */
.palette-line { height: 4px; z-index: 5; }
.line-segment { flex: 1; }
.bg-orange { background-color: #E67E22; }
.bg-green { background-color: #27AE60; }
.bg-yellow { background-color: #F1C40F; }

/* Luci e cerchi cromatici sullo sfondo */
.spice-ambient {
  filter: blur(130px);
  opacity: 0.15;
  z-index: 1;
}
.orange-glow { width: 450px; height: 450px; top: -120px; right: -80px; background-color: #E67E22; }
.yellow-glow { width: 400px; height: 400px; bottom: -80px; left: -80px; background-color: #F1C40F; }

/* Card interna allargata a 460px per dare respiro */
.auth-card {
  max-width: 460px;
  border-color: rgba(45, 52, 54, 0.05) !important;
}

.brand-category { font-size: 11px; color: #636e72 !important; }
.brand-logo { letter-spacing: -1px; }

/* Punto dinamico pulsante */
.dynamic-dot {
  display: inline-block;
  color: #E67E22;
  animation: spicePulse 3s infinite ease-in-out;
}
@keyframes spicePulse {
  0%, 100% { color: #E67E22; transform: scale(1); }
  50% { color: #F1C40F; transform: scale(1.2); }
}

/* Input Form customizzati sulla palette */
.custom-input {
  background-color: #fcfbfa;
  border: 1px solid #e2ded6;
  color: #2D3436;
  font-size: 15px;
}
.custom-input::placeholder { color: #b2bec3; }
.custom-input:focus {
  border-color: #2D3436;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
}

/* Pulsante premium e link */
.link-subtle:hover { color: #E67E22 !important; }
.minimal-toggle:hover { color: #2D3436 !important; }

.action-button-premium {
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.3s ease;
}
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
.action-button-premium:hover::before { width: 100%; }
.action-button-premium:hover { box-shadow: 0 12px 25px rgba(230, 126, 34, 0.25) !important; }

.arrow { transition: transform 0.3s ease; }
.action-button-premium:hover .arrow { transform: translateX(5px); }

.alert-danger {
  background-color: #fff5f5;
  color: #d63031;
}
</style>