<template>
  <div class="pinterest-layout container-fluid p-0">
    
    <header class="navbar navbar-expand bg-white fixed-top shadow-sm px-4 top-navbar">
      <div class="nav-left-spacer d-none d-md-block"></div>

      <div class="search-container flex-grow-1 mx-2 mx-md-5">
        <form @submit.prevent="avviaRicerca" class="w-100 position-relative">
          <span class="search-icon position-absolute top-50 translate-middle-y start-3 ms-3 text-muted">🔍</span>
          <input 
            type="text" 
            v-model="testoRicerca" 
            placeholder="Cerca ricette, ingredienti o chef..." 
            class="form-control rounded-pill border-0 bg-pinterest px-5 py-2"
          />
        </form>
      </div>

      <div class="nav-right-logo cursor-pointer fw-bolder fs-4" @click="tabAttiva = 'ricerca'">
        Cooked<span class="logo-dot">.</span>🧑‍🍳
      </div>
    </header>

    <div class="d-flex main-wrapper">
      
      <aside class="sidebar-menu bg-white d-flex flex-column justify-content-between align-items-center py-4 border-end">
        <div class="d-flex flex-column gap-3 w-100 align-items-center sidebar-links">
          <button 
            class="btn btn-icon rounded-circle d-flex align-items-center justify-content-center"
            :class="{ 'active-antracite': tabAttiva === 'ricerca' }" 
            @click="tabAttiva = 'ricerca'" 
            title="Home / Ricerca"
          >
            🏠
          </button>
          <button 
            class="btn btn-icon rounded-circle d-flex align-items-center justify-content-center"
            :class="{ 'active-antracite': tabAttiva === 'risultati' }" 
            @click="tabAttiva = 'risultati'" 
            title="Risultati"
          >
            📊
          </button>
          <button 
            class="btn btn-icon rounded-circle d-flex align-items-center justify-content-center"
            :class="{ 'active-antracite': tabAttiva === 'dettagli' }" 
            @click="tabAttiva = 'dettagli'" 
            title="Dettagli Ricetta"
          >
            📖
          </button>
          <button 
            class="btn btn-icon rounded-circle d-flex align-items-center justify-content-center"
            :class="{ 'active-antracite': tabAttiva === 'profilo' }" 
            @click="tabAttiva = 'profilo'" 
            title="Area Personale"
          >
            👤
          </button>
        </div>
        
        <button class="btn btn-icon rounded-circle logout-btn d-flex align-items-center justify-content-center" @click="$emit('logout')" title="Esci">
          🚪
        </button>
      </aside>

      <main class="content-render flex-grow-1 p-4 p-md-5">
        
        <div v-if="tabAttiva === 'ricerca'" class="animate-fade-in">
          <div class="mb-4">
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
        <AreaPersonale v-else-if="tabAttiva === 'profilo'" :utente="utente" />
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
/* Integrazione Palette Colori Ufficiali */
.pinterest-layout {
  background-color: #F9F7F2; /* Panna */
  min-height: 100vh;
}

.text-antracite { color: #2D3436; }
.bg-pinterest { background-color: #F1EFF4; }
.cursor-pointer { cursor: pointer; }
.fw-extrabold { font-weight: 800; }

/* NAVBAR COMPENSAZIONE */
.top-navbar {
  height: 70px;
  z-index: 1030;
}
.nav-left-spacer {
  width: 75px;
}
.logo-dot {
  color: #E67E22; /* Arancione */
}
.start-3 { left: 1rem; }

/* INVOLUCRO CORPO */
.main-wrapper {
  margin-top: 70px;
}

/* SIDEBAR REATTIVA */
.sidebar-menu {
  width: 75px;
  position: fixed;
  top: 70px;
  bottom: 0;
  left: 0;
  z-index: 1020;
}
.btn-icon {
  width: 48px;
  height: 48px;
  font-size: 1.25rem;
  border: none;
  background: transparent;
  transition: all 0.2s ease;
}
.btn-icon:hover:not(.active-antracite) {
  background-color: #F1EFF4;
}

/* Stato Attivo Sidebar (Antracite) */
.active-antracite {
  background-color: #2D3436 !important;
  color: white !important;
}

/* CONTENUTO */
.content-render {
  margin-left: 75px;
}

/* STILE DELLE CHIPS (FILTRI) CON I COLORI DELLA PALETTE */
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

/* Classi attive per i bottoni dei filtri */
.chip-tag.active.btn-antracite { background-color: #2D3436; color: white; border-color: #2D3436 !important; }
.chip-tag.active.btn-orange { background-color: #E67E22; color: white; border-color: #E67E22 !important; }
.chip-tag.active.btn-green { background-color: #27AE60; color: white; border-color: #27AE60 !important; }
.chip-tag.active.btn-yellow { background-color: #F1C40F; color: white; border-color: #F1C40F !important; }

/* Colorazioni di esempio schede */
.bg-orange { background-color: #E67E22; }
.bg-green { background-color: #27AE60; }

/* Card Hover effect */
.recipe-card {
  transition: transform 0.25s ease;
  cursor: pointer;
}
.recipe-card:hover {
  transform: translateY(-4px);
}

/* Animazione fluida al cambio tab */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Mobile responsive fixes */
@media (max-width: 768px) {
  .content-render { margin-left: 0; padding-bottom: 80px; }
  .sidebar-menu {
    width: 100%;
    height: 60px;
    flex-direction: row !important;
    position: fixed;
    top: auto;
    bottom: 0;
    border-top: 1px solid rgba(0,0,0,0.1);
    padding: 0 20px !important;
  }
  .sidebar-links {
    flex-direction: row !important;
    justify-content: space-around;
  }
  .main-wrapper { margin-top: 70px; }
}
</style>