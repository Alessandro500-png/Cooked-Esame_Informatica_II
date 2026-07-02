<template>
  <div class="container py-5 position-relative">
    <transition name="fade-scale" mode="out-in">
      <!-- Card principale con angoli super arrotondati (rounded-5) e ombra grande -->
      <div class="card border-0 shadow-lg rounded-5 overflow-hidden bg-white">
        
        <!-- Immagine di Copertina con aspect-ratio nativo di Bootstrap (ratio-21x9) -->
        <div class="ratio ratio-21x9 position-relative header-image-zone">
          <img :src="ricettaData.immagine || ricettaData.image || defaultImage" class="w-100 h-100 object-fit-cover" :alt="ricettaData.titolo || ricettaData.title" />
          <div class="image-gradient-overlay"></div>

          <!-- Pulsante Indietro Circolare Premium - Alto a Sinistra con le utility di Bootstrap 5 -->
          <div class="position-absolute top-0 start-0 m-4 z-3">
            <button 
              class="btn btn-back rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm" 
              @click="tornaIndietro"
              title="Torna indietro"
            >
              ←
            </button>
          </div>

          <!-- Badge Categoria Fluttuante - Alto a Destra con le utility di Bootstrap 5 -->
          <div v-if="ricettaData.categoria" class="position-absolute top-0 end-0 m-4 z-2">
            <span class="badge category-floating-badge text-uppercase px-3 py-2 rounded-pill shadow-sm">
              🍳 {{ ricettaData.categoria }}
            </span>
          </div>
        </div>

        <div class="card-body p-4 p-md-5">
          <!-- Intestazione Ricetta -->
          <div class="mb-4 pb-4 border-bottom border-light-subtle">
            <h1 class="recipe-title m-0 text-antracite">{{ ricettaData.titolo || ricettaData.title }}</h1>
          </div>

          <!-- Griglia Info Rapide con Utility Grid e classi Border di Bootstrap 5 -->
          <div class="row g-3 mb-5 justify-content-center">
            <div class="col-6 col-md-4">
              <div class="p-3 rounded-4 text-center border border-light-subtle bg-body-tertiary info-metric-card">
                <span class="fs-3">⏱</span>
                <div class="fw-black text-dark fs-5 mt-1">{{ ricettaData.tempo || ricettaData.readyInMinutes || '—' }} min</div>
                <div class="small text-muted text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 0.5px;">Preparazione</div>
              </div>
            </div>
            <div class="col-6 col-md-4">
              <div class="p-3 rounded-4 text-center border border-light-subtle bg-body-tertiary info-metric-card">
                <span class="fs-3">🍽</span>
                <div class="fw-black text-dark fs-5 mt-1">1 Porzione</div>
                <div class="small text-muted text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 0.5px;">Dosi di Base</div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="p-3 rounded-4 text-center border border-light-subtle bg-body-tertiary info-metric-card">
                <span class="fs-3">🔥</span>
                <div class="fw-black text-dark fs-5 mt-1">{{ ricettaData.difficolta || ricettaData.difficulty || 'Media' }}</div>
                <div class="small text-muted text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 0.5px;">Difficoltà</div>
              </div>
            </div>
          </div>

          <!-- Corpo Principale Separato (Ingredienti vs Preparazione) -->
          <div class="row g-5">
            <!-- Sezione Ingredienti (Grid di Card Interattive) -->
            <div class="col-lg-5">
              <div class="p-4 bg-ingredients rounded-5 h-100 border border-white shadow-sm">
                <h3 class="section-title mb-4 pb-2">Ingredienti</h3>
                
                <div class="d-flex flex-column gap-2">
                  <div 
                    v-for="ing in ricettaData.ingredienti || []" 
                    :key="ing.id || ing.name" 
                    class="ingredient-premium-row d-flex align-items-center justify-content-between p-3 rounded-4 bg-white shadow-sm border border-light-subtle"
                  >
                    <div class="d-flex align-items-center gap-3">
                      <div class="bg-orange rounded-circle shadow-sm" style="width: 6px; height: 6px;"></div>
                      <span class="text-dark fw-semibold text-capitalize m-0" style="font-size: 0.95rem;">{{ ing.name || ing.original }}</span>
                    </div>
                    <div class="ingredient-badge px-3 py-1.5 rounded-pill text-orange fw-black shadow-sm small">
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
                <h3 class="section-title mb-4 pb-2">Preparazione</h3>
                
                <div class="mt-3 text-muted fs-6 line-height-relaxed" v-if="!ricettaData.istruzioni">
                  Le istruzioni dettagliate non sono disponibili per questa ricetta.
                </div>
                <div v-else v-html="ricettaData.istruzioni" class="instructions-content fs-5 text-dark"></div>
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
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({ ricetta: { type: Object, default: null }, id: { type: [String, Number], default: null } });
const route = useRoute();
const router = useRouter();
const ricettaData = ref({
  ingredienti: [],
  istruzioni: '',
  categoria: '',
  ...props.ricetta
});
const defaultImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200';
const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;

