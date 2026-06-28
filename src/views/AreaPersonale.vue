<template>
  <div class="container py-4">
    <!-- SEZIONE PROFILO UTENTE -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card profile-card border-0 shadow-sm p-4 text-center text-md-start">
          <div class="row align-items-center">
            <div class="col-md-2 mb-3 mb-md-0 text-center">
              <div class="avatar-circle mx-auto">
                <span class="avatar-letter">{{ nomeUtente.charAt(0).toUpperCase() || 'U' }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <span class="badge status-badge mb-2" v-if="!isModifica">Esame informatica</span>
              <h2 class="fw-bold mb-1">{{ nomeUtente || 'Utente' }}</h2>
              <p class="text-muted mb-0">
                <i class="bi bi-envelope-fill me-1"></i> {{ emailUtente }}
              </p>
            </div>
            <div class="col-md-4 text-center text-md-end mt-3 mt-md-0">
              <button 
                v-if="!isModifica"
                @click="isModifica = true" 
                class="btn btn-custom-orange fw-bold px-4 py-2"
              >
                <i class="bi bi-pencil-square me-2"></i>Modifica Profilo
              </button>
              <div v-else class="d-flex gap-2 justify-content-center justify-content-md-end">
                <button 
                  @click="salvaModifiche" 
                  class="btn btn-success fw-bold px-4 py-2"
                  :disabled="staSalvando"
                >
                  <i class="bi bi-check2 me-2"></i>{{ staSalvando ? 'Salvataggio...' : 'Salva' }}
                </button>
                <button 
                  @click="annullaModifiche" 
                  class="btn btn-secondary fw-bold px-4 py-2"
                  :disabled="staSalvando"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- FORM DI MODIFICA -->
        <div v-if="isModifica" class="card border-0 shadow-sm p-4 mt-4">
          <h5 class="fw-bold mb-4 text-dark-custom">Modifica i tuoi dati</h5>
          
          <div class="row g-3">
            <div class="col-md-6">
              <label for="nome" class="form-label fw-bold text-dark-custom">Nome</label>
              <input 
                type="text" 
                v-model="datiModifica.nome" 
                id="nome"
                class="form-control custom-input py-2 px-3"
                placeholder="Il tuo nome"
              />
            </div>
            
            <div class="col-md-6">
              <label for="cognome" class="form-label fw-bold text-dark-custom">Cognome</label>
              <input 
                type="text" 
                v-model="datiModifica.cognome" 
                id="cognome"
                class="form-control custom-input py-2 px-3"
                placeholder="Il tuo cognome"
              />
            </div>

            <div class="col-12">
              <label for="bio" class="form-label fw-bold text-dark-custom">Bio / Specialità</label>
              <textarea 
                v-model="datiModifica.bio" 
                id="bio"
                class="form-control custom-input py-2 px-3"
                rows="3"
                placeholder="Descrivi i tuoi piatti preferiti..."
              ></textarea>
            </div>

            <div class="col-md-6">
              <label for="telefono" class="form-label fw-bold text-dark-custom">Telefono (facoltativo)</label>
              <input 
                type="tel" 
                v-model="datiModifica.telefono" 
                id="telefono"
                class="form-control custom-input py-2 px-3"
                placeholder="+39 3xx xxxx xxxx"
              />
            </div>

            <div class="col-md-6">
              <label for="citta" class="form-label fw-bold text-dark-custom">Città (facoltativo)</label>
              <input 
                type="text" 
                v-model="datiModifica.citta" 
                id="citta"
                class="form-control custom-input py-2 px-3"
                placeholder="La tua città"
              />
            </div>

            <div class="col-12">
              <label for="password" class="form-label fw-bold text-dark-custom">Nuova password</label>
              <input 
                type="password" 
                v-model="nuovaPassword" 
                id="password"
                class="form-control custom-input py-2 px-3"
                placeholder="Lascia vuoto se non vuoi cambiarla"
              />
            </div>
          </div>

          <div v-if="messaggioErrore" class="alert alert-danger mt-3 border-0 small py-2 rounded-3">
            {{ messaggioErrore }}
          </div>
          <div v-if="messaggioSuccesso" class="alert alert-success mt-3 border-0 small py-2 rounded-3">
            {{ messaggioSuccesso }}
          </div>
        </div>
      </div>
    </div>

    <!-- SEZIONE RICETTE PREFERITE -->
    <div class="row">
      <div class="col-lg-3 mb-4">
        <div class="list-group shadow-sm border-0">
          <button class="list-group-item list-group-item-action active-custom fw-bold">
            Ricette Preferite (3)
          </button>
        </div>
      </div>

      <div class="col-lg-9">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="fw-bold m-0 text-dark-custom">I tuoi Preferiti</h4>
        </div>

        <div class="row row-cols-1 row-cols-md-3 g-3">
          <div class="col">
            <div class="card recipe-card h-100 border-0 shadow-sm">
              <div class="recipe-img-placeholder text-white d-flex align-items-center justify-content-center">
                <span>Carbonara 🍝</span>
              </div>
              <div class="card-body p-3">
                <span class="badge text-bg-warning-custom mb-2">Primo</span>
                <h5 class="card-title fw-bold text-truncate mb-1">Spaghetti alla Carbonara</h5>
                <p class="card-text small text-muted text-truncate-2">La ricetta scientifica perfetta per il professore.</p>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card recipe-card h-100 border-0 shadow-sm">
              <div class="recipe-img-placeholder text-white d-flex align-items-center justify-content-center">
                <span>Tiramisù ☕</span>
              </div>
              <div class="card-body p-3">
                <span class="badge text-bg-warning-custom mb-2">Dolce</span>
                <h5 class="card-title fw-bold text-truncate mb-1">Tiramisù Classico</h5>
                <p class="card-text small text-muted text-truncate-2">Il dolce perfetto per ricaricare le energie post-esame.</p>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card recipe-card h-100 border-0 shadow-sm">
              <div class="recipe-img-placeholder text-white d-flex align-items-center justify-content-center">
                <span>Pizza 🍕</span>
              </div>
              <div class="card-body p-3">
                <span class="badge text-bg-warning-custom mb-2">Lievitati</span>
                <h5 class="card-title fw-bold text-truncate mb-1">Pizza Margherita</h5>
                <p class="card-text small text-muted text-truncate-2">Idratazione al 70% con cornicione pronunciato.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, updatePassword } from 'firebase/auth';

