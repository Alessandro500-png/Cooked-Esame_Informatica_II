<template>
  <div class="page-box">
    <div class="d-flex flex-column gap-3">
      <div>
        <h2>Risultati della Ricerca 📊</h2>
        <p class="text-secondary mb-2">{{ queryMessage }}</p>
      </div>

      <div v-if="loading" class="alert alert-primary">
        Caricamento in corso... cerco le ricette collegate all'API.
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else-if="ricette.length === 0" class="alert alert-warning">
        Nessuna ricetta trovata. Prova a cercare parole diverse o usa una categoria diversa.
      </div>

      <div v-else class="row g-4">
        <div class="col-12 col-md-6 col-lg-4" v-for="recipe in ricette" :key="recipe.id">
          <div class="card h-100 shadow-sm overflow-hidden">
            <div class="position-relative">
              <img
                :src="recipe.image"
                class="card-img-top recipe-image"
                :alt="recipe.title"
                loading="lazy"
              />
              <button
                type="button"
                class="btn btn-light btn-sm rounded-circle border shadow-sm position-absolute top-0 end-0 mt-n1 me-n1 d-flex align-items-center justify-content-center p-2"
                @click.stop="togglePreferito(recipe)"
                :title="isPreferita(recipe) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isPreferita(recipe) ? '#dc3545' : 'none'" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bi bi-heart">
                  <path d="M20.84 4.61c-1.54-1.54-4.04-1.54-5.58 0L12 7.88 8.74 4.61C7.2 3.07 4.7 3.07 3.16 4.61c-1.54 1.54-1.54 4.04 0 5.58L12 18.11l8.84-8.84c1.54-1.54 1.54-4.04 0-5.58Z" />
                </svg>
              </button>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ recipe.title }}</h5>
              <p class="card-text text-secondary mb-3" v-if="recipe.summary">
                {{ stripHtml(recipe.summary).slice(0, 140) }}{{ stripHtml(recipe.summary).length > 140 ? '...' : '' }}
              </p>
              <div class="mt-auto d-flex flex-wrap gap-2">
                <span v-if="recipe.dishTypes?.length" class="badge bg-secondary text-white">
                  {{ recipe.dishTypes[0] }}
                </span>
                <span class="badge bg-success text-white">
                  {{ recipe.readyInMinutes }} min
                </span>
                <span class="badge bg-warning text-dark">
                  {{ recipe.servings }} porzioni
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import axios from 'axios';
import { auth, db } from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const props = defineProps({
  ricercaQuery: { type: String, default: '' },
  categoriaQuery: { type: String, default: 'tutte' }
});

const ricette = ref([]);
const loading = ref(false);
const error = ref('');
const preferite = ref([]);

const apiKey = import.meta.env.VITE_SPOONACULAR_KEY || '';

const translationUsed = ref(false);
const translatedQuery = ref('');
const preferitiIds = computed(() => new Set(preferite.value.map((item) => item.id?.toString())));

const caricaPreferiti = async () => {
  preferite.value = [];
  const user = auth.currentUser;
  if (!user?.uid) return;

  try {
    const userDocRef = doc(db, 'utenti', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      preferite.value = userDocSnap.data().favorites || [];
    }
  } catch (error) {
    console.error('Errore caricamento preferiti:', error);
  }
};

