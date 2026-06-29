<template>
  <div class="container py-4">
    <transition name="fade-scale" mode="out-in">
      <div class="card shadow-sm rounded-4 overflow-hidden">
        <div class="ratio ratio-16x6">
        <img :src="ricettaData.immagine || ricettaData.image || defaultImage" class="object-fit-cover" :alt="ricettaData.titolo || ricettaData.title" />
      </div>
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 class="m-0" style="font-weight: 800; color: #2D3436;">{{ ricettaData.titolo || ricettaData.title }}</h2>
            <div class="text-muted small">Chef: {{ ricettaData.autore || ricettaData.chef || 'Anonimo' }}</div>
          </div>
          <div class="text-end">
            <button class="btn btn-outline-secondary btn-sm" @click="$router.back()">← Torna</button>
          </div>
        </div>

        <div class="d-flex flex-wrap gap-3 mb-4">
          <div class="badge rounded-pill bg-light text-dark p-2">⏱ {{ ricettaData.tempo || ricettaData.readyInMinutes || '—' }} min</div>
          <div class="badge rounded-pill bg-light text-dark p-2">🍽 Porzioni: {{ ricettaData.servings || '—' }}</div>
          <div class="badge rounded-pill bg-light text-dark p-2">⚑ {{ ricettaData.difficolta || ricettaData.difficulty || 'Media' }}</div>
          <div v-if="ricettaData.categoria" class="badge rounded-pill bg-light text-dark p-2">📂 {{ ricettaData.categoria }}</div>
        </div>

        <div class="row">
          <div class="col-md-5 mb-4 mb-md-0">
            <div class="p-3 bg-white rounded-3 border">
              <h5 class="fw-bold">Ingredienti</h5>
              <ul class="list-unstyled mt-3">
                <li v-for="ing in ricettaData.ingredienti" :key="ing.id || ing.name" class="mb-2">
                  • <strong>{{ ing.measures?.us?.amount ? ing.measures.us.amount + ' ' + (ing.measures.us.unitShort || '') : (ing.amount || '') }}</strong>
                  <span class="ms-2">{{ ing.name || ing.original }}</span>
                </li>
                <li v-if="ricettaData.ingredienti.length === 0" class="text-muted">Nessun ingrediente disponibile.</li>
              </ul>
            </div>
          </div>

          <div class="col-md-7">
            <div class="p-3 bg-white rounded-3 border">
              <h5 class="fw-bold">Preparazione</h5>
              <div class="mt-3 text-muted" v-if="!ricettaData.istruzioni">Istruzioni non disponibili.</div>
              <div v-else v-html="ricettaData.istruzioni"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({ ricetta: { type: Object, default: null }, id: { type: [String, Number], default: null } });
const route = useRoute();
const ricettaData = ref(props.ricetta || {});
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

onMounted(async () => {
  const id = props.id || route.params.id;
  if (id && (!props.ricetta || Object.keys(props.ricetta).length === 0)) {
    await caricaDettagli(id);
  } else if (props.ricetta) {
    ricettaData.value = props.ricetta;
  }
});
</script>

<style scoped>
.ratio img.object-fit-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
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