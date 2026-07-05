<template>
  
  <div class="animate-fade-in px-2 px-sm-3 px-md-4">
    
    <div class="mb-3 mb-md-4 text-start">
      <h2 class="fw-extrabold text-antracite display-6 mb-2">
        Risultati per: <span class="text-orange">"{{ ricercaQuery || 'Tutte' }}"</span>
      </h2>
      <p class="text-secondary fs-6">Abbiamo trovato queste ispirazioni culinarie per te</p>
    </div>

    <div v-if="caricamento" class="text-center py-5">
      <div class="spinner-border text-orange" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
    </div>

    
    <div v-else class="row g-3 g-md-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
      <div v-for="ricetta in ricetteRisultati" :key="ricetta.id" class="col">
        
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100 recipe-card" @click="apriDettagli(ricetta)">
          
          <div class="ratio ratio-4x3 position-relative bg-light">
            <img
              :src="ricetta.immagine || ricetta.image || defaultImage"
              class="w-100 h-100 object-fit-cover"
              :alt="ricetta.titolo || ricetta.title"
            />

            <button
              type="button"
              class="btn btn-light btn-sm rounded-circle border shadow-sm position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center p-0 heart-btn"
              @click.stop="togglePreferito(ricetta)"
              :title="isPreferita(ricetta) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'"
              :aria-label="isPreferita(ricetta) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'"
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

          
          <div class="card-body bg-white p-2 p-md-3">
            <h5 class="card-title text-antracite fw-bold m-0 text-truncate">
              {{ ricetta.titolo || ricetta.title }}
            </h5>
            <small class="text-muted">
              {{ ricetta.categoria || 'Ricetta' }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!caricamento && ricetteRisultati.length === 0" class="text-center py-5">
      <p class="text-muted fs-5">Nessuna ricetta corrisponde alla tua ricerca.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const props = defineProps({
  ricercaQuery: { type: String, default: '' },
  categoriaQuery: { type: String, default: 'tutte' },
  isPreferita: { type: Function, required: true },
  togglePreferito: { type: Function, required: true }
});

const emit = defineEmits(['seleziona-ricetta']);

const ricetteRisultati = ref([]);
const caricamento = ref(false);
const defaultImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200';
const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;

const cercaSuSpoonacular = async (query = '') => {
  caricamento.value = true;
  try {
    const resp = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=12&apiKey=${apiKey}`);

    if (!resp.ok) throw new Error('Limite punti API raggiunto o errore di rete');

    const data = await resp.json();
    ricetteRisultati.value = (data.results || []).map((r) => ({
      id: r.id,
      titolo: r.title,
      title: r.title,
      immagine: r.image,
      image: r.image,
      categoria: props.categoriaQuery !== 'tutte' ? props.categoriaQuery : 'Spoonacular'
    }));
  } catch (error) {
    console.warn('⚠️ API Spoonacular in errore. Uso il database Firebase di backup:', error);
    await cercaSuFirebaseBackup(query);
  } finally {
    caricamento.value = false;
  }
};

const cercaSuFirebaseBackup = async (query = '') => {
  try {
    const querySnapshot = await getDocs(collection(db, 'ricette'));
    const temporaneo = [];
    querySnapshot.forEach((doc) => {
      const dati = doc.data();
      const titolo = (dati.titolo || dati.title || '').toLowerCase();
      if (titolo.includes(query.toLowerCase())) {
        temporaneo.push({ id: doc.id, ...dati });
      }
    });
    ricetteRisultati.value = temporaneo;
  } catch (err) {
    console.error('Errore anche nel database di backup:', err);
  }
};

onMounted(() => {
  cercaSuSpoonacular(props.ricercaQuery);
});

watch(() => props.ricercaQuery, (nuovaQuery) => {
  cercaSuSpoonacular(nuovaQuery);
});

const apriDettagli = (ricetta) => {
  emit('seleziona-ricetta', ricetta);
};
</script>

<style scoped>
.text-antracite { color: #2D3436; }
.text-orange { color: #FF5E14; }
.fw-extrabold { font-weight: 800; }

.recipe-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}
.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}

.heart-btn {
  width: 38px;
  height: 38px;
}

.heart-icon {
  width: 18px;
  height: 18px;
  color: #2D3436;
}

.heart-filled {
  color: #ff4d67;
}

.heart-outline {
  color: #2D3436;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>