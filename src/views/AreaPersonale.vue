<template>
  <div class="container py-4">
    <!-- SEZIONE PROFILO UTENTE -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card rounded-4 border-0 shadow-sm p-4 text-center text-md-start">
          <div class="row align-items-center">
            <div class="col-md-2 mb-3 mb-md-0 text-center">
              <div class="rounded-circle bg-warning d-flex align-items-center justify-content-center shadow mx-auto" style="width: 90px; height: 90px;">
                <span class="fs-1 fw-bold text-white">{{ nomeUtente.charAt(0).toUpperCase() || 'U' }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <span class="badge rounded-pill bg-success bg-opacity-10 text-success fw-semibold py-1 px-3 mb-2" v-if="!isModifica">Esame informatica</span>
              <h2 class="fw-bold mb-1">{{ nomeUtente || 'Utente' }}</h2>
              <p class="text-muted mb-0">
                <i class="bi bi-envelope-fill me-1"></i> {{ emailUtente }}
              </p>
            </div>
            <div class="col-md-4 text-center text-md-end mt-3 mt-md-0">
              <button 
                v-if="!isModifica"
                @click="isModifica = true" 
                class="btn btn-warning text-white fw-bold px-4 py-2 rounded-3"
                style="background-color: #E67E22; border-color: #E67E22;"
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
          <h5 class="fw-bold mb-4 text-dark">Modifica i tuoi dati</h5>
          
          <div class="row g-3">
            <div class="col-md-6">
              <label for="nome" class="form-label fw-bold text-dark">Nome</label>
              <input 
                type="text" 
                v-model="datiModifica.nome" 
                id="nome"
                class="form-control rounded-3 border-secondary-subtle bg-light"
                placeholder="Il tuo nome"
              />
            </div>
            
            <div class="col-md-6">
              <label for="cognome" class="form-label fw-bold text-dark">Cognome</label>
              <input 
                type="text" 
                v-model="datiModifica.cognome" 
                id="cognome"
                class="form-control rounded-3 border-secondary-subtle bg-light"
                placeholder="Il tuo cognome"
              />
            </div>

            <div class="col-12">
              <label for="bio" class="form-label fw-bold text-dark">Bio / Specialità</label>
              <textarea 
                v-model="datiModifica.bio" 
                id="bio"
                class="form-control rounded-3 border-secondary-subtle bg-light"
                rows="3"
                placeholder="Descrivi i tuoi piatti preferiti..."
              ></textarea>
            </div>

            <div class="col-md-6">
              <label for="telefono" class="form-label fw-bold text-dark">Telefono (facoltativo)</label>
              <input 
                type="tel" 
                v-model="datiModifica.telefono" 
                id="telefono"
                class="form-control rounded-3 border-secondary-subtle bg-light"
                placeholder="+39 3xx xxxx xxxx"
              />
            </div>

            <div class="col-md-6">
              <label for="citta" class="form-label fw-bold text-dark">Città (facoltativo)</label>
              <input 
                type="text" 
                v-model="datiModifica.citta" 
                id="citta"
                class="form-control rounded-3 border-secondary-subtle bg-light"
                placeholder="La tua città"
              />
            </div>

            <div class="col-12">
              <label for="password" class="form-label fw-bold text-dark">Nuova password</label>
              <input 
                type="password" 
                v-model="nuovaPassword" 
                id="password"
                class="form-control rounded-3 border-secondary-subtle bg-light"
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
          <button type="button" class="list-group-item list-group-item-action active bg-warning text-white fw-bold rounded-3" style="border-color: #E67E22; background-color: #E67E22;">
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
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <div class="ratio ratio-4x3 bg-dark text-white d-flex align-items-center justify-content-center">
                <span class="fw-semibold">Carbonara 🍝</span>
              </div>
              <div class="card-body p-3">
                <span class="badge rounded-pill bg-warning bg-opacity-10 text-warning fw-semibold mb-2">Primo</span>
                <h5 class="card-title fw-bold text-truncate mb-1">Spaghetti alla Carbonara</h5>
                <p class="card-text small text-muted text-truncate">La ricetta scientifica perfetta per il professore.</p>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <div class="ratio ratio-4x3 bg-dark text-white d-flex align-items-center justify-content-center">
                <span class="fw-semibold">Tiramisù ☕</span>
              </div>
              <div class="card-body p-3">
                <span class="badge rounded-pill bg-warning bg-opacity-10 text-warning fw-semibold mb-2">Dolce</span>
                <h5 class="card-title fw-bold text-truncate mb-1">Tiramisù Classico</h5>
                <p class="card-text small text-muted text-truncate">Il dolce perfetto per ricaricare le energie post-esame.</p>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <div class="ratio ratio-4x3 bg-dark text-white d-flex align-items-center justify-content-center">
                <span class="fw-semibold">Pizza 🍕</span>
              </div>
              <div class="card-body p-3">
                <span class="badge rounded-pill bg-warning bg-opacity-10 text-warning fw-semibold mb-2">Lievitati</span>
                <h5 class="card-title fw-bold text-truncate mb-1">Pizza Margherita</h5>
                <p class="card-text small text-muted text-truncate">Idratazione al 70% con cornicione pronunciato.</p>
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

