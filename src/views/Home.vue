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
            placeholder="Cerca ricette, ingredienti ..." 
            class="form-control rounded-pill border-0 px-5 py-2"
            style="background-color: #F1EFF4; color: #2D3436;"
            @focus="isFocused = true"
            @blur="() => window.setTimeout(() => isFocused = false, 200)"
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

    <!-- Commento: Container responsivo con padding dinamico per mobile-first -->
    <div class="pt-5 mt-4">
      <main class="container-fluid py-3 py-md-4 px-2 px-sm-3 px-md-4">
        
        <div v-if="tabAttiva === 'ricerca'">
          <div class="mb-4 text-start">
            <h1 class="display-6 mb-2 text-dark fw-bolder" style="color: #2D3436;">Di cosa hai voglia?</h1>
            <p class="text-secondary fs-6">Scegli la tua ricetta preferita per dare inizio alla creatività</p>
          </div>

          <!-- Commento: Box evidenza ricetta con layout responsive e gap dinamico -->
          <div 
            v-if="!caricamentoInCorso && ricettaInEvidenza"
            class="card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-4 mb-md-5 text-white text-start overflow-hidden" 
            style="background-color: #27AE60; cursor: pointer;"
            @click="mostraDettagli(ricettaInEvidenza)"
          >
            <!-- Commento: Row con gap responsivo per spacing dinamico -->
            <div class="row align-items-center g-3 g-md-4">
              <!-- Commento: Immagine responsive col-12 su mobile, col-md-5 su tablet -->
              <div class="col-12 col-md-5 col-lg-4 d-flex align-items-center">
                <div class="ratio ratio-4x3 rounded-3 overflow-hidden shadow-sm w-100">
                  <img 
                    :src="ricettaInEvidenza.immagine || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500'" 
                    class="object-fit-cover w-100 h-100" 
                    :alt="ricettaInEvidenza.titolo"
                  />
                </div>
              </div>
              <!-- Spazio Testi -->
              <div class="col-12 col-md-7 col-lg-8 d-flex flex-column justify-content-center">
                <div>
                  <!-- Scritta Gialla con alone/badge trasparente attorno -->
                  <span class="badge rounded-pill mb-2 px-3 py-2 fw-bold bg-white bg-opacity-10" style="color: #F1C40F; letter-spacing: 0.5px;">
                    RICETTA IN EVIDENZA
                  </span>
                  <h2 class="fw-bold mb-2 display-6">
                    {{ ricettaInEvidenza.titolo }}
                  </h2>
                  <!-- Descrizione mantenuta pulita (senza incitazioni) -->
                  <p class="fs-5 opacity-90 mb-0">
                    {{ ricettaInEvidenza.sommarioBreve }} 
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="caricamentoInCorso" class="text-center py-5">
            <div class="spinner-border" style="color: #2D3436;" role="status">
              <span class="visually-hidden">Caricamento in corso...</span>
            </div>
          </div>

          <!-- RIPRISTINATE TUTTE LE ALTRE RICETTE IN BASSO -->
          <div v-else class="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            <div 
              class="col" 
              v-for="ricetta in altreRicette" 
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
                    class="btn btn-light btn-sm rounded-circle border shadow-sm position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center p-0 heart-btn"
                    @click.stop="togglePreferito(ricetta)"
                    :title="isPreferita(ricetta) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="heart-icon"
                      :class="isPreferita(ricetta) ? 'heart-filled' : 'heart-outline'"
                    >
                      <path
                        d="M12 20s-7-4.8-9.2-8.9C1 8.4 1.9 5.2 4.8 4.1c2.3-.8 4.5.2 6 2.1 1.5-1.9 3.7-2.9 6-2.1 2.9 1.1 3.8 4.3 2 7C19 15.2 12 20 12 20Z"
                        :fill="isPreferita(ricetta) ? '#ff4d67' : 'none'"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
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
                      {{ ricetta.difficolta || 'Media' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!caricamentoInCorso && ricette.length === 0" class="text-center text-muted py-5">
            Nessun elemento trovato.
          </div>
        </div>

        <Risultati 
  v-else-if="tabAttiva === 'risultati'" 
  :ricercaQuery="testoRicerca" 
  :categoriaQuery="categoriaAttiva" 
  @seleziona-ricetta="(ricetta) => mostraDettagli(ricetta)"
/>
        <AreaPersonale v-else-if="tabAttiva === 'profilo'" :utente="utente" @logout="$emit('logout')" />
      </main>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import AreaPersonale from './AreaPersonale.vue';
import Risultati from './Risultati.vue';
import { useRoute, useRouter } from 'vue-router';
import { auth, db } from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const props = defineProps(['utente']);
defineEmits(['logout']);

const tabAttiva = ref('ricerca');
const testoRicerca = ref('');
const categoriaAttiva = ref('tutte');
const ricette = ref([]);
const caricamentoInCorso = ref(true);
const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
const route = useRoute();
const router = useRouter();

const preferite = ref([]);
const preferitiIds = computed(() => new Set(preferite.value.map((item) => item.id?.toString())));

const applicaTabDaRoute = () => {
  const tab = route.query.tab;
  if (tab === 'risultati') {
    tabAttiva.value = 'risultati';
    if (route.query.search) {
      testoRicerca.value = String(route.query.search);
    }
    if (route.query.categoria) {
      categoriaAttiva.value = String(route.query.categoria);
    }
  } else if (tab === 'ricerca') {
    tabAttiva.value = 'ricerca';
  } else if (tab === 'profilo') {
    tabAttiva.value = 'profilo';
  }
};

const caricaRicette = async (query = '') => {
  caricamentoInCorso.value = true;
  try {
    const params = new URLSearchParams({
      apiKey,
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
    ricette.value = (data.results || []).map((r) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = r.summary || '';
      const summaryTesto = tempDiv.textContent || tempDiv.innerText || '';
      const sommarioBreve = summaryTesto.length > 140 ? `${summaryTesto.substring(0, 140)}...` : summaryTesto;

      return {
        id: r.id,
        titolo: r.title,
        name: r.title,
        title: r.title,
        immagine: r.image,
        image: r.image,
        difficolta: r.readyInMinutes ? `${r.readyInMinutes} min` : 'Media',
        autore: r.sourceName || 'Chef Sconosciuto',
        chef: r.sourceName || 'Chef Sconosciuto',
        sommarioBreve,
        categoria: r.cuisines?.[0] || 'varia',
        tempo: r.readyInMinutes || 30,
        ingredienti: r.extendedIngredients || [],
        istruzioni: r.instructions || 'Istruzioni non disponibili'
      };
    });
  } catch (errore) {
    console.error('Errore caricamento ricette:', errore);
    ricette.value = [];
  } finally {
    caricamentoInCorso.value = false;
  }
};

const ricettaInEvidenza = computed(() => (ricette.value.length > 0 ? ricette.value[0] : null));
const altreRicette = computed(() => ricette.value.slice(1));

const avviaRicerca = () => {
  tabAttiva.value = testoRicerca.value.trim() ? 'risultati' : 'ricerca';
};

const caricaPreferiti = async () => {
  preferite.value = [];
  const user = props.utente || auth.currentUser;
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
  const user = props.utente || auth.currentUser;
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
  if (!props.utente?.uid && !auth.currentUser) {
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

watch(() => props.utente?.uid, () => {
  caricaPreferiti();
}, { immediate: true });

watch(() => route.query.tab, () => {
  applicaTabDaRoute();
});

onMounted(async () => {
  await caricaRicette();
  applicaTabDaRoute();
});

const mostraDettagli = (ricetta) => {
  if (ricetta?.id) {
    const query = tabAttiva.value === 'risultati'
      ? { from: 'risultati', search: testoRicerca.value, categoria: categoriaAttiva.value }
      : { from: 'home' };

    router.push({ name: 'DettagliRicetta', params: { id: ricetta.id }, query });
  }
};

const isFocused = ref(false);
const ricetteSuggerite = ref([
  { id: 1, nome: 'Spaghetti alla Chitarra' },
  { id: 2, nome: 'Filetto alle Erbe' },
  { id: 3, nome: 'Pizza Margherita' },
  { id: 4, nome: 'Tiramisù della Casa' }
]);

const suggerimentiFiltrati = computed(() => {
  if (!testoRicerca.value) return [];
  return ricetteSuggerite.value.filter((ricetta) =>
    ricetta.nome.toLowerCase().includes(testoRicerca.value.toLowerCase())
  );
});

const selezionaSuggerimento = (nomeRicetta) => {
  testoRicerca.value = nomeRicetta;
  isFocused.value = false;
  avviaRicerca();
};
</script>

<style scoped>
.heart-btn {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  color: #6c757d;
}

.heart-btn:hover {
  color: #ff4d67;
  transform: scale(1.05);
}

.heart-icon {
  width: 14px;
  height: 14px;
}

.heart-outline {
  color: #6c757d;
}

.heart-filled {
  color: #ff4d67;
}
</style>