<template>
  <div class="container py-5">
    <transition name="fade-scale" mode="out-in">
      <div class="card border-0 shadow-lg rounded-5 overflow-hidden main-recipe-card">
        
        <!-- Immagine di Copertina con Overlay Sfumato Premium -->
        <div class="ratio ratio-21x9 position-relative header-image-zone">
          <img :src="ricettaData.immagine || ricettaData.image || defaultImage" class="object-fit-cover w-100 h-100" :alt="ricettaData.titolo || ricettaData.title" />
          <div class="image-gradient-overlay"></div>
          
          <!-- Badge Categoria Fluttuante sull'Immagine -->
          <div v-if="ricettaData.categoria" class="position-absolute bottom-0 start-0 m-4 z-2">
            <span class="badge category-floating-badge text-uppercase tracking-wider px-3 py-2 rounded-pill">
              🍳 {{ ricettaData.categoria }}
            </span>
          </div>
        </div>

        <div class="card-body p-4 p-md-5">
          <!-- Intestazione Ricetta -->
          <div class="d-flex justify-content-between align-items-center gap-3 mb-4 pb-4 border-bottom border-light-subtle">
            <div>
              <h1 class="recipe-title m-0 text-antracite">{{ ricettaData.titolo || ricettaData.title }}</h1>
            </div>
            <div>
              <!-- Pulsante Indietro Circolare Premium -->
              <button 
                class="btn btn-back rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm" 
                @click="$router.back()"
                title="Torna indietro"
              >
                ←
              </button>
            </div>
          </div>

          <!-- Griglia Info Rapide con Card Minimali -->
          <div class="row g-3 mb-5 justify-content-center">
            <div class="col-6 col-md-4">
              <div class="info-metric-card p-3 rounded-4 text-center">
                <span class="metric-icon">⏱</span>
                <div class="metric-value mt-1">{{ ricettaData.tempo || ricettaData.readyInMinutes || '—' }} min</div>
                <div class="metric-label">Preparazione</div>
              </div>
            </div>
            <div class="col-6 col-md-4">
              <div class="info-metric-card p-3 rounded-4 text-center">
                <span class="metric-icon">🍽</span>
                <div class="metric-value mt-1">1 Porzione</div>
                <div class="metric-label">Dosi di Base</div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="info-metric-card p-3 rounded-4 text-center">
                <span class="metric-icon">🔥</span>
                <div class="metric-value mt-1">{{ ricettaData.difficolta || ricettaData.difficulty || 'Media' }}</div>
                <div class="metric-label">Difficoltà</div>
              </div>
            </div>
          </div>

          <!-- Corpo Principale Separato (Ingredienti vs Preparazione) -->
          <div class="row g-5">
            <!-- Sezione Ingredienti Alternativa (Grid di Card Interattive) -->
            <div class="col-lg-5">
              <div class="p-4 bg-ingredients rounded-5 h-100 border border-white shadow-sm">
                <h3 class="section-title mb-4">Ingredienti</h3>
                
                <div class="ingredients-grid d-flex flex-column gap-2">
                  <div 
                    v-for="ing in ricettaData.ingredienti || []" 
                    :key="ing.id || ing.name" 
                    class="ingredient-premium-row d-flex align-items-center justify-content-between p-3 rounded-4 bg-white shadow-sm border border-light"
                  >
                    <div class="d-flex align-items-center gap-3">
                      <div class="ingredient-dot"></div>
                      <span class="text-secondary-dark fw-semibold text-capitalize fs-6">{{ ing.name || ing.original }}</span>
                    </div>
                    <div class="ingredient-badge px-3 py-1.5 rounded-pill text-orange fw-extrabold shadow-sm">
                      {{ ing.measures?.us?.amount ? ing.measures.us.amount + ' ' + (ing.measures.us.unitShort || '') : (ing.amount || '') }}
                    </div>
                  </div>
                  
                  <div v-if="!(ricettaData.ingredienti || []).length" class="text-muted text-center py-4">
                    Nessun ingrediente inserito.
                  </div>
                </div>
              </div>
            </div>

            <!-- Sezione Preparazione -->
            <div class="col-lg-7">
              <div class="p-4 rounded-5 h-100">
                <h3 class="section-title mb-4">Preparazione</h3>
                
                <div class="mt-3 text-muted fs-6 line-height-relaxed instructions-wrapper" v-if="!ricettaData.istruzioni">
                  Le istruzioni dettagliate non sono disponibili per questa ricetta.
                </div>
                <div v-else v-html="ricettaData.istruzioni" class="instructions-content fs-5 text-secondary-dark"></div>
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
      servings: 1, // Impostato forzatamente a 1 come richiesto
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
/* Branding Colori & Tipografia */
.text-antracite { color: #1C1C1C; }
.text-orange { color: #FF5E14; }
.text-secondary-dark { color: #3A3A3A; }
.bg-ingredients { background-color: #FBF9F4; }
.fw-extrabold { font-weight: 800; }

.main-recipe-card {
  background-color: #FFFFFF;
}

.recipe-title {
  font-weight: 900;
  letter-spacing: -1px;
  font-size: 2.5rem;
}

/* Copertina sfumata */
.header-image-zone {
  max-height: 400px;
}
.image-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%);
}

.category-floating-badge {
  background-color: #FF5E14;
  color: #FFFFFF;
  font-weight: 700;
  font-size: 0.8rem;
  box-shadow: 0 4px 12px rgba(255, 94, 20, 0.3);
}

/* Pulsante Indietro Circolare Premium */
.btn-back {
  width: 46px;
  height: 46px;
  font-size: 22px;
  font-weight: 700;
  color: #1C1C1C;
  background-color: #F1EFF4;
  border: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-back:hover {
  background-color: #1C1C1C;
  color: #FFFFFF;
  transform: translateX(-4px);
}

/* Card Metriche Cucina */
.info-metric-card {
  background-color: #FAF8F5;
  border: 1px solid rgba(0,0,0,0.03);
  transition: transform 0.2s ease;
}
.info-metric-card:hover {
  transform: translateY(-2px);
}
.metric-icon {
  font-size: 1.5rem;
}
.metric-value {
  font-weight: 800;
  color: #1C1C1C;
  font-size: 1.05rem;
}
.metric-label {
  font-size: 0.75rem;
  color: #8A8A8A;
  text-uppercase: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Titoli delle sezioni con indicatore sotto */
.section-title {
  font-weight: 800;
  color: #1C1C1C;
  font-size: 1.5rem;
  position: relative;
  padding-bottom: 10px;
}
.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 4px;
  background-color: #FF5E14;
  border-radius: 10px;
}

/* UI Nuova per le righe degli Ingredienti */
.ingredient-premium-row {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.ingredient-premium-row:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(0,0,0,0.04) !important;
}
.ingredient-dot {
  width: 6px;
  height: 6px;
  background-color: #FF5E14;
  border-radius: 50%;
}
.ingredient-badge {
  background-color: rgba(255, 94, 20, 0.06);
  font-size: 0.85rem;
}

/* Render Istruzioni */
.instructions-content {
  line-height: 1.8;
  font-weight: 400;
  color: #2D3436;
}
.instructions-content :deep(ol), 
.instructions-content :deep(ul) {
  padding-left: 1.25rem;
  margin-top: 1rem;
}
.instructions-content :deep(li) {
  margin-bottom: 1rem;
}
.instructions-content :deep(p) {
  margin-bottom: 1.25rem;
}

/* Transition: fade + slight scale */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: opacity 280ms ease, transform 280ms ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(6px);
}
</style>