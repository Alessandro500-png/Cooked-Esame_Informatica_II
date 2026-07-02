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
            Ricette Preferite ({{ favorites.length }})
          </button>
        </div>
      </div>

      <div class="col-lg-9">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 class="fw-bold m-0 text-dark-custom">I tuoi Preferiti</h4>
            <small class="text-muted">Ricette salvate: {{ favorites.length }}</small>
          </div>
        </div>

        <div v-if="favorites.length === 0" class="alert alert-light border-0 shadow-sm rounded-4">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
              <i class="bi bi-heart-fill fs-4"></i>
            </div>
            <div>
              <h5 class="mb-1">Nessuna ricetta salvata</h5>
              <p class="mb-0 text-muted">Salva le tue ricette preferite dalla Home o dalla ricerca per vederle qui.</p>
            </div>
          </div>
        </div>

        <div v-else class="row row-cols-1 row-cols-md-3 g-3">
          <div class="col" v-for="recipe in favorites" :key="recipe.id">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <div class="ratio ratio-4x3 position-relative">
                <img :src="recipe.image" class="card-img-top object-fit-cover" :alt="recipe.title" />
                <div class="favorite-badge position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" style="width: 38px; height: 38px;">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc3545" stroke="none" width="20" height="20">
                    <path d="M20.84 4.61c-1.54-1.54-4.04-1.54-5.58 0L12 7.88 8.74 4.61C7.2 3.07 4.7 3.07 3.16 4.61c-1.54 1.54-1.54 4.04 0 5.58L12 18.11l8.84-8.84c1.54-1.54 1.54-4.04 0-5.58Z" />
                  </svg>
                </div>
              </div>
              <div class="card-body p-3">
                <span class="badge rounded-pill bg-warning bg-opacity-10 text-warning fw-semibold mb-2">{{ recipe.category || 'Speciale' }}</span>
                <h5 class="card-title fw-bold text-truncate mb-1">{{ recipe.title }}</h5>
                <p class="card-text small text-muted text-truncate">Tempo: {{ recipe.readyInMinutes }} min · Porzioni: {{ recipe.servings }}</p>
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
const favorites = ref([]);
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
          favorites.value = dati.favorites || [];
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
          favorites.value = [];
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

