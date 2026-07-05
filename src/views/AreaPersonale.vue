<template>
  <!-- Commento: Container responsivo con padding controllato per mobile-first -->
  <div class="container-fluid py-3 py-md-4">
    <!-- Commento: Skip to main link - invisibile ma navigabile da tastiera per accessibilità -->
    <a href="#profilo-section" class="visually-hidden visually-hidden-focusable">Salta al contenuto principale</a>
    
    <!-- SEZIONE PROFILO UTENTE: Responsive layout con Bootstrap -->
    <div class="row mb-4" id="profilo-section">
      <div class="col-12">
        <!-- Commento: Card con padding responsive p-3 p-md-4 per adattarsi ai breakpoint -->
        <div class="card rounded-4 border-0 shadow-sm p-3 p-md-4">
          <div class="row align-items-center g-3 g-md-4">
            <!-- Commento: Avatar responsivo con dimensioni fisse ma allineate bene -->
            <div class="col-12 col-sm-auto mb-2 mb-sm-0 text-center text-sm-start">
              <div 
                class="rounded-circle bg-warning d-flex align-items-center justify-content-center shadow" 
                style="width: 80px; height: 80px;"
                role="img"
                :aria-label="`Avatar di ${nomeUtente || 'Utente'}`"
              >
                <span class="fs-3 fw-bold text-white">{{ nomeUtente.charAt(0).toUpperCase() || 'U' }}</span>
              </div>
            </div>
            <div class="col-md-5">
              <span class="badge rounded-pill bg-success bg-opacity-10 text-success fw-semibold py-1 px-3 mb-2" v-if="!isModifica">Esame informatica</span>
              <h2 class="fw-bold mb-1">{{ nomeUtente || 'Utente' }}</h2>
              <p class="text-muted mb-0">
                <i class="bi bi-envelope-fill me-1"></i> {{ emailUtente }}
              </p>
            </div>
            <div class="col-md-5 text-center text-md-end mt-3 mt-md-0">
              <!-- Commento: Pulsante Modifica con aria-label per accessibilità -->
              <div v-if="!isModifica" class="d-flex flex-wrap gap-2 justify-content-center justify-content-md-end">
                <!-- Commento: Pulsante modifica profilo con colore Bootstrap personalizzato (E67E22) -->
                <button 
                  @click="isModifica = true" 
                  class="btn text-white fw-bold px-4 py-2 rounded-3 shadow-sm border-0"
                  style="background-color: #E67E22;"
                  aria-label="Modifica il tuo profilo e i tuoi dati"
                >
                  <i class="bi bi-pencil-square me-2" aria-hidden="true"></i>Modifica Profilo
                </button>
                <!-- Commento: Pulsante logout con Bootstrap btn-dark -->
                <button 
                  @click="confermaLogout" 
                  class="btn btn-dark fw-bold px-4 py-2 rounded-3 border-0 shadow-sm d-inline-flex align-items-center justify-content-center"
                  style="background-color: #2D3436; min-width: 140px;"
                  aria-label="Esci dal tuo account"
                >
                  <i class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Log Out
                </button>
              </div>
              <!-- Commento: Pulsanti Salva/Annulla con aria-busy per stato di salvataggio -->
              <div v-else class="d-flex gap-2 justify-content-center justify-content-md-end flex-wrap">
                <!-- Commento: Pulsante salva con aria-busy per indicare stato di caricamento -->
                <button 
                  @click="salvaModifiche" 
                  class="btn btn-success fw-bold px-4 py-2 rounded-3"
                  :disabled="staSalvando"
                  :aria-busy="staSalvando"
                  aria-label="Salva le modifiche al profilo"
                >
                  <i class="bi bi-check2 me-2" aria-hidden="true"></i>{{ staSalvando ? 'Salvataggio...' : 'Salva' }}
                </button>
                <!-- Commento: Pulsante annulla con aria-label -->
                <button 
                  @click="annullaModifiche" 
                  class="btn btn-outline-secondary fw-bold px-4 py-2 rounded-3"
                  :disabled="staSalvando"
                  aria-label="Annulla le modifiche"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Commento: Form modifica dati con layout responsivo grid con g-3 gap -->
        <div v-if="isModifica" class="card border-0 shadow-sm p-3 p-md-4 mt-4">
          <h5 class="fw-bold mb-4 text-dark">Modifica i tuoi dati</h5>
          
          <!-- Commento: Form grid con col-md per responsive su tablet/desktop -->
          <div class="row g-3 g-md-4">
            <!-- Commento: Campo nome con label collegato via id -->
            <div class="col-12 col-md-6">
              <label for="nome" class="form-label fw-bold text-dark small">Nome</label>
              <input 
                type="text" 
                v-model="datiModifica.nome" 
                id="nome"
                class="form-control rounded-3"
                placeholder="Il tuo nome"
              />
            </div>
            
            <!-- Commento: Campo cognome responsivo -->
            <div class="col-12 col-md-6">
              <label for="cognome" class="form-label fw-bold text-dark small">Cognome</label>
              <input 
                type="text" 
                v-model="datiModifica.cognome" 
                id="cognome"
                class="form-control rounded-3"
                placeholder="Il tuo cognome"
              />
            </div>

            <!-- Commento: Campo bio a tutta larghezza con textarea -->
            <div class="col-12">
              <label for="bio" class="form-label fw-bold text-dark small">Bio / Specialità</label>
              <textarea 
                v-model="datiModifica.bio" 
                id="bio"
                class="form-control rounded-3"
                rows="3"
                placeholder="Descrivi i tuoi piatti preferiti..."
              ></textarea>
            </div>

            <!-- Commento: Telefono con col-md-6 per layout 2 colonne -->
            <div class="col-12 col-md-6">
              <label for="telefono" class="form-label fw-bold text-dark small">Telefono (facoltativo)</label>
              <input 
                type="tel" 
                v-model="datiModifica.telefono" 
                id="telefono"
                class="form-control rounded-3"
                placeholder="+39 3xx xxxx xxxx"
              />
            </div>

            <!-- Commento: Città responsiva accanto a telefono -->
            <div class="col-12 col-md-6">
              <label for="citta" class="form-label fw-bold text-dark small">Città (facoltativo)</label>
              <input 
                type="text" 
                v-model="datiModifica.citta" 
                id="citta"
                class="form-control rounded-3"
                placeholder="La tua città"
              />
            </div>

            <!-- Commento: Campo password nascosto con placeholder chiaro -->
            <div class="col-12">
              <label for="password" class="form-label fw-bold text-dark small">Nuova password</label>
              <input 
                type="password" 
                v-model="nuovaPassword" 
                id="password"
                class="form-control rounded-3"
                placeholder="Lascia vuoto se non vuoi cambiarla"
              />
            </div>
          </div>

          <!-- Commento: Messaggi di feedback con role alert per screen reader -->
          <div v-if="messaggioErrore" class="alert alert-danger mt-3 border-0 small py-2 rounded-3" role="alert">
            {{ messaggioErrore }}
          </div>
          <div v-if="messaggioSuccesso" class="alert alert-success mt-3 border-0 small py-2 rounded-3" role="status">
            {{ messaggioSuccesso }}
          </div>
        </div>
      </div>
    </div>

    <!-- SEZIONE RICETTE PREFERITE: Layout responsivo -->
    <div class="row mt-4">
      <div class="col-12">
        <!-- Commento: Header sezione preferiti con conteggio ricette -->
        <div class="d-flex justify-content-between align-items-center mb-3 mb-md-4">
          <div>
            <h4 class="fw-bold m-0 text-dark">I tuoi Preferiti</h4>
            <small class="text-muted">Ricette salvate: {{ favorites.length }}</small>
          </div>
        </div>

        <!-- Commento: Card vuota se nessuna ricetta salvata - con layout flessibile -->
        <div v-if="favorites.length === 0" class="card border-0 shadow-sm rounded-4 overflow-hidden p-3 p-md-4 bg-white">
          <div class="d-flex align-items-center gap-3 flex-wrap">
            <div class="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center flex-shrink-0" style="width: 50px; height: 50px;">
              <i class="bi bi-heart-fill fs-4" aria-hidden="true"></i>
            </div>
            <div>
              <h5 class="mb-1 text-dark">Nessuna ricetta salvata</h5>
              <p class="mb-0 text-muted small">Salva le tue ricette preferite dalla Home per vederle qui.</p>
            </div>
          </div>
        </div>

        <!-- Commento: Griglia ricette con row-cols responsivo (1 su mobile, 2 su sm, 3 su md, 4 su lg) -->
        <div v-else class="row g-3 g-md-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
          <!-- Commento: Card ricetta singola per loop con chiave unica -->
          <div class="col" v-for="recipe in favorites" :key="recipe.id">
            <!-- Commento: Card con overflow hidden, h-100 per uguale altezza, cursor pointer -->
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100" style="cursor: pointer;" @click="apriDettagli(recipe)">
              <!-- Commento: Ratio container 4x3 con posizione relativa per bottone assoluto -->
              <div class="ratio ratio-4x3 position-relative bg-light">
                <!-- Commento: Immagine con alt text descrittivo per accessibilità -->
                <img :src="recipe.image" class="card-img-top object-fit-cover" :alt="`${recipe.title} - ricetta di ${recipe.author || recipe.chef || 'Chef Anonimo'}`" />
                <!-- Commento: Bottone rimuovi dai preferiti con stile cuore pieno, uguale alla Home -->
                <button
                  class="btn btn-light btn-sm rounded-circle border shadow-sm position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center p-0 heart-btn"
                  type="button"
                  @click.stop="rimuoviPreferito(recipe.id)"
                  :aria-label="`Rimuovi ${recipe.title} dai preferiti`"
                  title="Rimuovi dai preferiti"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="favorite-heart-icon"
                  >
                    <path
                      d="M12 20s-7-4.8-9.2-8.9C1 8.4 1.9 5.2 4.8 4.1c2.3-.8 4.5.2 6 2.1 1.5-1.9 3.7-2.9 6-2.1 2.9 1.1 3.8 4.3 2 7C19 15.2 12 20 12 20Z"
                      fill="#ff4d67"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <!-- Commento: Body card con info ricetta e flexbox per allineamento -->
              <div class="card-body bg-white p-3 d-flex flex-column justify-content-between">
                <!-- Commento: Titolo ricetta truncato su una linea -->
                <h5 class="card-title fw-bold m-0 text-truncate text-dark">{{ recipe.title }}</h5>
                <!-- Commento: Footer card con Chef e tempo di preparazione -->
                <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                  <small class="text-muted text-truncate" style="min-width: 0;">Chef {{ recipe.author || recipe.chef || 'Anonimo' }}</small>
                  <!-- Commento: Badge tempo con border Bootstrap standard -->
                  <span class="badge rounded-pill border px-2 py-1 small border-secondary text-dark">
                    {{ recipe.readyInMinutes || recipe.time || 30 }} min
                  </span>
                </div>
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
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, updatePassword, signOut } from 'firebase/auth';

