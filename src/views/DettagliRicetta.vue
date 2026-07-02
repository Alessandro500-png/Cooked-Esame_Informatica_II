<template>
  <div class="container py-5">
    <transition name="fade-scale" mode="out-in">
      <div class="card border-0 shadow rounded-4 overflow-hidden main-recipe-card">
        
        <!-- Immagine di Copertina con Ratio e overlay morbido opzionale -->
        <div class="ratio ratio-16x6 position-relative header-image-zone">
          <img :src="ricettaData.immagine || ricettaData.image || defaultImage" class="object-fit-cover" :alt="ricettaData.titolo || ricettaData.title" />
          <div class="image-gradient-overlay"></div>
        </div>

        <div class="card-body p-4 p-md-5">
          <!-- Intestazione Ricetta -->
          <div class="d-flex justify-content-between align-items-start gap-3 mb-4">
            <div>
              <h1 class="recipe-title m-0 text-antracite">{{ ricettaData.titolo || ricettaData.title }}</h1>
              <div class="text-muted mt-1 fs-6">
                Sfornato da: <span class="fw-bold text-dark">{{ ricettaData.autore || ricettaData.chef || 'Anonimo' }}</span>
              </div>
            </div>
            <div>
              <!-- Pulsante Indietro Premium Coerente con la Navigazione -->
              <button 
                class="btn btn-back rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm" 
                @click="$router.back()"
                title="Torna indietro"
              >
                ←
              </button>
            </div>
          </div>

          <!-- Pillole Informative -->
          <div class="d-flex flex-wrap gap-2 mb-5">
            <div class="info-pill d-flex align-items-center gap-2">
              <span class="pill-icon">⏱</span> {{ ricettaData.tempo || ricettaData.readyInMinutes || '—' }} min
            </div>
            <div class="info-pill d-flex align-items-center gap-2">
              <span class="pill-icon">🍽</span> Porzioni: {{ ricettaData.servings || '—' }}
            </div>
            <div class="info-pill d-flex align-items-center gap-2">
              <span class="pill-icon">⚑</span> {{ ricettaData.difficolta || ricettaData.difficulty || 'Media' }}
            </div>
            <div v-if="ricettaData.categoria" class="info-pill d-flex align-items-center gap-2 active-pill">
              <span class="pill-icon">📂</span> {{ ricettaData.categoria }}
            </div>
          </div>

          <!-- Corpo Principale: Ingredienti e Preparazione -->
          <div class="row g-4">
            <!-- Colonna Ingredienti -->
            <div class="col-md-5">
              <div class="p-4 bg-light-section rounded-4 shadow-sm h-100 border border-light">
                <h4 class="section-title mb-4">Ingredienti</h4>
                <ul class="list-unstyled ingredients-list m-0">
                  <li v-for="ing in ricettaData.ingredienti || []" :key="ing.id || ing.name" class="d-flex align-items-start mb-3">
                    <span class="ingredient-bullet me-3">•</span>
                    <div>
                      <strong class="text-dark fw-bold">
                        {{ ing.measures?.us?.amount ? ing.measures.us.amount + ' ' + (ing.measures.us.unitShort || '') : (ing.amount || '') }}
                      </strong>
                      <span class="ms-2 text-secondary-dark">{{ ing.name || ing.original }}</span>
                    </div>
                  </li>
                  <li v-if="!(ricettaData.ingredienti || []).length" class="text-muted py-3">
                    Nessun ingrediente disponibile.
                  </li>
                </ul>
              </div>
            </div>

            <!-- Colonna Preparazione -->
            <div class="col-md-7">
              <div class="p-4 bg-white rounded-4 shadow-sm h-100 border border-light">
                <h4 class="section-title mb-4">Preparazione</h4>
                <div class="mt-3 text-muted fs-6 line-height-relaxed instructions-render" v-if="!ricettaData.istruzioni">
                  Istruzioni non disponibili.
                </div>
                <div v-else v-html="ricettaData.istruzioni" class="instructions-render fs-6 text-secondary-dark"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({ ricetta: { type: Object, default: null }, id: { type: [String, Number], default: null } });
const route = useRoute();
const ricettaData = ref({
  ingredienti: [],
  istruzioni: '',
  categoria: '',
  ...props.ricetta
});
const defaultImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200';
const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;

const caricaDettagli = async (id) => {
  try {
    const resp = await fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${apiKey}`);
    if (!resp.ok) throw new Error('Errore fetch dettagli');
    const data = await resp.json();
    ricettaData.value = {
      id: data.id,
      titolo: data.title,
      title: data.title,
      immagine: data.image,
      image: data.image,
      tempo: data.readyInMinutes,
      readyInMinutes: data.readyInMinutes,
      servings: data.servings,
      ingredienti: data.extendedIngredients || [],
      istruzioni: data.instructions || (data.analyzedInstructions?.[0]?.steps?.map(s=>s.step).join('<br/>')) || '',
      categorie: data.cuisines || [],
      categoria: data.cuisines?.[0] || ''
    };
  } catch (e) {
    console.error('Impossibile caricare dettagli:', e);
  }
};

const caricaDaRoute = async () => {
  const id = props.id || route.params.id;
  if (id && (!props.ricetta || Object.keys(props.ricetta).length === 0)) {
    await caricaDettagli(id);
  } else if (props.ricetta) {
    ricettaData.value = {
      ingredienti: [],
      istruzioni: '',
      categoria: '',
      ...props.ricetta
    };
  }
};

onMounted(() => {
  caricaDaRoute();
});

watch(() => route.params.id, (newId) => {
  if (newId) {
    caricaDettagli(newId);
  }
});
</script>

<style scoped>
/* Colori e Variabili Locali */
.text-antracite { color: #1C1C1C; }
.text-secondary-dark { color: #4A4A4A; }
.bg-light-section { background-color: #FAF9F5; }

/* Card Principale */
.main-recipe-card {
  background-color: #FFFFFF;
}

.recipe-title {
  font-weight: 800;
  letter-spacing: -0.5px;
  font-size: 2.25rem;
}

/* Gestione Immagine */
.ratio img.object-fit-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-image-zone {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Pulsante Premium Torna Indietro */
.btn-back {
  width: 44px;
  height: 44px;
  font-size: 20px;
  font-weight: 700;
  color: #1C1C1C;
  background-color: #F1EFF4;
  border: none;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background-color: #1C1C1C;
  color: #FFFFFF;
  transform: scale(1.05);
}

/* Stile Pillole / Info Badges */
.info-pill {
  background-color: #F1EFF4;
  color: #1C1C1C;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
}

.active-pill {
  background-color: #FF5E14;
  color: #FFFFFF;
}

.pill-icon {
  opacity: 0.9;
}

/* Titoli delle Sezioni Interni */
.section-title {
  font-weight: 700;
  color: #1C1C1C;
  position: relative;
  padding-bottom: 8px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 35px;
  height: 3px;
  background-color: #FF5E14;
  border-radius: 2px;
}

/* Lista Ingredienti Custom */
.ingredient-bullet {
  color: #FF5E14;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1;
}

/* Render Istruzioni (Gestione Spazi e Tag v-html) */
.instructions-render {
  line-height: 1.7;
}

.instructions-render :deep(p), 
.instructions-render :deep(ol), 
.instructions-render :deep(ul) {
  margin-bottom: 1rem;
}

/* Transition: fade + slight scale */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: opacity 280ms ease, transform 280ms ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(6px);
}
.fade-scale-enter-to, .fade-scale-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>