const salvaPreferiti = async () => {
  const user = auth.currentUser;
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
  const user = auth.currentUser;
  if (!user?.uid) {
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

onMounted(caricaPreferiti);

const queryMessage = computed(() => {
  if (props.ricercaQuery) {
    if (translationUsed.value && translatedQuery.value && translatedQuery.value !== props.ricercaQuery) {
      return `Risultati per "${props.ricercaQuery}" (ricerca anche come "${translatedQuery.value}")`;
    }
    return `Risultati per "${props.ricercaQuery}"`;
  }
  if (props.categoriaQuery === 'dolci') {
    return 'Risultati per categoria: dolci';
  }
  if (props.categoriaQuery === 'primi') {
    return 'Risultati per categoria: primi piatti';
  }
  if (props.categoriaQuery === 'secondi') {
    return 'Risultati per categoria: secondi piatti';
  }
  return 'Ricette popolari in evidenza';
});

const buildParams = (searchQuery = '') => {
  const baseParams = {
    apiKey,
    number: 12,
    addRecipeInformation: true
  };

  if (searchQuery) {
    return {
      ...baseParams,
      query: searchQuery,
      instructionsRequired: true
    };
  }

  if (props.categoriaQuery === 'dolci') {
    return {
      ...baseParams,
      type: 'dessert'
    };
  }

  if (props.categoriaQuery === 'primi') {
    return {
      ...baseParams,
      query: 'pasta'
    };
  }

  if (props.categoriaQuery === 'secondi') {
    return {
      ...baseParams,
      query: 'meat'
    };
  }

  return {
    ...baseParams,
    sort: 'popularity'
  };
};

const translateQuery = (query) => {
  const map = {
    risotto: 'risotto',
    pasta: 'pasta',
    lasagne: 'lasagna',
    pollo: 'chicken',
    tiramisu: 'tiramisu',
    spaghetti: 'spaghetti',
    carne: 'meat',
    pesce: 'fish',
    verdure: 'vegetables',
    insalata: 'salad',
    formaggio: 'cheese',
    forno: 'oven',
    pizza: 'pizza',
    zuppa: 'soup',
    dolce: 'dessert',
    cioccolato: 'chocolate'
  };

  const normalized = query.trim().toLowerCase();
  return map[normalized] || normalized;
};

const buildSearchVariants = (query) => {
  const normalized = query.trim().toLowerCase();
  const translated = translateQuery(normalized);
  const words = normalized.split(/\s+/).filter(Boolean);
  const translatedWords = words.map((word) => translateQuery(word));
  const variants = [normalized];

  if (translated && translated !== normalized) {
    variants.push(translated);
  }

  const translatedPhrase = translatedWords.join(' ');
  if (translatedPhrase && translatedPhrase !== normalized && translatedPhrase !== translated) {
    variants.push(translatedPhrase);
  }

  if (words.length > 1) {
    variants.push(...words);
    variants.push(...translatedWords);
  }

  return [...new Set(variants)];
};

const trySearchQueries = async (searchQueries) => {
  for (const q of searchQueries) {
    if (!q) continue;
    const params = buildParams(q);
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', { params });
    if (response?.data?.results?.length) {
      return { results: response.data.results, usedQuery: q };
    }
  }
  return { results: [], usedQuery: searchQueries[searchQueries.length - 1] || '' };
};

const fetchRicette = async () => {
  loading.value = true;
  error.value = '';
  ricette.value = [];
  translationUsed.value = false;
  translatedQuery.value = '';

  if (!apiKey) {
    error.value = 'Chiave API mancante. Verifica il file .env e riavvia l’app.';
    loading.value = false;
    return;
  }

  const searchQuery = props.ricercaQuery?.trim() || '';

  if (!searchQuery) {
    try {
      const params = buildParams();
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', { params });
      ricette.value = response.data?.results || [];
      return;
    } catch (err) {
      const backendMessage = err?.response?.data?.message || err.message || 'Errore imprevisto';
      error.value = `API Spoonacular: ${backendMessage}`;
      return;
    } finally {
      loading.value = false;
    }
  }

  try {
    const variants = buildSearchVariants(searchQuery);
    const { results, usedQuery } = await trySearchQueries(variants);
    ricette.value = results;

    if (usedQuery !== searchQuery) {
      translationUsed.value = true;
      translatedQuery.value = usedQuery;
    }
  } catch (err) {
    const backendMessage = err?.response?.data?.message || err.message || 'Errore imprevisto';
    error.value = `API Spoonacular: ${backendMessage}`;
  } finally {
    loading.value = false;
  }
};

watch(
  () => [props.ricercaQuery, props.categoriaQuery],
  fetchRicette,
  { immediate: true }
);

onMounted(() => {
  caricaPreferiti();
  onAuthStateChanged(auth, () => {
    caricaPreferiti();
  });
});

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '');
</script>

<style scoped>
.page-box {
  padding-top: 1rem;
}
.recipe-image {
  height: 220px;
  object-fit: cover;
}
</style>