defineProps(['utente']);
const emit = defineEmits(['logout']);

// Stato dell'interfaccia
const router = useRouter();
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

// Chiede la conferma, esegue il Log Out su Firebase ed effettua il redirect automatico a Login
const confermaLogout = async () => {
  const risposta = confirm("Sei sicuro di voler uscire dal tuo account?");
  if (risposta) {
    try {
      // 1. Eseguiamo il signout da Firebase Authentication
      await signOut(auth);
      
      // 2. Comunichiamo al componente padre l'avvenuta disconnessione
      emit('logout');
      
      // 3. Spostiamo l'utente via router alla vista di Login
      router.push({ name: 'Login' }); // Assicurati che nel tuo file router il path di Login si chiami esattamente con name: 'Login'
    } catch (error) {
      console.error("Errore durante il logout:", error);
      messaggioErrore.value = "Impossibile disconnettersi. Riprova.";
    }
  }
};

// Carica i dati dell'utente da Firebase
const caricaDatiUtente = async () => {
  try {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        emailUtente.value = user.email || '';
        
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
  datiModifica.value = {
    nome: nomeUtente.value,
    cognome: datiModifica.value.cognome,
    bio: datiModifica.value.bio,
    telefono: datiModifica.value.telefono,
    citta: datiModifica.value.citta
  };
};

const rimuoviPreferito = async (recipeId) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    favorites.value = favorites.value.filter((item) => item.id?.toString() !== recipeId?.toString());

    const userDocRef = doc(db, 'utenti', user.uid);
    await setDoc(userDocRef, { favorites: favorites.value }, { merge: true });
  } catch (error) {
    console.error('Errore rimozione preferito:', error);
  }
};

const apriDettagli = (recipe) => {
  if (recipe?.id) {
    router.push({ name: 'DettagliRicetta', params: { id: recipe.id }, query: { from: 'preferiti' } });
  }
};

onMounted(() => {
  caricaDatiUtente();
});
</script>

<style scoped>
.favorite-heart-icon {
  width: 16px;
  height: 16px;
  color: #ff4d67;
}

.heart-btn {
  width: 36px;
  height: 36px;
  background-color: #ffffff;
}

.recipe-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recipe-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}
</style>