defineProps(['utente']);
defineEmits(['logout']);

// Stato dell'interfaccia
const isModifica = ref(false);
const staSalvando = ref(false);
const messaggioErrore = ref('');
const messaggioSuccesso = ref('');

// Dati dell'utente
const emailUtente = ref('');
const nomeUtente = ref('');
const nuovaPassword = ref('');
const datiModifica = ref({
  nome: '',
  cognome: '',
  bio: '',
  telefono: '',
  citta: ''
});

// Carica i dati dell'utente da Firebase
const caricaDatiUtente = async () => {
  try {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        emailUtente.value = user.email || '';
        
        // Leggi i dati dal documento Firestore
        const userDocRef = doc(db, 'utenti', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const dati = userDocSnap.data();
          nomeUtente.value = dati.nome || 'Utente';
          datiModifica.value = {
            nome: dati.nome || '',
            cognome: dati.cognome || '',
            bio: dati.bio || '',
            telefono: dati.telefono || '',
            citta: dati.citta || ''
          };
        } else {
          // Se il documento non esiste, crea i dati di base
          nomeUtente.value = 'Nuovo Chef';
          datiModifica.value = {
            nome: '',
            cognome: '',
            bio: '',
            telefono: '',
            citta: ''
          };
        }
      }
    });
  } catch (error) {
    console.error('Errore nel caricamento dati:', error);
    messaggioErrore.value = 'Errore nel caricamento dei dati dell\'utente';
  }
};