const tornaIndietro = () => {
  const provenienza = route.query.from;

  if (provenienza === 'preferiti') {
    router.push({ name: 'Home', query: { tab: 'profilo' } });
    return;
  }

  if (provenienza === 'risultati') {
    router.push({
      name: 'Home',
      query: {
        tab: 'risultati',
        search: route.query.search || '',
        categoria: route.query.categoria || 'tutte'
      }
    });
    return;
  }

  if (provenienza === 'home') {
    router.push({ name: 'Home', query: { tab: 'ricerca' } });
    return;
  }

  router.back();
};

const caricaDettagli = async (id) => {
  try {
    const resp = await fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${apiKey}`);
    
    if (!resp.ok) throw new Error('Limite API raggiunto o errore fetch dettagli');
    
    const data = await resp.json();
    ricettaData.value = {
      id: data.id,
      titolo: data.title,
      title: data.title,
      immagine: data.image,
      image: data.image,
      tempo: data.readyInMinutes,
      readyInMinutes: data.readyInMinutes,
      servings: 1, 
      ingredienti: data.extendedIngredients || [],
      istruzioni: data.instructions || (data.analyzedInstructions?.[0]?.steps?.map(s=>s.step).join('<br/>')) || '',
      categorie: data.cuisines || [],
      categoria: data.cuisines?.[0] || ''
    };
  } catch (e) {
    console.warn('⚠️ Spoonacular API offline o punti finiti. Carico la ricetta di backup per lo sviluppo:', e);
    
    ricettaData.value = {
      id: id,
      titolo: 'Spaghetti alla Carbonara (Mock)',
      title: 'Spaghetti alla Carbonara (Mock)',
      immagine: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1200',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1200',
      tempo: 25,
      readyInMinutes: 25,
      servings: 1,
      categoria: 'Italian',
      difficolta: 'Media',
      ingredienti: [
        { id: 1, name: 'Spaghetti', amount: 100, measures: { us: { amount: 100, unitShort: 'g' } } },
        { id: 2, name: 'Guanciale', amount: 50, measures: { us: { amount: 50, unitShort: 'g' } } },
        { id: 3, name: 'Tuorli d\'uovo', amount: 2, measures: { us: { amount: 2, unitShort: 'pz' } } },
        { id: 4, name: 'Pecorino Romano', amount: 30, measures: { us: { amount: 30, unitShort: 'g' } } },
        { id: 5, name: 'Pepe Nero', amount: 1, measures: { us: { amount: 1, unitShort: 'q.b.' } } }
      ],
      istruzioni: '<p>1. Taglia il guanciale a listarelle e rosolalo in padella fino a farlo diventare croccante.</p><p>2. Cuoci gli spaghetti in abbondante acqua salata.</p><p>3. In una ciotola, sbatti i tuorli con il pecorino romano e un pizzico di pepe nero.</p><p>4. Scola la pasta al dente direttamente nella padella con il guanciale, spegni il fuoco e unisci il composto di uova e pecorino per creare la crema.</p>'
    };
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
/* Colori custom basati sulla vostra palette */
.text-antracite { color: #1C1C1C; }
.text-orange { color: #FF5E14; }
.bg-orange { background-color: #FF5E14; }
.bg-ingredients { background-color: #FBF9F4; }
.fw-black { font-weight: 900; }

.recipe-title {
  font-weight: 900;
  letter-spacing: -1px;
  font-size: 2.5rem;
}

/* Zone di design specifiche non coperte dalle utility standard di Bootstrap 5 */
.header-image-zone {
  max-height: 400px;
}
.image-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%);
}

.category-floating-badge {
  background-color: #FF5E14;
  color: #FFFFFF;
  font-weight: 700;
  font-size: 0.8rem;
  box-shadow: 0 4px 12px rgba(255, 94, 20, 0.3);
}

/* Pulsante Indietro Circolare Premium Fluttuante */
.btn-back {
  width: 46px;
  height: 46px;
  font-size: 22px;
  font-weight: 700;
  color: #1C1C1C;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-back:hover {
  background-color: #1C1C1C;
  color: #FFFFFF;
  transform: scale(1.05);
}

/* Card Metriche Cucina (Animazione di hover leggera) */
.info-metric-card {
  transition: transform 0.2s ease;
}
.info-metric-card:hover {
  transform: translateY(-2px);
}

/* Titoli delle sezioni con indicatore di design sotto */
.section-title {
  font-weight: 800;
  color: #1C1C1C;
  font-size: 1.5rem;
  position: relative;
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

/* Effetto Hover Premium sulle righe degli ingredienti */
.ingredient-premium-row {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.ingredient-premium-row:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(0,0,0,0.04) !important;
}
.ingredient-badge {
  background-color: rgba(255, 94, 20, 0.06);
}

/* Line-height e spaziatura editoriale per il blocco istruzioni v-html */
.instructions-content {
  line-height: 1.8;
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

/* Transition Vue per il caricamento */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: opacity 280ms ease, transform 280ms ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(6px);
}
</style>