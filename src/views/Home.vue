<template>
  <div class="cooked-layout container-fluid p-0">
    
    <header class="navbar navbar-expand bg-white fixed-top shadow-sm px-4 top-navbar d-flex align-items-center justify-content-between">
      
      <div class="nav-left-zone">
        <button 
          v-if="tabAttiva === 'profilo'" 
          class="btn btn-back rounded-circle d-flex align-items-center justify-content-center p-0"
          @click="tabAttiva = 'ricerca'"
          title="Torna alla Home"
        >
          ←
        </button>

        <div 
          v-else 
          class="nav-left-logo cursor-pointer fw-bolder fs-4" 
          @click="tabAttiva = 'ricerca'"
        >
          Cooked<span class="logo-dot">.</span>
        </div>
      </div>

      <div v-if="tabAttiva !== 'profilo'" class="search-container flex-grow-1 mx-3 mx-md-5">
        <form @submit.prevent="avviaRicerca" class="w-100 position-relative">
          <span class="search-icon position-absolute top-50 translate-middle-y start-3 ms-3 text-muted">🔍</span>
          <input 
            type="text" 
            v-model="testoRicerca" 
            placeholder="Cerca ricette, ingredienti o chef..." 
            class="form-control rounded-pill border-0 bg-custom-search px-5 py-2"
          />
        </form>
      </div>
      <div v-else class="flex-grow-1"></div>

      <div class="nav-right-profile">
        <button 
          class="btn btn-profile rounded-circle d-flex align-items-center justify-content-center p-0"
          :class="{ 'active-profile': tabAttiva === 'profilo' }"
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

    <div class="main-wrapper">
      <main class="content-render container py-4 py-md-5">
        
        <div v-if="tabAttiva === 'ricerca'" class="animate-fade-in">
          <div class="mb-4 text-start">
            <h1 class="fw-extrabold text-antracite display-6 mb-2">Cerca la tua Ricetta</h1>
            <p class="text-secondary fs-6">Seleziona una categoria rapida per iniziare l'ispirazione culinaria</p>
          </div>

          <div class="d-flex flex-wrap gap-2 mb-5">
            <button 
              v-for="categoria in categorie" 
              :key="categoria.id"
              type="button"
              class="btn chip-tag rounded-pill px-4 fw-bold border"
              :class="{ 'active': categoriaAttiva === categoria.id, [categoria.colore]: true }"
              @click="categoriaAttiva = categoria.id"
            >
              {{ categoria.nome }}
            </button>
          </div>

          <div class="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            <div class="col">
              <div class="card border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100 recipe-card">
                <div class="bg-orange p-5 text-white d-flex align-items-center justify-content-center text-center ratio ratio-4x3 fw-bold">
                  Esempio Primi
                </div>
                <div class="card-body bg-white p-3">
                  <h5 class="card-title text-antracite fw-bold m-0">Spaghetti alla Chitarra</h5>
                  <small class="text-muted">Chef Pro</small>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100 recipe-card">
                <div class="bg-green p-5 text-white d-flex align-items-center justify-content-center text-center ratio ratio-1x1 fw-bold">
                  Esempio Secondi
                </div>
                <div class="card-body bg-white p-3">
                  <h5 class="card-title text-antracite fw-bold m-0">Filetto alle Erbe</h5>
                  <small class="text-muted">Chef Ercole</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Risultati v-else-if="tabAttiva === 'risultati'" :ricercaQuery="testoRicerca" :categoriaQuery="categoriaAttiva" />
        <DettagliRicetta v-else-if="tabAttiva === 'dettagli'" />
        <AreaPersonale v-else-if="tabAttiva === 'profilo'" :utente="utente" @logout="$emit('logout')" />
      </main>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import Risultati from './Risultati.vue';
import DettagliRicetta from './DettagliRicetta.vue';
import AreaPersonale from './AreaPersonale.vue';

defineProps(['utente']);
defineEmits(['logout']);

const tabAttiva = ref('ricerca');
const testoRicerca = ref('');
const categoriaAttiva = ref('tutte');

const categorie = ref([
  { id: 'tutte', nome: 'Tutte', colore: 'btn-antracite' },
  { id: 'primi', nome: 'Primi Piatti', colore: 'btn-orange' },
  { id: 'secondi', nome: 'Secondi', colore: 'btn-green' },
  { id: 'dolci', nome: 'Dolci', colore: 'btn-yellow' }
]);

const avviaRicerca = () => {
  tabAttiva.value = 'risultati';
};
</script>

<style scoped>
/* Stili Generali e Palette */
.cooked-layout {
  background-color: #F9F7F2;
  min-height: 100vh;
}

.text-antracite { color: #2D3436; }
.bg-custom-search { background-color: #F1EFF4; }
.cursor-pointer { cursor: pointer; }
.fw-extrabold { font-weight: 800; }

.top-navbar {
  height: 70px;
  z-index: 1030;
}

.nav-left-zone {
  min-width: 100px; /* Assicura uno spazio stabile per l'allineamento di logo/bottone */
}

.nav-left-logo {
  letter-spacing: -1px;
}

.logo-dot {
  color: #E67E22;
}
.start-3 { left: 1rem; }

.main-wrapper {
  margin-top: 70px;
}

/* PULSANTE INDIETRO PREMIUM (FRECCIA LATERALE) */
.btn-back {
  width: 44px;
  height: 44px;
  font-size: 22px;
  font-weight: 700;
  color: #2D3436;
  background-color: #F1EFF4;
  border: none;
  transition: all 0.2s ease;
}
.btn-back:hover {
  background-color: #2D3436;
  color: #ffffff;
}

/* ICONA PROFILO CHEF */
.btn-profile {
  width: 44px;
  height: 44px;
  color: #2D3436;
  background-color: #F1EFF4;
  border: none;
  transition: all 0.25s ease;
}
.btn-profile:hover {
  background-color: #e2ded6;
  color: #E67E22;
}
.active-profile {
  background-color: #2D3436 !important;
  color: #ffffff !important;
}

/* STILE DELLE CHIPS */
.chip-tag {
  background-color: #ffffff;
  color: #2D3436;
  border-color: #e2ded6 !important;
  transition: all 0.2s ease;
}
.chip-tag:hover:not(.active) {
  transform: translateY(-1px);
  border-color: #2D3436 !important;
}

.chip-tag.active.btn-antracite { background-color: #2D3436; color: white; border-color: #2D3436 !important; }
.chip-tag.active.btn-orange { background-color: #E67E22; color: white; border-color: #E67E22 !important; }
.chip-tag.active.btn-green { background-color: #27AE60; color: white; border-color: #27AE60 !important; }
.chip-tag.active.btn-yellow { background-color: #F1C40F; color: white; border-color: #F1C40F !important; }

.bg-orange { background-color: #E67E22; }
.bg-green { background-color: #27AE60; }

.recipe-card {
  transition: transform 0.25s ease;
  cursor: pointer;
}
.recipe-card:hover {
  transform: translateY(-4px);
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>