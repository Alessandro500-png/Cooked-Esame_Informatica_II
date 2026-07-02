<template>
  <div class="container-fluid min-vh-100 p-0" style="background-color: #F9F7F2;">
    
    <header class="navbar navbar-expand bg-white fixed-top shadow-sm px-4 d-flex align-items-center justify-content-between" style="height: 70px; z-index: 1030;">
      
      <div style="min-width: 100px;">
        <button 
          v-if="tabAttiva === 'profilo'" 
          class="btn rounded-circle d-flex align-items-center justify-content-center lh-1 fs-5 border-0"
          style="width: 40px; height: 40px; background-color: #F1EFF4; color: #2D3436;"
          @click="tabAttiva = 'ricerca'"
          title="Torna alla Home"
        >
          ←
        </button>
        <div 
          v-else 
          class="navbar-brand cursor-pointer m-0 text-dark" 
          style="font-weight: 900; letter-spacing: -1px; font-size: 1.5rem;"
          @click="tabAttiva = 'ricerca'"
        >
          Cooked<span style="color: #E67E22;">.</span>
        </div>
      </div>

      <div v-if="tabAttiva !== 'profilo'" class="flex-grow-1 mx-3 mx-md-5">
        <form @submit.prevent="avviaRicerca" class="w-100 position-relative">
          <span class="position-absolute top-50 translate-middle-y start-0 ms-3 text-muted">🔍</span>
          <input 
            type="text" 
            v-model="testoRicerca" 
            placeholder="Cerca ricette, ingredienti o chef..." 
            class="form-control rounded-pill border-0 px-5 py-2"
            style="background-color: #F1EFF4; color: #2D3436;"
            @focus="isFocused = true"
            @blur="setTimeout(() => isFocused = false, 200)"
          />
          <button
            type="submit"
            class="btn position-absolute top-50 rounded-pill px-4 py-2"
            style="z-index: 2; right: 0; transform: translateY(-50%); background-color: #E67E22; border-color: #E67E22; color: #ffffff;"
          >
            Cerca
          </button>

          <ul 
            v-if="isFocused && suggerimentiFiltrati.length > 0" 
            class="dropdown-menu show w-100 mt-1 shadow border-0 rounded-3 text-start"
            style="max-height: 250px; overflow-y: auto;"
          >
            <li v-for="suggerimento in suggerimentiFiltrati" :key="suggerimento.id">
              <button 
                class="dropdown-item py-2 px-4 d-flex align-items-center" 
                type="button"
                @mousedown="selezionaSuggerimento(suggerimento.nome)"
              >
                <span class="text-muted me-2">🔍</span>
                <span class="text-antracite fw-medium">{{ suggerimento.nome }}</span>
              </button>
            </li>
          </ul>
        </form>
      </div>
      <div v-else class="flex-grow-1"></div>

      <div>
        <button 
          class="btn d-flex align-items-center justify-content-center p-0 rounded-circle border-0"
          :style="tabAttiva === 'profilo' ? 'width: 44px; height: 44px; background-color: #2D3436; color: #ffffff;' : 'width: 44px; height: 44px; background-color: #F1EFF4; color: #2D3436;'"
          @click="tabAttiva = 'profilo'"
          title="Area Personale"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="pt-5 mt-4">
      <main class="container py-4 py-md-5">
        
        <div v-if="tabAttiva === 'ricerca'">
          <div class="mb-4 text-start">
            <h1 class="display-6 mb-2 text-dark" style="font-weight: 800; color: #2D3436;">Di cosa hai voglia?</h1>
            <p class="text-secondary fs-6">Scegli la tua ricetta preferita per dare inizio alla creatività</p>
          </div>

          <div class="d-flex flex-wrap gap-2 mb-5">
            <button 
              v-for="categoria in categorie" 
              :key="categoria.id"
              type="button"
              class="btn rounded-pill px-4 fw-bold shadow-sm border-0"
              :style="categoriaAttiva === categoria.id ? `background-color: ${categoria.colore}; color: ${categoria.testoColore};` : 'background-color: #ffffff; color: #2D3436;'"
              @click="categoriaAttiva = categoria.id"
            >
              {{ categoria.nome }}
            </button>
          </div>

          <div v-if="caricamentoInCorso" class="text-center py-5">
            <div class="spinner-border" style="color: #2D3436;" role="status">
              <span class="visually-hidden">Caricamento in corso...</span>
            </div>
          </div>

          <div v-else class="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            <div 
              class="col" 
              v-for="ricetta in ricetteFiltrate" 
              :key="ricetta.id"
              @click="mostraDettagli(ricetta)"
              style="cursor: pointer;"
            >
              <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <div class="ratio ratio-4x3 position-relative">
                  <img 
                    :src="ricetta.immagine || ricetta.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500'" 
                    class="card-img-top object-fit-cover" 
                    :alt="ricetta.titolo || ricetta.name || ricetta.title"
                  />
                  <button
                    type="button"
                    class="btn btn-light btn-sm rounded-circle border shadow-sm position-absolute top-0 end-0 mt-n1 me-n1 d-flex align-items-center justify-content-center p-2"
                    @click.stop="togglePreferito(ricetta)"
                    :title="isPreferita(ricetta) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isPreferita(ricetta) ? '#dc3545' : 'none'" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bi bi-heart">
                      <path d="M20.84 4.61c-1.54-1.54-4.04-1.54-5.58 0L12 7.88 8.74 4.61C7.2 3.07 4.7 3.07 3.16 4.61c-1.54 1.54-1.54 4.04 0 5.58L12 18.11l8.84-8.84c1.54-1.54 1.54-4.04 0-5.58Z" />
                    </svg>
                  </button>
                </div>
                <div class="card-body bg-white p-3 d-flex flex-column justify-content-between">
                  <h5 class="card-title fw-bold m-0 text-truncate" style="color: #2D3436; max-width: 100%;">
                    {{ ricetta.titolo || ricetta.name || ricetta.title || 'Ricetta Speciale' }}
                  </h5>
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <small class="text-muted text-truncate" style="max-width: 60%;">Chef {{ ricetta.autore || ricetta.chef || 'Anonimo' }}</small>
                    <span class="badge rounded-pill border px-2 py-1 small" style="background-color: #F1EFF4; color: #2D3436; border-color: #e2ded6 !important;">
                      {{ ricetta.difficolta || ricetta.difficulty || 'Media' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!caricamentoInCorso && ricetteFiltrate.length === 0" class="text-center text-muted py-5">
            Nessun elemento trovato.
          </div>
        </div>

        <Risultati v-else-if="tabAttiva === 'risultati'" :ricercaQuery="testoRicerca" :categoriaQuery="categoriaAttiva" />
        <AreaPersonale v-else-if="tabAttiva === 'profilo'" :utente="utente" @logout="$emit('logout')" />
      </main>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, toRef } from 'vue';
import AreaPersonale from './AreaPersonale.vue';
import Risultati from './Risultati.vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const props = defineProps({ utente: Object });
const utente = toRef(props, 'utente');
defineEmits(['logout']);

const tabAttiva = ref('ricerca');
const testoRicerca = ref('');
const categoriaAttiva = ref('tutte');
const ricettaSelezionata = ref(null);

const ricette = ref([]);
const caricamentoInCorso = ref(true);
const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;

const categorie = ref([
  { id: 'tutte', nome: 'Tutte', colore: '#2D3436', testoColore: '#ffffff' },
  { id: 'primi', nome: 'Primi Piatti', tag: 'pasta|main course', colore: '#E67E22', testoColore: '#ffffff' },
  { id: 'secondi', nome: 'Secondi', tag: 'meat|seafood', colore: '#27AE60', testoColore: '#ffffff' },
  { id: 'dolci', nome: 'Dolci', tag: 'dessert', colore: '#F1C40F', testoColore: '#2D3436' }
]);

onMounted(async () => {
  await Promise.all([caricaRicette(), caricaPreferiti()]);
});

const caricaRicette = async (query = '') => {
  caricamentoInCorso.value = true;
  try {
    const params = new URLSearchParams({
      apiKey: apiKey,
      number: 20,
      instructionsRequired: true,
      addRecipeInformation: true,
      fillIngredients: true
    });

    if (query) {
      params.append('query', query);
    }

    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`);
    
    if (!response.ok) throw new Error(`Errore API: ${response.status}`);
    
    const data = await response.json();
    ricette.value = data.results.map(r => ({
      id: r.id,
      titolo: r.title,
      name: r.title,
      title: r.title,
      immagine: r.image,
      image: r.image,
      difficolta: r.difficulty || 'Media',
      difficulty: r.difficulty || 'Media',
      autore: r.author || 'Chef Sconosciuto',
      chef: r.author || 'Chef Sconosciuto',
      categoria: r.cuisines?.[0] || 'varia',
      category: r.cuisines?.[0] || 'varia',
      tempo: r.readyInMinutes || 30,
      ingredienti: r.extendedIngredients || [],
      istruzioni: r.instructions || 'Istruzioni non disponibili'
    }));
  } catch (errore) {
    console.error('Errore caricamento ricette:', errore);
    ricette.value = [];
  } finally {
    caricamentoInCorso.value = false;
  }
};

const ricetteFiltrate = computed(() => {
  if (categoriaAttiva.value === 'tutte') {
    return ricette.value;
  }
  
  const categoria = categorie.value.find(c => c.id === categoriaAttiva.value);
  if (!categoria?.tag) return ricette.value;
  
  const tags = categoria.tag.split('|');
  return ricette.value.filter(r => {
    const cat = (r.categoria || r.category || '').toLowerCase();
    return tags.some(tag => cat.includes(tag.toLowerCase()));
  });
});

const avviaRicerca = async () => {
  if (testoRicerca.value.trim()) {
    tabAttiva.value = 'risultati';
  } else {
    tabAttiva.value = 'ricerca';
  }
};

const router = useRouter();
const preferite = ref([]);
const preferitiIds = computed(() => new Set(preferite.value.map((item) => item.id?.toString())));

const caricaPreferiti = async () => {
  preferite.value = [];
  const user = utente || auth.currentUser;
  if (!user?.uid) return;

  try {
    const userDocRef = doc(db, 'utenti', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      preferite.value = data.favorites || [];
    }
  } catch (error) {
    console.error('Errore caricamento preferiti:', error);
  }
};

const salvaPreferiti = async () => {
  const user = utente || auth.currentUser;
  if (!user?.uid) return;

  try {
    const userDocRef = doc(db, 'utenti', user.uid);
    await setDoc(userDocRef, { favorites: preferite.value }, { merge: true });
  } catch (error) {
    console.error('Errore salvataggio preferiti:', error);
  }
};

const normalizeRecipe = (recipe) => ({
  id: recipe.id,
  title: recipe.title || recipe.titolo || recipe.name || 'Ricetta',
  image: recipe.image || recipe.immagine || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500',
  readyInMinutes: recipe.readyInMinutes || recipe.tempo || 0,
  servings: recipe.servings || 0,
  dishTypes: recipe.dishTypes || [],
  summary: recipe.summary || '',
  category: recipe.category || recipe.categoria || '',
  author: recipe.autore || recipe.chef || 'Anonimo'
});

const isPreferita = (ricetta) => preferitiIds.value.has(ricetta.id?.toString());

const togglePreferito = async (ricetta) => {
  if (!utente?.uid && !auth.currentUser) {
    alert('Devi accedere per salvare le ricette tra i preferiti.');
    return;
  }

  const normalized = normalizeRecipe(ricetta);
  const id = normalized.id?.toString();
  if (!id) return;

  if (isPreferita(normalized)) {
    preferite.value = preferite.value.filter((item) => item.id?.toString() !== id);
  } else {
    preferite.value = [...preferite.value, normalized];
  }

  await salvaPreferiti();
};

watch(() => utente?.uid, caricaPreferiti, { immediate: true });

const mostraDettagli = (ricetta) => {
  if (ricetta?.id) {
    router.push({ name: 'DettagliRicetta', params: { id: ricetta.id } });
  } else {
    ricettaSelezionata.value = ricetta;
    tabAttiva.value = 'dettagli';
  }
};
// --- MODIFICA RICERCA CON SUGGERIMENTI ---
const isFocused = ref(false);

// Esempio di dati per i suggerimenti (da collegare poi al tuo database/Firebase)
const ricetteSuggerite = ref([
  { id: 1, nome: 'Spaghetti alla Chitarra' },
  { id: 2, nome: 'Filetto alle Erbe' },
  { id: 3, nome: 'Pizza Margherita' },
  { id: 4, nome: 'Tiramisù della Casa' }
]);

// Filtra i suggerimenti in base a cosa scrive l'utente
const suggerimentiFiltrati = computed(() => {
  if (!testoRicerca.value) return [];
  return ricetteSuggerite.value.filter(ricetta =>
    ricetta.nome.toLowerCase().includes(testoRicerca.value.toLowerCase())
  );
});

// Funzione quando si clicca direttamente su un suggerimento della tendina
const selezionaSuggerimento = (nomeRicetta) => {
  testoRicerca.value = nomeRicetta;
  isFocused.value = false;
  avviaRicerca(); // Cambia la tab in 'risultati'
};
// ------------------------------------------
</script>