// Salva le modifiche su Firestore
const salvaModifiche = async () => {
  if (!datiModifica.value.nome.trim()) {
    messaggioErrore.value = 'Il nome è obbligatorio';
    return;
  }

  staSalvando.value = true;
  messaggioErrore.value = '';
  messaggioSuccesso.value = '';

  try {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'utenti', user.uid);
      await setDoc(userDocRef, {
        email: emailUtente.value,
        nome: datiModifica.value.nome,
        cognome: datiModifica.value.cognome,
        bio: datiModifica.value.bio,
        telefono: datiModifica.value.telefono,
        citta: datiModifica.value.citta,
        ultimoAggiornamento: new Date()
      }, { merge: true });

      if (nuovaPassword.value.trim()) {
        await updatePassword(user, nuovaPassword.value);
      }

      nomeUtente.value = datiModifica.value.nome;
      nuovaPassword.value = '';
      isModifica.value = false;
      messaggioSuccesso.value = 'Profilo aggiornato con successo!';
      
      setTimeout(() => {
        messaggioSuccesso.value = '';
      }, 3000);
    }
  } catch (error) {
    console.error('Errore nel salvataggio:', error);
    messaggioErrore.value = 'Errore nel salvataggio dei dati. Riprova più tardi.';
  } finally {
    staSalvando.value = false;
  }
};

// Annulla le modifiche
const annullaModifiche = () => {
  isModifica.value = false;
  messaggioErrore.value = '';
  messaggioSuccesso.value = '';
  nuovaPassword.value = '';
  // Ricarica i dati precedenti
  datiModifica.value = {
    nome: nomeUtente.value,
    cognome: datiModifica.value.cognome,
    bio: datiModifica.value.bio,
    telefono: datiModifica.value.telefono,
    citta: datiModifica.value.citta
  };
};

// Carica i dati al montaggio del componente
onMounted(() => {
  caricaDatiUtente();
});
</script>

<style scoped>
/* PALETTE DI COLORI */
:root {
  --color-bg: #F9F7F2;          
  --color-dark: #2D3436;        
  --color-orange: #E67E22;      
  --color-green: #27AE60;       
  --color-yellow: #F1C40F;      
}

.profile-card {
  background-color: #ffffff;
  border-radius: 16px;
}

.text-dark-custom {
  color: var(--color-dark, #2D3436);
}

.avatar-circle {
  width: 90px;
  height: 90px;
  background-color: var(--color-yellow, #F1C40F);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.avatar-letter {
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
}

.status-badge {
  background-color: rgba(39, 174, 96, 0.1);
  color: var(--color-green, #27AE60);
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 50px;
}

.text-bg-warning-custom {
  background-color: rgba(241, 196, 15, 0.15);
  color: #cc9a06;
  font-weight: 600;
}

.btn-custom-orange {
  background-color: var(--color-orange, #E67E22);
  color: white;
  border: none;
  border-radius: 8px;
  transition: opacity 0.2s;
}
.btn-custom-orange:hover {
  opacity: 0.9;
  color: white;
}

.active-custom {
  background-color: var(--color-orange, #E67E22) !important;
  border-color: var(--color-orange, #E67E22) !important;
  color: white !important;
}

.recipe-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;
}
.recipe-card:hover {
  transform: translateY(-3px);
}

.recipe-img-placeholder {
  height: 140px;
  background-color: var(--color-dark, #2D3436);
  font-size: 18px;
  font-weight: 500;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

/* INPUT FORM PERSONALIZZATI */
.custom-input {
  background-color: #fcfbfa;
  border: 1px solid #e2ded6;
  color: #2D3436;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.custom-input::placeholder {
  color: #b2bec3;
}

.custom-input:focus {
  border-color: var(--color-orange, #E67E22);
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
  outline: none;
}

.form-label {
  color: var(--color-dark, #2D3436);
  font-size: 14px;
}

/* PULSANTI */
.btn-success {
  background-color: var(--color-green, #27AE60);
  border-color: var(--color-green, #27AE60);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-success:hover {
  background-color: #1f8c48;
  border-color: #1f8c48;
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* MESSAGGI ALERT */
.alert {
  border-radius: 12px;
  background-color: #f8f9fa;
  border: none;
}

.alert-success {
  background-color: rgba(39, 174, 96, 0.1);
  color: var(--color-green, #27AE60);
  border-left: 4px solid var(--color-green, #27AE60);
}

.alert-danger {
  background-color: rgba(211, 48, 49, 0.1);
  color: #d32031;
  border-left: 4px solid #d32031;
}
</style>